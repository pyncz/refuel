// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

import "./utils/AnyTokenOperator.sol";
import "./utils/gelato/AutomateReady.sol";
import "./utils/IRefuel.sol";
import "./utils/IWETH9.sol";

/**
 * @title Refuel balance by swapping from another token
 * @author Pau Yankovski <https://github.com/pyncz>
 * @notice Replenish balance of an erc20 or the native token by swapping from the erc20 token of your choice
 */
contract Refuel is IRefuel, AnyTokenOperator, AutomateReady {
    /**
     * @notice Address which is the owner of the contract
     */
    address payable public owner;

    /**
     * @notice Address which is the owner of the contract
     * @dev Used as the intermediate currency in case of swapping for a native token
     */
    IWETH9 public immutable WETH9;

    /**
     * @notice Address of the Uniswap v3 SwapRouter
     * See https://github.com/Uniswap/v3-periphery/blob/main/deploys.md
     */
    ISwapRouter public immutable swapRouter;

    /**
     * @notice Pool fee
     * @dev aka Tier.
     * Available values are 500 (0.05%) / 3000 (0.3%) / 10000 (1%)
     */
    uint24 public constant poolFee = 3000;

    constructor(
        ISwapRouter _swapRouter,
        address _automate,
        IWETH9 _weth9Address
    ) AutomateReady(_automate) {
        owner = payable(msg.sender);
        swapRouter = _swapRouter;
        WETH9 = _weth9Address;
    }

    /**
     * @notice Swap from the source token to the token to replenish, and pay Gelato automation fee
     * @dev The `_recipient` address must approve this contract to spend at least `_sourceAmountMax` worth of the source token for this function to succeed.
     * @param _recipient Address of the user account. We don't use msg.sender as sender will be the gelato automation contract
     * @param _sourceToken The address of the source token
     * @param _sourceAmountMax Max amount of the source token to exchange. If 0 is provided, tokenSupply will be used
     * @param _targetToken The address of the target token. Use `0xEee...EEeE` placeholder for the native token
     * @param _targetAmount The exact amount of the target token to replenish
     * @return amountSpent The amount of the source token spent
     */
    function execute(
        address _recipient,
        address _sourceToken,
        uint256 _sourceAmountMax,
        address _targetToken,
        uint256 _targetAmount
    )
        external
        onlyDedicatedMsgSender(_recipient)
        returns (uint256 amountSpent)
    {
        // - _recipient must approve this contract
        // - Let's assume we checked that the balance needs to be replenished via the resolver

        uint256 sourceAmountMax = _getAvailableAmount(
            _recipient,
            _sourceToken,
            _sourceAmountMax
        );

        /**
         * Perform the actual swap
         */
        uint256 amountSpentOnSwap = swapExactOutput(
            _recipient,
            _recipient,
            _sourceToken,
            sourceAmountMax,
            _targetToken,
            _targetAmount
        );

        // Pay gelato for automation
        (uint256 gelatoFee, address gelatoFeeToken) = _getFeeDetails();
        // If zero address is provided, pay with native token by default
        address safeGelatoFeeToken = gelatoFeeToken == address(0)
            ? NATIVE
            : gelatoFeeToken;

        uint256 amountSpentOnGelatoFee = swapExactOutput(
            _recipient,
            _gelato,
            _sourceToken,
            // Remainder of the max allowed balance to spend after the main swap
            sourceAmountMax - amountSpentOnSwap,
            safeGelatoFeeToken,
            gelatoFee
        );

        amountSpent = amountSpentOnSwap + amountSpentOnGelatoFee;
    }

    /**
     * @notice Swaps a minimum possible amount of the source token for a fixed amount of the target token.
     * @dev Sponsor and recipient are separated params so we can use this method for paying Gelato fee having `feeToken` swapped from the source token as well
     * @dev We don't use msg.sender as sender will be the gelato automation contract
     * @param _sponsor Address of the account.
     * @param _recipient Address of the account who receives the swapped assets
     * @param _sourceToken The address of the source token
     * @param _sourceAmountMax Max amount of the source token to exchange. If 0 is provided, tokenSupply will be used
     * @param _targetToken The address of the target token. Use `0xEee...EEeE` placeholder for the native token
     * @param _targetAmount The exact amount of the target token for recipient to receive
     * @return amountSpent The amount of the source token spent
     */
    function swapExactOutput(
        address _sponsor,
        address _recipient,
        address _sourceToken,
        uint256 _sourceAmountMax,
        address _targetToken,
        uint256 _targetAmount
    ) internal returns (uint256 amountSpent) {
        // Cannot accept the native token as the source because the approval
        // by the end user is required, which is not possible for native tokens.
        require(
            !_isNative(_sourceToken),
            "The native token cannot be the source token!"
        );

        require(
            _sourceToken != _targetToken,
            "Source and target tokens cannot be the same!"
        );

        // Use the whole balance as the max amount if it's not specified explicitly
        // (unused amount will be refunded anyway)
        uint256 sourceAmountMax = _getAvailableAmount(
            _sponsor,
            _sourceToken,
            _sourceAmountMax
        );

        require(
            sourceAmountMax > 0,
            "Balance of the source token should be more than 0!"
        );

        // Transfer the max amount of the source token from _sponsor to this contract.
        TransferHelper.safeTransferFrom(
            _sourceToken,
            _sponsor,
            address(this),
            sourceAmountMax
        );

        // Approve the router to spend the received amount of the source token
        TransferHelper.safeApprove(
            _sourceToken,
            address(swapRouter),
            sourceAmountMax
        );

        /**
         * If it's a swap for a native token...
         */
        bool isTargetNative = _isNative(_targetToken);
        // - Use WETH9, and then unwrap
        address targetTokenAddress = isTargetNative
            ? address(WETH9)
            : _targetToken;

        // - Use this contract as a recipient first to re-transfer unwrapped to the target _recipient afterwards
        address recipientAddress = isTargetNative ? address(this) : _recipient;

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: _sourceToken,
                tokenOut: targetTokenAddress,
                fee: poolFee,
                recipient: recipientAddress,
                deadline: block.timestamp,
                amountOut: _targetAmount,
                amountInMaximum: sourceAmountMax,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountSpent needed to exchange
        // in order to receive the desired _targetAmount.
        amountSpent = swapRouter.exactOutputSingle(params);

        // If it's a swap for a native token...
        if (isTargetNative) {
            // - unwrap received amount of the wrapped native token
            WETH9.withdraw(_targetAmount);
            // - re-transfer unwrapped native token to the target _recipient
            TransferHelper.safeTransferETH(_recipient, _targetAmount);
        }

        // For exact output swaps, the sourceAmountMax may not have all been spent.
        // If the actual amount spent (amountSpent) is less than the specified maximum amount, we must refund the _sponsor and approve the swapRouter to spend 0.
        if (amountSpent < sourceAmountMax) {
            // recall the rest of the approved amount
            TransferHelper.safeApprove(_sourceToken, address(swapRouter), 0);
            // refund
            TransferHelper.safeTransfer(
                _sourceToken,
                _sponsor,
                sourceAmountMax - amountSpent
            );
        }
    }

    /**
     * @notice Get available amount of the token owned by address
     * @param _holder Address of the owner of the token whose balance is checked
     * @param _token Address of the checked token. Use `0xEee...EEeE` placeholder for the native token
     * @param _maxAmount Max amount to return. Will be returned if the balance is greater
     */
    function _getAvailableAmount(
        address _holder,
        address _token,
        uint256 _maxAmount
    ) internal view returns (uint256 availableAmount) {
        (uint256 balance, ) = _checkBalance(_token, _holder);
        availableAmount = _maxAmount > 0 && _maxAmount < balance
            ? _maxAmount
            : balance;
    }

    receive() external payable {}
}

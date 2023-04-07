// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./utils/AnyTokenOperator.sol";
import "./utils/gelato/AutomateReady.sol";
import "./utils/IRefuel.sol";
import "./utils/IWETH.sol";

contract Refuel is IRefuel, AnyTokenOperator, AutomateReady {
    address payable public owner;

    address public immutable WETH;
    ISwapRouter public immutable swapRouter;

    // 500 (0.05%) / 3000 (0.3%) / 10000 (1%)
    uint24 public constant poolFee = 3000;

    constructor(
        ISwapRouter _swapRouter,
        address _automate,
        address _wethAddress
    ) AutomateReady(_automate) {
        owner = payable(msg.sender);
        swapRouter = _swapRouter;
        WETH = _wethAddress;
    }

    /// @notice execute swaps a minimum possible amount of the source token for a fixed amount of the target token.
    /// @dev The calling address must approve this contract to spend at least `_amount` worth of the source token for this function to succeed.
    /// @param _recipient Address of the user account. We don't use msg.sender as sender will be the gelato automation contract
    /// @param _sourceToken The address of the source token
    /// @param _sourceAmountMax Max amount of the source token to exchange
    /// @param _targetToken The address of the target token
    /// @param _targetAmount The exact amount of the target token to receive
    /// @return amountSpent The amount of the source token spent
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
        // NOTE:
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

        /**
         * Pay gelato for automation
         */
        // NOTE: Only native network token is available for now
        // @see https://docs.gelato.network/developer-services/automate/paying-for-your-transactions
        (uint256 gelatoFee, address gelatoFeeToken) = _getFeeDetails();

        uint256 amountSpentOnGelatoFee = swapExactOutput(
            _recipient,
            _gelato,
            _sourceToken,
            // Remainder of the max allowed balance to spend after the main swap
            sourceAmountMax - amountSpentOnSwap,
            gelatoFeeToken,
            gelatoFee
        );

        amountSpent = amountSpentOnSwap + amountSpentOnGelatoFee;
    }

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
         * If it's a swap into a native token...
         */
        bool isTargetNative = _isNative(_targetToken);
        // - Use WETH, and then unwrap
        address targetTokenAddress = isTargetNative ? WETH : _targetToken;
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

        // If it's a swap into a native token...
        if (isTargetNative) {
            // - unwrap received amount of the wrapped native token
            IWETH(WETH).withdraw(_targetAmount);
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

    function _getAvailableAmount(
        address _holder,
        address _token,
        uint256 _maxAmount
    ) internal view returns (uint256 availableAmount) {
        uint256 tokenBalance = IERC20(_token).balanceOf(_holder);
        availableAmount = _maxAmount > 0 && _maxAmount < tokenBalance
            ? _maxAmount
            : tokenBalance;
    }
}

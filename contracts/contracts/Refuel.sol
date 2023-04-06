// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

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

    /// @notice swapExactOutput swaps a minimum possible amount of the source token for a fixed amount of the target token.
    /// @dev The calling address must approve this contract to spend at least `_amount` worth of the source token for this function to succeed.
    /// @param _account Address of the user account. We don't use msg.sender as sender will be the gelato automation contract
    /// @param _sourceToken The address of the source token
    /// @param _sourceAmountMax Max amount of the source token to exchange
    /// @param _targetToken The address of the target token
    /// @param _targetAmount The exact amount of the target token to receive
    /// @return amountSpent The amount of the source token spent
    function swapExactOutput(
        address _account,
        address _sourceToken,
        uint256 _sourceAmountMax,
        address _targetToken,
        uint256 _targetAmount
    ) external onlyDedicatedMsgSender(_account) returns (uint256 amountSpent) {
        // NOTE:
        // - _account must approve this contract
        // - Let's assume we checked that the balance needs to be replenished via the resolver

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

        // Transfer the specified amount of the source token to this contract.
        TransferHelper.safeTransferFrom(
            _sourceToken,
            _account,
            address(this),
            _sourceAmountMax
        );

        // Approve the router to spend the received amount of the source token
        TransferHelper.safeApprove(
            _sourceToken,
            address(swapRouter),
            _sourceAmountMax
        );

        /**
         * If it's a swap into a native token...
         */
        bool isTargetNative = _isNative(_targetToken);
        // - Use WETH, and then unwrap
        address targetTokenAddress = isTargetNative ? WETH : _targetToken;
        // - Use this contract as a recipient first to re-transfer unwrapped to the target account afterwards
        address recipientAddress = isTargetNative ? address(this) : _account;

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: _sourceToken,
                tokenOut: targetTokenAddress,
                fee: poolFee,
                recipient: recipientAddress,
                deadline: block.timestamp,
                amountOut: _targetAmount,
                amountInMaximum: _sourceAmountMax,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountSpent needed to exchange
        // in order to receive the desired _targetAmount.
        amountSpent = swapRouter.exactOutputSingle(params);

        // If it's a swap into a native token...
        if (isTargetNative) {
            // - unwrap received amount of the wrapped native token
            IWETH(WETH).withdraw(_targetAmount);
            // - re-transfer unwrapped native token to the target account
            TransferHelper.safeTransferETH(_account, _targetAmount);
        }

        // For exact output swaps, the _sourceAmountMax may not have all been spent.
        // If the actual amount spent (amountSpent) is less than the specified maximum amount, we must refund the _account and approve the swapRouter to spend 0.
        if (amountSpent < _sourceAmountMax) {
            // recall the rest of the approved amount
            TransferHelper.safeApprove(_sourceToken, address(swapRouter), 0);
            // refund
            TransferHelper.safeTransfer(
                _sourceToken,
                _account,
                _sourceAmountMax - amountSpent
            );
        }

        // Pay gelato for automation
        (uint256 fee, address feeToken) = _getFeeDetails();
        _transferGelatoFee(fee, feeToken);
    }
}

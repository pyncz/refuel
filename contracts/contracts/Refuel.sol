// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

import "./utils/AnyTokenOperator.sol";
import "./utils/IRefuel.sol";

contract Refuel is AnyTokenOperator, IRefuel {
    address payable public owner;
    ISwapRouter public immutable swapRouter;

    // 500 (0.05%) / 3000 (0.3%) / 10000 (1%)
    uint24 public constant poolFee = 3000;

    constructor(ISwapRouter _swapRouter) payable {
        owner = payable(msg.sender);
        swapRouter = _swapRouter;
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of DAI for a fixed amount of WETH.
    /// using the DAI/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.
    /// @dev The calling address must approve this contract to spend at least `_amount` worth of the source token for this function to succeed.
    //
    /// @param _account Address of the user account. We don't use msg.sender as sender will be the gelato automation contract
    /// @param _sourceToken The address of the source token
    /// @param _sourceAmountMax Max amount of the source token to exchange
    /// @param _targetToken The address of the target token
    /// @param _targetAmount The exact amount of the target token to receive
    //
    /// @return amountSpent The amount of the source token spent
    function swapExactOutput(
        address _account,
        address _sourceToken,
        uint256 _sourceAmountMax,
        address _targetToken,
        uint256 _targetAmount
    ) external returns (uint256 amountSpent) {
        // NOTE:
        // - _account must approve this contract
        // - Let's assume we checked that the balance needs to be replenished via the resolver

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

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: _sourceToken,
                tokenOut: _targetToken,
                fee: poolFee,
                recipient: _account,
                deadline: block.timestamp,
                amountOut: _targetAmount,
                amountInMaximum: _sourceAmountMax,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountSpent = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the _sourceMaxAmount may not have all been spent.
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
    }
}

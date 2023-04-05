// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IRefuel {
    function swapExactOutput(
        address _account,
        address _sourceToken,
        uint256 _sourceAmountMax,
        address _targetToken,
        uint256 _targetAmount
    ) external returns (uint256 amountSpent);
}

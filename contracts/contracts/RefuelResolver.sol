// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./utils/AnyTokenOperator.sol";
import "./utils/IRefuel.sol";

contract RefuelResolver is AnyTokenOperator {
    function checker(
        address _account,
        address _sourceToken,
        uint256 _sourceMaxAmount,
        address _targetToken,
        uint256 _targetAmount,
        uint256 _threshold
    ) external view returns (bool canExec, bytes memory execPayload) {
        // check target balance
        (uint256 balance, ) = _checkBalance(_targetToken, _account);

        // exec if we need to replenish the balance
        canExec = balance < _threshold;

        // passthrough all the arguments
        execPayload = abi.encodeCall(
            IRefuel.swapExactOutput,
            (
                _account,
                _sourceToken,
                _sourceMaxAmount,
                _targetToken,
                _targetAmount
            )
        );
    }
}

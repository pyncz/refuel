// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./utils/AnyTokenOperator.sol";
import "./utils/IRefuel.sol";

/**
 * @title Resolver for the Refuel contract
 * @author Pau Yankovski <https://github.com/pyncz>
 * @notice Allow Gelato to execute a call of the Refuel if the balance is needed to replenish
 */
contract RefuelResolver is AnyTokenOperator {
    /**
     * @notice Check if the balance is needed to replenish
     * @dev If `_targetAmount` is not enough to reach the threshold, sufficient amount will be passed in the Refuel replenishment method
     * @param _recipient Address of the account whose balance is checked
     * @param _sourceToken Address of the source token to pass to Refuel replenishment method in case of need for replenishment
     * @param _sourceMaxAmount Max amount to spend on one execution passed to Refuel replenishment method
     * @param _targetToken Address of the token which balance we check. Use `0xEee...EEeE` placeholder for the native token
     * @param _targetAmount Amount of the target token to replenish
     * @param _threshold If the balance is less than threshold the execution will be triggered
     * @return canExec Boolean flag if the execution is neeeded
     * @return execPayload Encoded data of the execution call
     */
    function checker(
        address _recipient,
        address _sourceToken,
        uint256 _sourceMaxAmount,
        address _targetToken,
        uint256 _targetAmount,
        uint256 _threshold
    ) external view returns (bool canExec, bytes memory execPayload) {
        // check target balance
        (uint256 balance, ) = _checkBalance(_targetToken, _recipient);

        // exec if we need to replenish the balance
        canExec = balance < _threshold;

        // replenish up to the threshold if only a predefined top-up isn't enough
        uint256 amountToReplenish = balance + _targetAmount < _threshold
            ? _threshold - balance
            : _targetAmount;

        // passthrough all the arguments
        execPayload = abi.encodeCall(
            IRefuel.execute,
            (
                _recipient,
                _sourceToken,
                _sourceMaxAmount,
                _targetToken,
                amountToReplenish
            )
        );
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./Types.sol";
import "../AnyTokenOperator.sol";

/**
 * @dev Inherit this contract to allow your smart contract to
 * - Make synchronous fee payments.
 * - Have call restrictions for functions to be automated.
 */
abstract contract AutomateReady is AnyTokenOperator {
    IAutomate public immutable automate;
    address internal immutable _gelato;

    address private constant OPS_PROXY_FACTORY =
        0xC815dB16D4be6ddf2685C201937905aBf338F5D7;

    constructor(address _automate) {
        automate = IAutomate(_automate);
        _gelato = automate.gelato();
    }

    /**
     * @dev Only tasks created by the provided _taskCreator
     * or the _taskCreator himself can call the functions with this modifier.
     */
    modifier onlyDedicatedMsgSender(address _taskCreator) {
        // Get who will be a sender for the tasks created by the account
        (address dedicatedMsgSender, ) = IOpsProxyFactory(OPS_PROXY_FACTORY)
            .getProxyOf(_taskCreator);

        require(
            msg.sender == dedicatedMsgSender || msg.sender == _taskCreator,
            "Only dedicated msg.sender"
        );
        _;
    }

    function _getFeeDetails()
        internal
        view
        returns (uint256 fee, address feeToken)
    {
        (fee, feeToken) = automate.getFeeDetails();
    }
}

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
    address private immutable _gelato;

    address private constant OPS_PROXY_FACTORY =
        0xC815dB16D4be6ddf2685C201937905aBf338F5D7;

    constructor(address _automate) {
        automate = IAutomate(_automate);
        _gelato = IAutomate(_automate).gelato();
    }

    /**
     * @dev
     * Only tasks created by the provided _account
     * can call the functions with this modifier.
     */
    modifier onlyDedicatedMsgSender(address _account) {
        // Get who will be a sender for the tasks created by the user account
        (address dedicatedMsgSender, ) = IOpsProxyFactory(OPS_PROXY_FACTORY)
            .getProxyOf(_account);

        require(msg.sender == dedicatedMsgSender, "Only dedicated msg.sender");
        _;
    }

    /**
     * @dev
     * Transfers fee to gelato for synchronous fee payments.
     * _fee & _feeToken should be queried from IAutomate.getFeeDetails()
     */
    function _transferGelatoFee(uint256 _fee, address _feeToken) internal {
        if (_isNative(_feeToken)) {
            TransferHelper.safeTransferETH(_gelato, _fee);
        } else {
            TransferHelper.safeTransfer(_feeToken, _gelato, _fee);
        }
    }

    function _getFeeDetails()
        internal
        view
        returns (uint256 fee, address feeToken)
    {
        (fee, feeToken) = automate.getFeeDetails();
    }
}

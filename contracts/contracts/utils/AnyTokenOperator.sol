// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract AnyTokenOperator {
    address internal constant NATIVE =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    function _checkBalance(
        address _token,
        address _holder
    ) internal view returns (uint256 balance, bool isNative) {
        if (_token == NATIVE) {
            return (_holder.balance, true);
        } else {
            return (IERC20(_token).balanceOf(_holder), false);
        }
    }

    function _isNative(address _token) internal pure returns (bool) {
        return _token == NATIVE;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

interface IAutomate {
    function getFeeDetails() external view returns (uint256, address);

    function gelato() external view returns (address payable);
}

interface IOpsProxyFactory {
    function getProxyOf(address account) external view returns (address, bool);
}

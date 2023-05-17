// SPDX-License-Identifier:MIT

pragma solidity ^0.8.3;

interface CrytikLiquidityPoolV1Interface {
    function isPool() external view returns (bool);

    function createPool(
        address tokenA,
        address tokenB,
        uint256 initialA,
        uint256 initialB
    ) external returns (address);
}

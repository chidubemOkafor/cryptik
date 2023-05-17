// SPDX-License-Identifier:MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Usdt is ERC20 {
    constructor() ERC20("usdT0ken", "USDT") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}

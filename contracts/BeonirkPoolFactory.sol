// SPDX-License-Identifier:MIT

pragma solidity ^0.8.3;

import "./BeonirkLiquidityPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BeonirkPoolFactory {
    address public Admin;

    address[] public createdPools;
    mapping(address => mapping(address => address)) public pools;
    //event
    event poolCreated(
        address indexed token1,
        address indexed token2,
        address LPoolAddress
    );

    modifier onlyAdmin() {
        require(Admin == msg.sender, "invalid right");
        _;
    }

    constructor() {
        Admin = msg.sender;
    }

    // this function returns false if the pool does not exist
    function isPool(address tokenA, address tokenB) public view returns (bool) {
        return pools[tokenA][tokenB] != address(0);
    }

    // require msg.value checks if the value of ether being sent is equal to poolcreationprice
    // later i will make use of oppennzeppeli isContract function to check if the address of tokens being used as parameters are valid erc20 tokens
    // isPool fails if the pool has already been created before
    function createPool(
        address _tokenA,
        address _tokenB,
        uint256 initialA,
        uint256 initialB
    ) external returns (address poolAddress) {
        IERC20 tokenA = IERC20(_tokenA);
        IERC20 tokenB = IERC20(_tokenB);
        require(_tokenA != address(0), "this is a zero address");
        require(_tokenB != address(0), "this is a zero address");
        require(_tokenA != _tokenB, "duplicate tokens");
        require(!isPool(_tokenA, _tokenB), "pool already exists");
        require(tokenA.balanceOf(msg.sender) > initialA, "not enough tokenA");
        require(tokenB.balanceOf(msg.sender) > initialB, "not enough tokenB");

        (address token0, address token1) = _tokenA < _tokenB
            ? (_tokenA, _tokenB)
            : (_tokenB, _tokenA);
        address newliquidityPool = address(
            new BeonirkLiquidityPool(
                _tokenA,
                _tokenB,
                msg.sender,
                initialA,
                initialB
            )
        );

        // this approves the token before it can be transfered
        tokenA.approve(newliquidityPool, initialA);
        tokenB.approve(newliquidityPool, initialB);

        // this transfers the token to the liquidityPool contract
        require(
            tokenA.transferFrom(msg.sender, newliquidityPool, initialA),
            "failed to transfer tokenA"
        );
        require(
            tokenB.transferFrom(msg.sender, newliquidityPool, initialB),
            "failed to transfer tokenB"
        );

        createdPools.push(newliquidityPool);
        pools[token0][token1] = newliquidityPool;
        pools[token1][token0] = newliquidityPool;
        emit poolCreated(token0, token1, newliquidityPool);
        poolAddress = newliquidityPool;
    }

    // for assess control
    // the functions is used to transfer the admin role
    function transferOwnership(address _newAdmin) external onlyAdmin {
        Admin = _newAdmin;
    }

    // getter functions
    function numberOfPools() external view returns (uint256 num) {
        num = createdPools.length;
    }

    function getPool(
        address _tokenA,
        address _tokenB
    ) external view returns (address poolAddress) {
        poolAddress = pools[_tokenA][_tokenB];
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BeonirkLiquidityPool {
    //state variables
    address public immutable I_tokenA;
    address public immutable I_tokenB;
    uint256 public immutable I_initialA;
    uint256 public immutable I_initialB;

    mapping(address => uint256) public reserve;
    mapping(address => uint256) public balance;
    mapping(address => uint256) public liquidityProviders;

    event liquidityAdded(
        address liquidityProvider,
        uint256 valueA,
        uint256 valueB
    );
    event tokenSwapped(
        address swapper,
        address tokenIn,
        address tokenOut,
        uint256 indexed amountIn,
        uint256 indexed amountOut
    );

    constructor(
        address _tokenA,
        address _tokenB,
        uint256 _initialA,
        uint256 _initialB
    ) {
        I_tokenA = _tokenA;
        I_tokenB = _tokenB;
        I_initialA = _initialA;
        I_initialB = _initialB;

        // this adds the tokens to the pool
        reserve[_tokenA] += _initialA;
        reserve[_tokenB] += _initialB;
    }

    // this function is used to add the liquidity to the liquidity pool
    function addLiquidity(uint256 _valueA, uint256 _valueB) external {
        require(_valueA == _valueB, "Amount must be equal");
        require(_valueA > 0 && _valueB > 0, "Values must be greater than ");
        require(msg.sender != address(0));
        require(
            IERC20(I_tokenA).balanceOf(msg.sender) >= _valueA,
            "not enough tokenA"
        );
        require(
            IERC20(I_tokenB).balanceOf(msg.sender) >= _valueB,
            "not enough tokenB"
        );
        uint256 balance1 = IERC20(I_tokenA).balanceOf(address(this));
        uint256 balance2 = IERC20(I_tokenB).balanceOf(address(this));
        require(
            balance1 >= reserve[I_tokenA] && balance2 >= reserve[I_tokenB],
            ""
        );
        IERC20(I_tokenA).approve(address(this), _valueA);
        IERC20(I_tokenB).approve(address(this), _valueB);
        IERC20(I_tokenA).transferFrom(msg.sender, address(this), _valueA);
        IERC20(I_tokenB).transferFrom(msg.sender, address(this), _valueB);

        reserve[I_tokenA] += _valueA;
        reserve[I_tokenB] += _valueB;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external {
        require(tokenIn != tokenOut, "tokens are the same");
        require(
            tokenIn == I_tokenA || tokenIn == I_tokenB,
            "token is not in pool"
        );
        require(
            tokenOut == I_tokenB || tokenOut == I_tokenA,
            "token is not in pool"
        );
        require(amountIn > 0, "we cant swap a 0 amount");

        uint256 amountOut = getOutputAmount(tokenIn, tokenOut, amountIn);
        require(
            IERC20(tokenOut).balanceOf(address(this)) >= amountOut,
            "insufficient contract balance of output token"
        );
        require(amountOut > 0, "zero output amount");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        reserve[tokenIn] += amountIn;
        reserve[tokenOut] -= amountOut;
        emit tokenSwapped(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function getOutputAmount(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal view returns (uint256) {
        uint256 reserveIn = reserve[tokenIn];
        uint256 reserveOut = reserve[tokenOut];
        uint256 totalreserve = reserveIn * reserveOut;
        return reserveOut - (totalreserve / (reserveIn + amountIn));
    }

    function getReserve() external view returns (uint256, uint256) {
        return (reserve[I_tokenA], reserve[I_tokenB]);
    }

    function removeLiquidity(uint256 liquidity) external {}

    // this function is used to remove all liquidity provided by the liquidity provider
    // function removeLiquidity(uint256 liquidityAmount) external {}

    // // this function is used the calculate a token in the liquidity pool
    // function calculatePrice(
    //     address _token
    // ) internal view returns (uint256 tokenBPrice) {}
}

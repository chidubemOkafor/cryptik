const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("BeonirkPoolFactory", () => {
  let poolFactory,BeonirkLiquidityPool
  let deployer,deployer2, address1, address2;

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("BeonirkPoolFactory");
    poolFactory = await factory.deploy();
    await poolFactory.deployed();
    [deployer, deployer2, address1, address2] = await ethers.getSigners();
  });

  it("should deploy BeonirkPoolFactory", async () => {
    expect(poolFactory.address).to.not.be.undefined;
  });

  describe("isPool", () => {
    it("should return false if pool does not exist", async () => {
      const isPool = await poolFactory.isPool(address1.address, address2.address);
      expect(isPool).to.be.equal(false);
    });
  });

  describe("createPool", () => {
  let poolAddress
  let usdt,weth
    it("should create the pool", async () => {
        const value = ethers.utils.parseEther("200")
      // usdt test tokens
      const usdtToken = await ethers.getContractFactory("Usdt");
      usdt = await usdtToken.deploy();
      await usdt.deployed();

      // weth test tokens
      const wethToken = await ethers.getContractFactory("Weth");
      weth = await wethToken.deploy();
      await weth.deployed();

      await usdt.transfer(deployer2.address, value);
      await weth.transfer(deployer2.address, value);

      // Approve the token transfer from deployer to poolFactory
      await usdt.connect(deployer2).approve(poolFactory.address, value);
      await weth.connect(deployer2).approve(poolFactory.address, value);

       const LiquidityPool = await poolFactory.connect().createPool(weth.address, usdt.address, 200, 200);
       const d = await poolFactory.getPool(usdt.address,weth.address)
       const BeonirkLiquidityPool = await ethers.getContractAt("BeonirkLiquidityPool",poolAddress)
        console.log(BeonirkLiquidityPool.address)
      // Assert the liquidity pool address
       poolAddress = await poolFactory.getPool(usdt.address,weth.address);
  

     console.log(poolAddress.I_tokenA())
      expect(poolAddress.reserve(weth.address)).to.equal(200)
      
      expect(poolAddress).to.not.be.undefined
    });

    it("should return true on isPool", async () => {
        const isPool = await poolFactory.isPool(weth.address,usdt.address);
        expect(isPool).to.be.equal(true)
    })

    it("should return the pool address from the tokens", async () => {
        const poolAddress = await poolFactory.getPool(usdt.address,weth.address)
        expect(poolAddress).to.equal(BeonirkLiquidityPool.address)
    })

    describe("getPool",() => {
        it("should get the pools", async () => {

        })
    })
  });
});

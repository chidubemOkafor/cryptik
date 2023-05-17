const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("BeonirkPoolFactory", function () {
  let Factory, tokenA, tokenB;
  let user, secondUser, thirdUser;
  let fourthUser, fifthUser;
  let pool;
  let initialUsdt;
  let initialWeth;

  // the state needs to be persistent
  before(async () => {
    const tokena = await ethers.getContractFactory("Usdt");
    tokenA = await tokena.deploy();
    await tokenA.deployed();

    const tokenb = await ethers.getContractFactory("Weth");
    tokenB = await tokenb.deploy();
    await tokenB.deployed();
  });

  beforeEach(async () => {
    const poolFactory = await ethers.getContractFactory("BeonirkPoolFactory");
    Factory = await poolFactory.deploy();
    await Factory.deployed();

    [user, secondUser, thirdUser, fourthUser, fifthUser] =
      await ethers.getSigners();
  });
  describe("createPool", function () {
    it("should createLiquidityPool successfully", async () => {
      initialUsdt = ethers.utils.parseEther("1900");
      initialWeth = ethers.utils.parseEther("10");

      await tokenA.approve(Factory.address, initialUsdt);
      await tokenB.approve(Factory.address, initialWeth);

      await tokenA.transferFrom(user.address, Factory.address, initialUsdt);
      await tokenB.transferFrom(user.address, Factory.address, initialWeth);

      const tokenAAddress = tokenA.address;
      const tokenBAddress = tokenB.address;
      console.log(tokenAAddress);
      await Factory.createPool(
        tokenAAddress,
        tokenBAddress,
        initialUsdt,
        initialWeth
      );

      const poolAddress = await Factory.getPool(tokenAAddress, tokenBAddress);
      pool = await ethers.getContractAt("BeonirkLiquidityPool", poolAddress);

      // Assert that the pool was created successfully
      assert.equal(await pool.I_tokenA(), tokenAAddress);
      assert.equal(await pool.I_tokenB(), tokenBAddress);
      assert.equal(
        (await pool.I_initialA()).toString(),
        initialUsdt.toString()
      );
      assert.equal(
        (await pool.I_initialB()).toString(),
        initialWeth.toString()
      );
      assert.equal((await pool.balanceA()).toString(), initialUsdt.toString());
      assert.equal((await pool.balanceB()).toString(), initialWeth.toString());
    }).timeout(60000);

    describe("addLiquidity", function () {
      it("should allow liquidity providers to add liquidity", async () => {
        // first we transfer the tokens to second user from first user
        const newLiquidityA = ethers.utils.parseEther("1000"); //this is a new usdt liquidity
        const newLiquidityB = ethers.utils.parseEther("10"); // this is a new weth liquidity
        console.log(tokenA.address);

        // //this is to approve token transfer
        await tokenA.connect(secondUser).approve(pool.address, newLiquidityA);
        await tokenB.connect(secondUser).approve(pool.address, newLiquidityB);

        // this transfers the token to the second user
        await tokenA.transfer(secondUser.address, newLiquidityA);
        await tokenB.transfer(secondUser.address, newLiquidityB);

        // we have to approve the liquidity pool to spend the token for us
        // then we transfer the tokens to the liquidity pool

        await pool
          .connect(secondUser)
          .addLiquidity(newLiquidityA, newLiquidityB);

        const newBalanceA = initialUsdt.add(newLiquidityA);
        const newBalanceB = initialWeth.add(newLiquidityB);
        expect(await pool.balanceA()).to.equal(newBalanceA);
        expect(await pool.balanceB()).to.equal(newBalanceB);
      });

      it("should revert if liquidity provider does not have enough tokenA", async () => {
        const newLiquidityA = ethers.utils.parseEther("80");
        const newLiquidityB = ethers.utils.parseEther("4");

        await tokenA.transfer(
          thirdUser.address,
          ethers.utils.parseEther("79.999")
        );
        await tokenB.transfer(thirdUser.address, newLiquidityB);

        await expect(
          await pool
            .connect(thirdUser)
            .addLiquidity(newLiquidityA, newLiquidityB)
        ).to.be.revertedWith("not enough tokenA");
      });

      it("should revert if liquidity provider does not have enough tokenB", async () => {
        const newLiquidityA = ethers.utils.parseEther("80");
        const newLiquidityB = ethers.utils.parseEther("4");

        await tokenA.transfer(fourthUser.address, newLiquidityA);
        await tokenB.transfer(
          fourthUser.address,
          ethers.utils.parseEther("3.99")
        );
        console.log(await tokenA.balanceOf(fourthUser.address));
        console.log(await tokenB.balanceOf(fourthUser.address));
        await expect(
          await pool
            .connect(fourthUser)
            .addLiquidity(newLiquidityA, newLiquidityB)
        ).to.be.revertedWith("not enough tokenB");
      });
    });
  });
});

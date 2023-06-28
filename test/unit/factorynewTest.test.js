const {expect,assert} = require("chai")
const {ethers} = require("hardhat")
const {getIsDeployer,log} = require("./helper")

describe("BeonirkLiquidityPool",() => {
    let getPool;
    let USDT, WETH;
    let valueA, valueB
    let deployer, address1, address2, address3
     describe("BeonirkPoolFactory", () => {
            it("should create pool from BeonirkPoolFactory", async () => {
                [deployer, address1, address2, address3] = await ethers.getSigners()
                //===========deploying the factory contract=====
                const beonirkPoolFactory = await ethers.getContractFactory("BeonirkPoolFactory")
                const BeonirkPoolFactory = await beonirkPoolFactory.deploy()
                await BeonirkPoolFactory.deployed()
                //==============================================
                //===========deploying the tokens===============
                const usdt = await ethers.getContractFactory("Usdt");
                USDT = await usdt.deploy()
                await USDT.deployed()
                getIsDeployer(USDT,deployer)

                const weth = await ethers.getContractFactory("Weth");
                WETH = await weth.deploy()
                await WETH.deployed()
                getIsDeployer(WETH,deployer)
                //==============================================
                valueA = ethers.utils.parseEther("50")
                valueB = ethers.utils.parseEther("50")
                //=========approve contract to spend token======
                await USDT.approve(BeonirkPoolFactory.address, valueA)
                await WETH.approve(BeonirkPoolFactory.address, valueB)
                // console.log(BeonirkPoolFactory.address)
                //==============================================

                //create pool from beonirkpoolfactory
                const createPool = await BeonirkPoolFactory.createPool(USDT.address, WETH.address, valueA,valueB,deployer.address)
                const receipt = await createPool.wait()
                // console.log(receipt)
                getPool  = await BeonirkPoolFactory.getPool(USDT.address, WETH.address)
                expect(getPool).to.not.be.undefined
            })
     })
     describe("createPool", () => {
        let poolAddress
        it("should get the token address in the pool", async () => {
            poolAddress = await ethers.getContractAt("BeonirkLiquidityPool", getPool)
            // here i should get the address used to create the pool in pool factopry
            const address1 = await poolAddress.I_tokenA() // I reps immutable
            const address2 = await poolAddress.I_tokenB()
            expect(address1).to.equal(USDT.address)
            expect(address2).to.equal(WETH.address)
            console.log(deployer)
        })
        it("should return the values of token deposited", async () => {
            const value1 = await poolAddress.reserve(USDT.address)
            const value2 = await poolAddress.reserve(WETH.address)
            expect(value1).to.equal(valueA)
            expect(value2).to.equal(valueB)
        })
        it("should return the address of the initial liquidity proivider", async () =>{
            const initialProvider = await poolAddress.liquidityProvidersArray(0)
            console.log(initialProvider)
            expect(initialProvider).to.equal(deployer.address)
        })
        it("should return the value of the token deposited from the address of the deployer", async () => {
            // const lpBalance = await poolAddress.lpBalances(.address)
            // console.log()
        })
     })
})
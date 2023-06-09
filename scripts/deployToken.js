const {ethers} = require("hardhat")

async function main() {
    const Weth = await ethers.getContractFactory("Weth")
    const WETH = await Weth.deploy()
    await WETH.deployed()
    console.log(`weth deployed at ${WETH.address}`)

    const Usdt = await ethers.getContractFactory("Usdt")
    const USDT = await Usdt.deploy()
    await USDT.deployed()
    console.log(`usdt deployed at ${USDT.address}`)
}

main().catch((error) => 
{console.error(error)})
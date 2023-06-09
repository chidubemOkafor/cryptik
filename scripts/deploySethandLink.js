const {ethers} = require("hardhat")

async function main() {
    const Sole = await ethers.getContractFactory("Sole")
    const SOLE = await Sole.deploy()
    await SOLE.deployed()
    console.log(`sole deployed at ${SOLE.address}`)
//0xdF325C412f18a9FAaF15354C694cFFEd1a883e0E
    const Link = await ethers.getContractFactory("Link")
    const LINK = await Link.deploy()
    await LINK.deployed()
    console.log(`link deployed at ${LINK.address}`)
//0x8f56B0B9B9D2f4817e519345e0914aD1Ed5882f4
}

main().catch((error) => 
{console.error(error)})
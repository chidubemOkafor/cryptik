const { ethers }= require("hardhat");

async function main() {
  const BeonirkFactory= await ethers.getContractFactory("BeonirkPoolFactory");
  const BeonirkPoolFactory = await BeonirkFactory.deploy()
  await BeonirkPoolFactory.deployed()
  console.log(`contract succesfully deployed at ${BeonirkPoolFactory.address}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

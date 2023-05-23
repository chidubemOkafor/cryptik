require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_KEY = process.env.ALCHEMY_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const etherscanapikey = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
   localhost: {
    url: "http://localhost:8545",
    chainId: 5777,
   },
   goerli: {
    url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 5,
    accounts: [PRIVATE_KEY]
   },
   mainnet: {
    url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 1,
    accounts: [PRIVATE_KEY]
   },
   ganache: {
    url: `HTTP://127.0.0.1:7545`,
    chainId: 1337,
   }
  },
  etherscan: {
    apiKey: etherscanapikey, // Replace with your actual API key
  },
};

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as configDotenv } from "dotenv";

configDotenv();


// console.log("LSK_SEP_URL:", process.env.LSK_SEP_URL);

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET!
      }
    }
    // "lisk-sepolia": {
    //   url: "https://rpc.sepolia-api.lisk.com",
    //   accounts: process.env.PRIV_KEY ? [process.env.PRIV_KEY] : [],
    // },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
    customChains: [
      {
          network: "lisk-sepolia",
          chainId: 4202,
          urls: {
              apiURL: "https://sepolia-blockscout.lisk.com/api",
              browserURL: "https://sepolia-blockscout.lisk.com"
          }
      }
    ]
    // customChains: [
    //   {
    //     network: "lisk-sepolia",
    //     chainId: 4202,
    //     urls: {
    //       apiURL: "https://rpc.sepolia-api.lisk.com",
    //       browserURL: "https://sepolia-blockscout.lisk.com/", // Replace with actual explorer URL
    //     },
    //   },
    // ],
  },
  sourcify: {
    enabled: false
  }
};

export default config;

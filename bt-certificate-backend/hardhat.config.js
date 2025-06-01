require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.20",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL, // Alchemy/Infura Sepolia URL :contentReference[oaicite:9]{index=9}
            accounts: [process.env.PRIVATE_KEY], // Deploying wallet’s private key
            chainId: 11155111,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
            accounts: [process.env.PRIVATE_KEY], // Only needed if you want to sign from .env account on local
        },
    },
};

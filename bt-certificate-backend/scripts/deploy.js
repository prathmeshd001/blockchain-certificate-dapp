// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    // 1. Compile and get your contract factory
    const Certificate = await ethers.getContractFactory("Certificate");

    // 2. Deploy the contract (returns a pending Contract)
    const certificate = await Certificate.deploy();

    // 3. Wait for the bytecode to be mined
    await certificate.waitForDeployment(); // :contentReference[oaicite:0]{index=0}

    // 4. Fetch the deployed address
    const address = await certificate.getAddress(); // :contentReference[oaicite:1]{index=1}

    console.log("Certificate contract deployed at:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

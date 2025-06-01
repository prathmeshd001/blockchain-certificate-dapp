# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

------for local network
npx hardhat compile
npx hardhat node

------deploying(different terminal)
npx hardhat compile
Nothing to compile
prathmesh@prathmesh-Ins:~/Desktop/IIITA/BT/blockchain-certificate-dapp$ npx hardhat run scripts/deploy.js --network localhost
Certificate contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180ab3

paste this contract address given after deployment in frontend env

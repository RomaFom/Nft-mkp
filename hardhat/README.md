# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a myListed for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat myListed
GAS_REPORT=true npx hardhat myListed
npx hardhat node
npx hardhat run scripts/deploy.ts
```

tutorial on https://medium.com/nerd-for-tech/smart-contract-with-golang-d208c92848a9

solc --optimize --base-path '/' --include-path '../node_modules/' --abi ./Marketplace.sol -o build

solc --optimize --base-path '/' --include-path '../node_modules/' --bin ./Marketplace.sol -o build


abigen --abi=./build/Marketplace.abi --bin=./build/Marketplace.bin --pkg=api --out=../../../GoMkp/pkg/smart-contracts/MarketplaceSC.go

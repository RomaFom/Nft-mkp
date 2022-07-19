import { artifacts, ethers } from "hardhat";
import fs from "fs";
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  //  deploys here
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  console.log("NFT contract address:", nft.address);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(1);
  console.log("Marketplace contract address:", marketplace.address);

  saveFrontEndFiles(nft, "NFT");
  saveFrontEndFiles(marketplace, "Marketplace");
}

function saveFrontEndFiles(contract: any, name: any) {
  const contractsDir = __dirname + "/../../client/contracts";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  fs.writeFileSync(
    contractsDir + "/" + name + "-address.json",
    JSON.stringify({ address: contract.address }, undefined, 2)
  );
  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + "/" + name + ".json",
    JSON.stringify(contractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

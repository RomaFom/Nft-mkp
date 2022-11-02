import { artifacts, ethers } from "hardhat";
import fs from "fs";
import { NFT } from "../typechain-types";
import web3 from "web3";
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

  await init(nft, marketplace, deployer);

  saveFrontEndFiles(nft, "NFT");
  saveFrontEndFiles(marketplace, "Marketplace");
}

async function init(nft: any, marketplace: any, deployer: any) {
  const images = [
    "https://roma-mkp.infura-ipfs.io/ipfs/QmQuZdYrBh1T9ik3EqfP2KjuoZNKEMqH6mKUhaLJJkRn99",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmTaYs8MvEcEbcUjK5Gw85XHsUb8xVAG9nuTNGPeaS7iLk",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmXzS8fFMjtbYF1YLtFw3otqNWbJq6A1pZDdr9PXe5Ckhg",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmPW5dXb9cbJjWMmpZK1cHKPwSTxtsYsQbygk5mtEZTDmL",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmXp22adyvZuVSbamkzRCNZffY5qaMMeuX8H6WYh7dxkRJ",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmdZKVmBktH3TfGfu4WEa4c6eyqY2c5Y1L2DB4ByP5LKy8",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmUy5e2N8YfD5X8QLVHee1SPxBGjVv9tSntAr6fw4fsXqn",
    "https://roma-mkp.infura-ipfs.io/ipfs/QmVL1rbCgZjwRQDuCtKdtDS7Z9nCQkmEAAhsnHSebJqJ37",
  ];

  await nft.connect(deployer).setApprovalForAll(marketplace.address, true);

  for (let i = 0; i < 100; i++) {
    const img = images[Math.floor(Math.random() * images.length)];
    const price = Math.floor(Math.random() * 100) + 1;
    await nft.connect(deployer).mint(deployer.address, img);
    const itemCount = await nft.tokenCount();
    console.log("itemCount", itemCount);
    await marketplace
      .connect(deployer)
      .makeItem(
        nft.address,
        itemCount.toNumber(),
        web3.utils.toWei(price.toString(), "ether")
      );
  }
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

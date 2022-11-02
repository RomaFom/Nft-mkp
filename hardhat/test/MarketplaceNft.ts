import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

describe("NFTMarketplace", async () => {
  let URI =
    "https://img.seadn.io/files/2938ac7dd1768d284d13c6209875bb38.png?fit=max";
  let marketplace: any,
    nft: any,
    deployer: any,
    user1: any,
    user2: any,
    totalPrice: any;
  const _feePercentage = 1;
  beforeEach(async () => {
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const NFT = await ethers.getContractFactory("NFT");
    //Get signers
    [deployer, user1, user2] = await ethers.getSigners();
    //  deploy
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(_feePercentage);
  });
  describe("Deployment contracts", async () => {
    it("Should track name and symbol of the nft collection", async () => {
      expect(await nft.name()).to.eq("DApp NFT");
      expect(await nft.symbol()).to.eq("DAPP");
    });
    it("Should track feeAccount and feePercent of the marketplace", async () => {
      expect(await marketplace.feeAccount()).to.eq(deployer.address);
      expect(await marketplace.feePercent()).to.eq(_feePercentage);
    });
  });
  describe("Minting NFT", async () => {
    it("Should track each minted NFT", async () => {
      await nft.connect(user1).mint(URI);
      expect(await nft.tokenCount()).to.eq(1);
      expect(await nft.balanceOf(user1.address)).to.eq(1);
      expect(await nft.tokenURI(1)).to.eq(URI);
      await nft.connect(user2).mint(URI);
      expect(await nft.tokenCount()).to.eq(2);
      expect(await nft.balanceOf(user1.address)).to.eq(1);
      expect(await nft.tokenURI(1)).to.eq(URI);
    });
  });
  describe("Making marketplace items", async () => {
    beforeEach(async () => {
      await nft.connect(user1).mint(URI);
      await nft.connect(user1).setApprovalForAll(marketplace.address, true);
    });
    // it("Should create 1000 items", async () => {
    //   const images = [
    //     "https://roma-mkp.infura-ipfs.io/ipfs/QmUAFHynVGb3WBPsJWFC9U17GHvGhJkb8zLVPUTHN332DN",
    //     "https://roma-mkp.infura-ipfs.io/ipfs/QmbiTN8TMSdCHF6vPJCs6F7Trecc1hKu4z6Egiogre9zcf",
    //     "https://roma-mkp.infura-ipfs.io/ipfs/QmcAVAj7mopRwADotdUrAhRupSiiX249ekPvJH4TWzQAHD",
    //     "https://roma-mkp.infura-ipfs.io/ipfs/QmSD51Ak29JYNb2FziEvD2VXRsW7dChU61F3Zbf7rnWoed",
    //     "https://roma-mkp.infura-ipfs.io/ipfs/QmTuoGDGtksKfGrjzUqaU1PwsEUE7qP2buGG5ixhCvKx6E",
    //   ];
    //   const img = images[Math.floor(Math.random() * images.length)];
    //   const price = Math.floor(Math.random() * 100) + 1;
    //
    //   console.log("MKP", marketplace.address);
    //   console.log("NFT", nft.address);
    //   for (let i = 0; i < 1000; i++) {
    //     await nft.connect(user1).mint(img);
    //
    //     await expect(
    //       marketplace
    //         .connect(user1)
    //         .makeItem(
    //           nft.address,
    //           i + 1,
    //           web3.utils.toWei(price.toString(), "ether")
    //         )
    //     ).to.emit(marketplace, "Offered");
    //   }
    // });
    it("Should track new created item, transfer nft from seller to marketplace and emit Offered", async () => {
      await expect(
        marketplace
          .connect(user1)
          .makeItem(nft.address, 1, web3.utils.toWei("1", "ether"))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(
          1,
          nft.address,
          1,
          web3.utils.toWei("1", "ether"),
          user1.address
        );
      expect(await nft.ownerOf(1)).to.eq(marketplace.address);
      expect(await marketplace.itemCount()).to.eq(1);
      const item = await marketplace.items(1);
      expect(item.itemId).to.eq(1);
      expect(item.nft).to.eq(nft.address);
      expect(item.tokenId).to.eq(1);
      expect(item.price).to.eq(web3.utils.toWei("1", "ether"));
      expect(item.seller).to.eq(user1.address);
      expect(item.isSold).to.eq(false);
    });
    it("Should block creating item with zero price", async () => {
      await expect(
        marketplace
          .connect(user1)
          .makeItem(nft.address, 1, web3.utils.toWei("0", "ether"))
      ).to.be.revertedWith("Price must be greater than 0");
    });
  });
  describe("Buying marketplace items", async () => {
    beforeEach(async () => {
      //  mint nft to marketplace
      await nft.connect(user1).mint(URI);
      // set approval for marketplace
      await nft.connect(user1).setApprovalForAll(marketplace.address, true);
      //  create item
      await marketplace
        .connect(user1)
        .makeItem(nft.address, 1, web3.utils.toWei("1", "ether"));

      totalPrice = await marketplace.getFinalPrice(1);
    });
    it("Should update item as sold, pay seller, trans NFT to buyer, charge fees and emit event", async () => {
      // user2 buys item
      await expect(marketplace.connect(user2).buyItem(1, { value: totalPrice }))
        .to.emit(marketplace, "Bought")
        .withArgs(
          1,
          nft.address,
          1,
          web3.utils.toWei("1", "ether"),
          user1.address,
          user2.address
        )
        .to.changeEtherBalance(user1, web3.utils.toWei("1", "ether"))
        .to.changeEtherBalance(
          deployer,
          web3.utils.toWei(((_feePercentage / 100) * 1).toString(), "ether")
        );
      // The buyer has own the NFT
      expect(await nft.ownerOf(1)).to.eq(user2.address);
      // The item is sold
      const item = await marketplace.items(1);
      expect(item.isSold).to.eq(true);
    });
    it("Should fail for invalid item ids,sold items, not enough ether sent", async () => {
      await expect(
        marketplace
          .connect(user2)
          .buyItem(1, { value: web3.utils.toWei("0.2", "ether") })
      ).to.be.revertedWith("Not enough money to buy item");
      await expect(
        marketplace
          .connect(user2)
          .buyItem(12, { value: web3.utils.toWei("3", "ether") })
      ).to.be.revertedWith("Item does not exist");
      await expect(
        marketplace
          .connect(user1)
          .buyItem(1, { value: web3.utils.toWei("2", "ether") })
      ).to.be.revertedWith("You cannot buy your own item");
      await expect(
        marketplace
          .connect(user2)
          .buyItem(1, { value: web3.utils.toWei("1", "ether") })
      ).to.be.revertedWith("Not enough money to buy item");
      await expect(
        marketplace.connect(user2).buyItem(1, { value: totalPrice })
      );
      await expect(
        marketplace.connect(user2).buyItem(1, { value: totalPrice })
      ).to.be.revertedWith("Item is already sold");
    });
  });
});

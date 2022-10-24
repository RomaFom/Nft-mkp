import { ethers } from "ethers";

export type PageBasicProps = {
  marketPlace: ethers.Contract;
  nft: ethers.Contract;
  wallet: string;
};

export type MarketplaceItem = {
  itemId: ethers.BigNumber;
  tokenId: ethers.BigNumber;
  nft: string;
  price: ethers.BigNumber;
  listingPrice?: ethers.BigNumber;
  seller: string;
  isSold: boolean;
  totalPrice?: ethers.BigNumber;
  name: string;
  description: string;
  image: string;

  // uint itemId;
  // IERC721 nft;
  // uint tokenId;
  // uint price;
  // address payable seller;
  // bool isSold;

  // totalPrice,
  // itemId: item.itemId,
  // seller: item.seller,
  // name: metadata.name,
  // description: metadata.description,
  // image: metadata.image,
};

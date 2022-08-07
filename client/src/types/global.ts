import { ethers } from "ethers";

export enum RoutePaths {
  HOME = "/",
  CREATE = "/create",
  MY_LISTINGS = "/my-listings",
  MY_PURCHASES = "/my-purchases",
}

export type PageBasicProps = {
  marketPlace: ethers.Contract;
  nft: ethers.Contract;
  wallet: string;
};

export type MarketplaceItem = {
  itemId: number;
  tokenId: number;
  nft: any;
  price: number;
  seller: string;
  isSold: boolean;
  totalPrice?: number;
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

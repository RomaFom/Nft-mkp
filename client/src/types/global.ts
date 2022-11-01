import { ethers } from 'ethers';

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
  listingPrice: ethers.BigNumber;
  seller: string;
  isSold: boolean;
  totalPrice: ethers.BigNumber;
  name: string;
  description: string;
  image: string;
};

export type MarketplaceItemDTO = {
  ItemId: number;
  Nft: {
    image: string;
    name: string;
    description: string;
  };
  TokenId: number;
  Price: string;
  ListingPrice: string;
  Seller: string;
  IsSold: boolean;
  TotalPrice: string;
};

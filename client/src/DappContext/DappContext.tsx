import { ethers } from 'ethers';
import { createContext, useContext } from 'react';

import { Marketplace } from '@/contract-integration/marketplace';

export interface IDappCtx {
  nftContract: ethers.Contract | null;
  marketplaceContract: ethers.Contract | null;
  wallet: string;
  owner: string;
  web3Handler: () => Promise<void>;
  Mkp: Marketplace;

  // setNftContract: (contract: ethers.Contract) => void;
  // setMarketplaceContract: (contract: ethers.Contract) => void;
  // setWallet: (address: string) => void;
  // setOwner: (address: string) => void;
}

const DappCtxDefaultValues: IDappCtx = {
  nftContract: null,
  marketplaceContract: null,
  wallet: '',
  owner: '',
  web3Handler: () => new Promise(() => null),
  Mkp: new Marketplace({} as ethers.Contract),

  // setNftContract: () => null,
  // setMarketplaceContract: () => null,
  // setWallet: () => null,
  // setOwner: () => null,
};

export const DappContext = createContext<IDappCtx>(DappCtxDefaultValues);

export const useDapp = (): IDappCtx => {
  return useContext(DappContext);
};

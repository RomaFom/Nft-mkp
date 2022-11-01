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
}

const DappCtxDefaultValues: IDappCtx = {
  nftContract: null,
  marketplaceContract: null,
  wallet: '',
  owner: '',
  web3Handler: () => new Promise(() => null),
  Mkp: new Marketplace({} as ethers.Contract),
};

export const DappContext = createContext<IDappCtx>(DappCtxDefaultValues);

export const useDapp = (): IDappCtx => {
  return useContext(DappContext);
};

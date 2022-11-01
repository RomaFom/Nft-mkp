import { ethers } from 'ethers';
import React, { useState } from 'react';

import MarketplaceAbi from '../../contracts/Marketplace.json';
import MarketplaceAddress from '../../contracts/Marketplace-address.json';
import NFTAbi from '../../contracts/NFT.json';
import NFTAddress from '../../contracts/NFT-address.json';

interface IUseWeb3 {
  marketPlace: ethers.Contract | null;
  nft: ethers.Contract | null;
  account: string;
  loading: boolean;
  owner: string;
  web3Handler: () => Promise<void>;
}

export const UseWeb3 = (): IUseWeb3 => {
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState('');
  const [nft, setNft] = useState<ethers.Contract | null>(null);
  const [marketPlace, setMarketPlace] = useState<ethers.Contract | null>(null);

  const web3Handler = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!provider) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    if (!accounts || accounts.length === 0) {
      setAccount('');
      return;
    }
    setAccount(accounts[0]);

    const signer = await getSigner();
    if (!signer) return;
    await loadContract(signer);
  };

  const getSigner = async (): Promise<
    ethers.providers.JsonRpcSigner | undefined
  > => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!provider) return;
    const signer = await provider.getSigner();
    if (!signer) return;
    return signer;
  };

  const loadContract = async (
    signer: ethers.providers.JsonRpcSigner,
  ): Promise<void> => {
    try {
      setLoading(true);
      const marketplace = new ethers.Contract(
        MarketplaceAddress.address,
        MarketplaceAbi.abi,
        signer,
      );
      if (!marketplace) return;
      setMarketPlace(marketplace);
      const owner = await marketplace.feeAccount();
      setOwner(owner);
      const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
      if (!nft) return;
      setNft(nft);
    } catch (e) {
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const account = await window.ethereum.request({ method: 'eth_accounts' });
    // console.log(account);
    if (account[0]) {
      // console.log("Account found");
      await web3Handler();
      return;
    }
    setAccount('');
    // await connectWithDummyAccount();
  };

  // const connectWithDummyAccount = async (): Promise<void> => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const newSigner = await provider.getSigner(
  //     '0x9e763e727FF07264fBdd78e35dc900d3f4948867',
  //   );
  //   const marketplace = new ethers.Contract(
  //     MarketplaceAddress.address,
  //     MarketplaceAbi.abi,
  //     newSigner,
  //   );
  //   if (!marketplace) return;
  //   setMarketPlace(marketplace);
  //
  //   const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, newSigner);
  //   if (!nft) return;
  //   setNft(nft);
  // };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ethereum.on('chainChanged', () => {
      // console.log('chainChanged');
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ethereum.on('accountsChanged', () => {
      // console.log('accountsChanged');
      checkConnection();
      return;
    });
    checkConnection();
    // web3Handler();
  }, [account]);

  return {
    marketPlace,
    nft,
    account,
    loading,
    owner,
    web3Handler,
  };
};
export default UseWeb3;

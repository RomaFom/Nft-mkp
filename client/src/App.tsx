import { ethers } from 'ethers';
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import { Marketplace } from '@/contract-integration/marketplace';
import { DappContext, IDappCtx } from '@/DappContext';
import useWeb3 from '@/hooks/useWeb3';

import { routes } from './routes';
function App(): React.ReactElement {
  const { account, owner, marketPlace, nft, web3Handler } = useWeb3();

  const dappCtxValues: IDappCtx = {
    nftContract: nft,
    marketplaceContract: marketPlace,
    wallet: account,
    owner: owner,
    web3Handler: web3Handler,
    Mkp: new Marketplace(marketPlace as ethers.Contract),
  };

  const renderRoutes = useRoutes(routes);

  return (
    <div className="App">
      <DappContext.Provider value={dappCtxValues}>
        <Navbar />
        <main>
          <Suspense
            fallback={<div className="centered-loader">Loading...</div>}
          >
            {renderRoutes}
          </Suspense>
        </main>
      </DappContext.Provider>
    </div>
  );
}

export default App;

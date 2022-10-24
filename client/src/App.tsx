import React, { Suspense } from "react";
import { ethers } from "ethers";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { DappContext, IDappCtx } from "@/DappContext";
import Navbar from "@/components/Navbar";
import { Marketplace } from "@/contract-integration/marketplace";
import useWeb3 from "@/hooks/useWeb3";
function App() {
  const { account, loading, owner, marketPlace, nft, web3Handler } = useWeb3();

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

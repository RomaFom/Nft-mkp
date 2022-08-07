import React, { useState } from "react";
import { ethers } from "ethers";
import MarketplaceAbi from "../contracts/Marketplace.json";
import MarketplaceAddress from "../contracts/Marketplace-address.json";
import NFTAbi from "../contracts/NFT.json";
import NFTAddress from "../contracts/NFT-address.json";
import { Layout } from "@/components/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import { RoutePaths } from "@/types";
import Home from "@/components/Home";
import Create from "@/components/Create";
import MyListed from "@/components/MyListed";
import MyPurchase from "@/components/MyPurchase";
function App() {
  const [account, setAccount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState("");
  const [nft, setNft] = useState<ethers.Contract>();
  const [marketPlace, setMarketPlace] = useState<ethers.Contract>();

  const web3Handler = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!provider) return;
    // @ts-ignore
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (!accounts || accounts.length === 0) {
      setAccount("");
      return;
    }
    setAccount(accounts[0]);

    const signer = await getSigner();
    if (!signer) return;
    await loadContract(signer);
  };

  const getSigner = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!provider) return;
    const signer = await provider.getSigner();
    if (!signer) return;
    return signer;
  };

  const loadContract = async (signer: any) => {
    try {
      setLoading(true);
      const marketplace = new ethers.Contract(
        MarketplaceAddress.address,
        MarketplaceAbi.abi,
        signer
      );
      if (!marketplace) return;
      setMarketPlace(marketplace);
      marketplace.itemCount().then((e: any) => {
        console.log(e);
      });
      const owner = await marketplace.feeAccount();
      setOwner(owner);
      const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
      if (!nft) return;
      setNft(nft);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    // @ts-ignore
    const account = await window.ethereum.request({ method: "eth_accounts" });
    console.log(account);
    if (account[0]) {
      console.log("Account found");
      await web3Handler();
      return;
    }
    setAccount("");
    await connectWithDummyAccount();
  };

  const connectWithDummyAccount = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = await provider.getSigner(
      "0x9e763e727FF07264fBdd78e35dc900d3f4948867"
    );
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      newSigner
    );
    if (!marketplace) return;
    setMarketPlace(marketplace);

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, newSigner);
    if (!nft) return;
    setNft(nft);
  };

  React.useEffect(() => {
    // @ts-ignore
    window.ethereum.on("chainChanged", () => {
      console.log("chainChanged");
    });
    // @ts-ignore
    window.ethereum.on("accountsChanged", () => {
      console.log("accountsChanged");
      checkConnection();
      return;
    });
    checkConnection();
    // web3Handler();
  }, [account]);

  return (
    <div className="App">
      <Layout web3Handler={web3Handler} account={account} owner={owner}>
        <Routes>
          {nft && marketPlace && account && (
            <>
              <Route
                path={RoutePaths.HOME}
                element={
                  <Home
                    marketPlace={marketPlace!}
                    nft={nft!}
                    wallet={account}
                    web3Handler={web3Handler}
                  />
                }
              />
              {owner.toLowerCase() === account.toLowerCase() && (
                <Route
                  path={RoutePaths.CREATE}
                  element={
                    <Create
                      marketPlace={marketPlace!}
                      nft={nft!}
                      wallet={account}
                    />
                  }
                />
              )}

              <Route
                path={RoutePaths.MY_LISTINGS}
                element={
                  <MyListed
                    marketPlace={marketPlace}
                    nft={nft}
                    wallet={account}
                  />
                }
              />
              <Route
                path={RoutePaths.MY_PURCHASES}
                element={
                  <MyPurchase
                    marketPlace={marketPlace}
                    nft={nft}
                    wallet={account}
                  />
                }
              />
            </>
          )}
          <Route
            path={RoutePaths.HOME}
            element={
              <Home
                marketPlace={marketPlace!}
                nft={nft!}
                wallet={account}
                web3Handler={web3Handler}
              />
            }
          />
          {/*<Route path={"/"} element={<h1>Connect To Meta and go Inside!</h1>} />*/}
          <Route path={"*"} element={<h1>404</h1>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;

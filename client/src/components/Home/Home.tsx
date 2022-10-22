import React, { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { MarketplaceItem } from "@/types";
import NftCard from "@/components/NftCard";
import { PageBasicProps } from "@/types";

import GridLoader from "@/components/Loaders/GridLoader";
import { Button } from "@chakra-ui/react";
import PageWrapper from "@/components/Layout/PageWrapper";
import {checkAddressEquality} from "../../../utils/helpers";
import {Transaction} from "../../../utils/api";

type Props = PageBasicProps & {
  web3Handler: () => void;
};
const Home: React.FC<Props> = ({ marketPlace, nft, wallet, web3Handler }) => {
  const [items, setItems] = React.useState<Array<MarketplaceItem>>([]);
  const [loading, setLoading] = React.useState(false);

  const loadMarketPlaceItems = async () => {
    try {
      setLoading(true);
      const itemCount = await marketPlace.itemCount();
      const items: MarketplaceItem[] = [];

      for (let i = 1; i <= itemCount; i++) {
        const item: MarketplaceItem = await marketPlace.items(i);

        if (!item.isSold) {
          const ipfsUrlData = await nft.tokenURI(item.tokenId);
          const response = await fetch(ipfsUrlData);
          const metadata = await response.json();
          const totalPrice = await marketPlace.getFinalPrice(item.itemId);
          items.push({
            totalPrice,
            itemId: item.itemId,
            price: item.price,
            listingPrice: item.listingPrice,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          } as MarketplaceItem);
        }
      }
      setItems(items);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = useCallback(
    async (item: MarketplaceItem) => {
      // console.log(marketPlace);
      let res=await (
        await marketPlace.buyItem(item.itemId, {
          value: item.totalPrice,
        })
      ).wait();
      console.log(res)
      const dbId = await Transaction.addNew({
        wallet:wallet,
        tx_hash: res.transactionHash
      })

      console.log(dbId)
      await loadMarketPlaceItems();
    },
    [marketPlace, nft, wallet]
  );

  useEffect(() => {
    if (marketPlace && nft) {
      loadMarketPlaceItems()
        .then(() => {})
        .catch((error: any) => {
          console.log(error);
        });

      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      //  provider.getBalance(wallet).then((balance: any) => {
      //   console.log(ethers.utils.formatEther(balance));
      //  return balance;
      // });
      //
      // const rpcProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      // console.log(rpcProvider);

    }
  }, [marketPlace, nft, wallet]);
  return (
    <>
      {loading ? (
        <GridLoader />
      ) : (
        <PageWrapper>
          {items.map((item, index) => (
            <NftCard
              key={index}
              item={item}
              footer={
                <>
                  {checkAddressEquality(wallet,item.seller) ? (
                    <>
                      <>My Listing</>

                      {/*<img src="#" className="card__author-img" />*/}
                      {/*<p className="card__author-name">Creation of ...</p>*/}
                    </>
                  ) : (
                      <Button
                          size="lg"
                          w="100%"
                          colorScheme="teal"
                          variant="outline"
                          onClick={async () => {
                            console.log(item);
                            if (!wallet) {
                              web3Handler();
                              return;
                            } else {
                              await buyItem(item);
                            }
                          }}
                      >
                        {wallet ? "Buy" : "Login to buy"}
                      </Button>

                  )}
                </>
              }
            />
          ))}
        </PageWrapper>
      )}
    </>
  );
};
export default Home;

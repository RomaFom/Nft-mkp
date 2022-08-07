import React, { useCallback } from "react";
import { ethers } from "ethers";
import { MarketplaceItem } from "@/types";
import NftCard from "@/components/NftCard";
import { PageBasicProps } from "@/types";

import GridLoader from "@/components/Loaders/GridLoader";
import { SimpleGrid, Box, Button } from "@chakra-ui/react";
import PageWrapper from "@/components/Layout/PageWrapper";

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
          const url = await nft.tokenURI(item.tokenId);
          const response = await fetch(url);
          const metadata = await response.json();
          const totalPrice = await marketPlace.getFinalPrice(item.itemId);
          items.push({
            totalPrice,
            itemId: item.itemId,
            price: item.price,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          } as MarketplaceItem);
        }
      }
      console.log(items);
      setItems(items);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = useCallback(
    async (item: MarketplaceItem) => {
      console.log(marketPlace);
      await (
        await marketPlace.buyItem(item.itemId, { value: item.totalPrice })
      ).wait();
      await loadMarketPlaceItems();
    },
    [marketPlace, nft, wallet]
  );

  React.useEffect(() => {
    if (marketPlace && nft) {
      loadMarketPlaceItems()
        .then(() => {})
        .catch((error: any) => {
          console.log(error);
        });
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
                  {wallet.toLowerCase() !== item.seller.toLowerCase() ? (
                    <>
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

                      {/*<img src="#" className="card__author-img" />*/}
                      {/*<p className="card__author-name">Creation of ...</p>*/}
                    </>
                  ) : (
                    <>My Listing</>
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

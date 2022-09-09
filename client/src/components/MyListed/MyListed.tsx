import React, { useEffect, useState } from "react";

import { MarketplaceItem } from "@/types";
import { ethers } from "ethers";
import { PageBasicProps } from "@/types";
import GridLoader from "@/components/Loaders/GridLoader";
import PageWrapper from "@/components/Layout/PageWrapper";
import NftCard from "@/components/NftCard";
import {checkAddressEquality, fromBigToEth} from "../../../utils/helpers";

const MyListed: React.FC<PageBasicProps> = ({ marketPlace, nft, wallet }) => {
  const [loading, setLoading] = useState(false);
  const [listed, setListed] = useState<Array<MarketplaceItem>>([]);
  const [sold, setSold] = useState<Array<MarketplaceItem>>([]);

  const loadListedItems = async () => {
    try {
      setLoading(true);
      const itemsCount = await marketPlace.itemCount();
      const listed: MarketplaceItem[] = [];
      const sold: MarketplaceItem[] = [];

      for (let i = 1; i <= itemsCount; i++) {
        const item: MarketplaceItem = await marketPlace.items(i);

        if (checkAddressEquality(wallet,item.seller) && !item.isSold) {
          //  get nft url
          const url = await nft.tokenURI(item.tokenId);
          //  get nft metadata
          const response = await fetch(url);
          const metadata = await response.json();
          //  get final price
          const totalPrice = await marketPlace.getFinalPrice(item.itemId);

          let itemData: MarketplaceItem = {
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            isSold: item.isSold,
            price: item.price,
            listingPrice: item.listingPrice,
            nft: item.nft,
            tokenId: item.tokenId,
            description: metadata.description,
            image: metadata.image,
          };
          listed.push(itemData);
          // if (item.isSold) {
          //   sold.push(itemData);
          // }
        }
      }
      setListed(listed);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  return loading ? (
    <GridLoader />
  ) : (
    <PageWrapper>
      {listed.length > 0 &&
        listed.map((item, index) => (
          <NftCard
            key={index}
            item={item}
            footer={
              item.isSold ? (
                <>
                  <p className="footer-price">
                    Sold for {fromBigToEth(item.price)} ETH
                  </p>
                </>
              ) : (
                <>Listed</>
              )
            }
          />
        ))}
    </PageWrapper>
  );
};
export default MyListed;

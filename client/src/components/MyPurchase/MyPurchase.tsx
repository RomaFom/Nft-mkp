import React, { useEffect, useState } from "react";
import { MarketplaceItem, PageBasicProps } from "@/types";
import GridLoader from "@/components/Loaders/GridLoader";
import PageWrapper from "@/components/Layout/PageWrapper";
import NftCard from "@/components/NftCard";
import { fromBigToEth } from "../../../utils/helpers";
const MyPurchase: React.FC<PageBasicProps> = ({ marketPlace, nft, wallet }) => {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState<Array<MarketplaceItem>>([]);

  const loadPurchasedItems = async () => {
    try {
      setLoading(true);
      const filter = marketPlace.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        wallet
      );
      const results = await marketPlace.queryFilter(filter);

      const purchases = await Promise.all(
        results.map(async (item) => {
          const mkpItem: MarketplaceItem = item?.args as any;
          const url = await nft.tokenURI(mkpItem.tokenId);
          const response = await fetch(url);
          const metadata = await response.json();
          const totalPrice = await marketPlace.getFinalPrice(mkpItem.itemId);
          return {
            totalPrice,
            itemId: mkpItem.itemId,
            seller: mkpItem.seller,
            name: metadata.name,
            isSold: mkpItem.isSold,
            price: mkpItem.price,
            nft: mkpItem.nft,
            tokenId: mkpItem.tokenId,
            description: metadata.description,
            image: metadata.image,
          } as MarketplaceItem;
        })
      );
      console.log(purchases);
      setPurchased(purchases);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  return loading ? (
    <GridLoader />
  ) : (
    <PageWrapper>
      {purchased.length > 0 &&
        purchased.map((item, index) => (
          <NftCard
            item={item}
            footer={
              <p className="footer-price">
                Bought for {fromBigToEth(item.price)} ETH
              </p>
            }
            key={index}
          />
        ))}
    </PageWrapper>
  );
};
export default MyPurchase;

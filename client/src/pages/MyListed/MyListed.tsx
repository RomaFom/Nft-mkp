import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { MarketplaceItem, MarketplaceItemDTO } from '@/types';

import { checkAddressEquality, fromBigToEth } from '../../../utils/helpers';

const MyListed: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [listed, setListed] = useState<Array<MarketplaceItemDTO>>([]);
  // const [sold, setSold] = useState<Array<MarketplaceItem>>([]);
  const { marketplaceContract, nftContract, wallet } = useDapp();

  const loadListedItems = async (): Promise<void> => {
    try {
      setLoading(true);
      const itemsCount = await marketplaceContract?.itemCount();

      const listed: MarketplaceItemDTO[] = [];
      // const sold: MarketplaceItem[] = [];

      for (let i = 1; i <= itemsCount; i++) {
        console.log('i', i);
        const item: MarketplaceItem = await marketplaceContract?.items(i);
        console.log(item);

        if (checkAddressEquality(wallet, item.seller) && !item.isSold) {
          //  get nft url
          const url = await nftContract?.tokenURI(item.tokenId);
          //  get nft metadata
          const response = await fetch(url);
          const metadata = await response.json();
          //  get final price
          const totalPrice = await marketplaceContract?.getFinalPrice(
            item.itemId,
          );

          const itemData: MarketplaceItemDTO = {
            TotalPrice: Number(ethers.utils.formatUnits(totalPrice, 'wei')),
            Price: Number(ethers.utils.formatUnits(totalPrice, 'wei')),
            ItemId: item.itemId.toNumber(),
            Seller: item.seller,
            Nft: {
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            },
            IsSold: item.isSold,
            ListingPrice: Number(
              ethers.utils.formatUnits(item.listingPrice, 'wei'),
            ),
            // nft: item.nft,
            TokenId: item.tokenId.toNumber(),
            // description: metadata.description,
            // image: metadata.image,
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
              item.IsSold ? (
                <>
                  <p className="footer-price">
                    Sold for {fromBigToEth(item.Price)} ETH
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

import { Button } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { MarketplaceItem, MarketplaceItemDTO } from '@/types';

import { Transaction } from '../../../utils/api';
import {
  bigEther,
  checkAddressEquality,
  fromBigToEth,
  fromWeiToEth,
} from '../../../utils/helpers';
const MyPurchase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState<MarketplaceItemDTO[]>(
    [] as MarketplaceItemDTO[],
  );
  const navigate = useNavigate();
  const { marketplaceContract, nftContract, wallet } = useDapp();

  const LIST_FEE = 1.1;
  const loadPurchasedItems = async (): Promise<void> => {
    try {
      setLoading(true);

      const filter = marketplaceContract?.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        wallet,
      );
      const results =
        (await marketplaceContract?.queryFilter(filter || {})) || [];

      const purchases = [] as MarketplaceItemDTO[];
      await Promise.all(
        results.map(async item => {
          const mkpItem: MarketplaceItem = item?.args as any;
          const mkp = await marketplaceContract?.items(mkpItem.itemId);
          const owner = await nftContract?.ownerOf(mkp.tokenId);

          if (!checkAddressEquality(owner, wallet)) {
            return;
          }

          const url = await nftContract?.tokenURI(mkpItem.tokenId);
          const response = await fetch(url);
          const metadata = await response.json();
          const totalPrice = await marketplaceContract?.getFinalPrice(
            mkpItem.itemId,
          );

          purchases.push({
            TotalPrice: +ethers.utils.formatUnits(totalPrice, 'wei'),
            Price: +ethers.utils.formatUnits(totalPrice, 'wei'),
            ItemId: mkpItem.itemId.toNumber(),
            Seller: mkpItem.seller,
            Nft: {
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            },
            IsSold: mkpItem.isSold,
            ListingPrice: +ethers.utils.formatUnits(mkp.listingPrice, 'wei'),
            // nft: item.nft,
            TokenId: mkpItem.tokenId.toNumber(),
          });
        }),
      );

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

  const listItem = useCallback(
    async (itemId: any, listingPrice: any) => {
      if (nftContract && marketplaceContract) {
        await (
          await nftContract.setApprovalForAll(
            marketplaceContract?.address,
            true,
          )
        ).wait();
        const res = await (
          await marketplaceContract.listItem(itemId, listingPrice)
        ).wait();

        await Transaction.addNew({
          wallet: wallet,
          tx_hash: res.transactionHash,
        });

        await loadPurchasedItems();
      }
    },
    [nftContract, marketplaceContract],
  );

  const handleClick = (id: BigNumber): void => {
    const parsedId = parseInt(id._hex);
    navigate('/nft/' + parsedId);
  };

  const handleListItem = (item: MarketplaceItemDTO): void => {
    const parsedItemId = ethers.BigNumber.from(item.ItemId);
    const etherPrice = fromWeiToEth(item.TotalPrice);
    const priceInBig = bigEther(+etherPrice * LIST_FEE);

    listItem(parsedItemId, priceInBig);
  };

  return loading ? (
    <GridLoader />
  ) : (
    <PageWrapper>
      {purchased.map(item => {
        return (
          <NftCard
            onClick={() => handleClick(item.ItemId as unknown as BigNumber)}
            item={item}
            footer={
              <>
                {/*<div>*/}
                {/*  <p className="footer-price">*/}
                {/*    Bought for {fromBigToEth(item.price)} ETH*/}
                {/*  </p>*/}
                {/*</div>*/}
                {/*<br />*/}
                {item.Price < item.ListingPrice ? (
                  <p>Listed</p>
                ) : (
                  <div>
                    <p style={{ paddingBottom: '10px' }}>
                      List for {+fromWeiToEth(item.TotalPrice) * LIST_FEE} ETH
                      {/*List for {+fromBigToEth(item.ListingPrice) + TEMP_ADD_ETH}{' '}*/}
                    </p>
                    <Button
                      size="lg"
                      w="100%"
                      colorScheme="teal"
                      variant="outline"
                      onClick={() => handleListItem(item)}
                    >
                      List
                    </Button>
                  </div>
                )}
              </>
            }
            key={item.TokenId}
          />
        );
      })}
    </PageWrapper>
  );
};
export default MyPurchase;

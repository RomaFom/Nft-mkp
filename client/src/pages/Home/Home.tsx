import { Box, Button } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { MarketplaceItem } from '@/types';

import { Transaction } from '../../../utils/api';
import { checkAddressEquality } from '../../../utils/helpers';

const Home: React.FC = () => {
  const [items, setItems] = React.useState<Array<MarketplaceItem>>([]);
  const [loading, setLoading] = React.useState(false);
  const { nftContract, wallet, web3Handler, Mkp } = useDapp();

  const loadMarketPlaceItems = async (): Promise<void> => {
    try {
      setLoading(true);
      const itemCount = await Mkp.getItemsCount();
      const items: MarketplaceItem[] = [];

      for (let i = 1; i <= itemCount; i++) {
        const item: MarketplaceItem = await Mkp.items(i);

        if (!item.isSold) {
          const ipfsUrlData = await nftContract?.tokenURI(item.tokenId);
          const response = await fetch(ipfsUrlData);
          const metadata = await response.json();
          const totalPrice = await Mkp.getFinalPrice(item.itemId);

          items.push({
            totalPrice: totalPrice,
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
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = useCallback(
    async (item: MarketplaceItem) => {
      const res = await Mkp.buyItem(item.itemId, item.totalPrice);
      await Transaction.addNew({
        wallet: wallet,
        tx_hash: res.transactionHash,
      });
      await loadMarketPlaceItems();
    },
    [Mkp, nftContract, wallet],
  );

  useEffect(() => {
    if (Mkp && nftContract) {
      loadMarketPlaceItems();

      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      //  provider.getBalance(wallet).then((balance: any) => {
      //   console.log(ethers.utils.formatEther(balance));
      //  return balance;
      // });
      //
      // const rpcProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      // console.log(rpcProvider);
    }
  }, [nftContract, wallet]);
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
                  {checkAddressEquality(wallet, item.seller) ? (
                    <>
                      <>My Listing</>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      w="100%"
                      colorScheme="teal"
                      variant="outline"
                      onClick={async () => {
                        // console.log(item);
                        if (!wallet) {
                          await web3Handler();
                          return;
                        } else {
                          await buyItem(item);
                        }
                      }}
                    >
                      {wallet ? 'Buy' : 'Form-Login to buy'}
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

import { Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { MarketplaceItemDTO } from '@/types';
import { useUser } from '@/UserContext/UserContext';

import { MkpApi, Transaction } from '../../../utils/api';
import {
  bigEther,
  checkAddressEquality,
  fromWeiToEth,
} from '../../../utils/helpers';

const Home: React.FC = () => {
  const [items, setItems] = React.useState<Array<MarketplaceItemDTO>>([]);
  const [loading, setLoading] = React.useState(false);
  const { nftContract, wallet, web3Handler, Mkp } = useDapp();
  const { user } = useUser();
  const navigate = useNavigate();

  const loadMarketPlaceItems = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await MkpApi.getItems();
      console.log(data.items);
      setItems(data.items);
    } catch (e) {
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = useCallback(
    async (item: MarketplaceItemDTO) => {
      const priceInEth = fromWeiToEth(item.TotalPrice);

      const priceInBig = bigEther(+priceInEth);

      const parsedItemId = ethers.BigNumber.from(item.ItemId);

      const res = await Mkp.buyItem(parsedItemId, priceInBig);
      await Transaction.addNew({
        wallet: wallet,
        tx_hash: res.transactionHash,
      });
      await loadMarketPlaceItems();
    },
    [Mkp, nftContract, wallet],
  );

  useEffect(() => {
    loadMarketPlaceItems();
  }, []);

  interface FooterProps {
    item: MarketplaceItemDTO;
  }

  const RenderFooter: React.FC<FooterProps> = ({ item }) => {
    if (!user) {
      return (
        <Button
          size="lg"
          w="100%"
          colorScheme="teal"
          variant="outline"
          onClick={() => {
            navigate('/login');
          }}
        >
          Login to buy
        </Button>
      );
    }
    if (user && !wallet) {
      return (
        <Button
          size="lg"
          w="100%"
          colorScheme="teal"
          variant="outline"
          onClick={() => {
            web3Handler();
          }}
        >
          Connect Wallet
        </Button>
      );
    }
    if (user && wallet && checkAddressEquality(wallet, item.Seller)) {
      return <>My Listing</>;
    }
    if (user && wallet) {
      return (
        <Button
          size="lg"
          w="100%"
          colorScheme="teal"
          variant="outline"
          onClick={() => {
            buyItem(item);
          }}
        >
          Buy NFT
        </Button>
      );
    }
    return null;
  };

  return (
    <>
      {loading ? (
        <GridLoader />
      ) : (
        <PageWrapper>
          {items &&
            items.map((item, index) => (
              <NftCard
                key={index}
                item={item}
                footer={<RenderFooter item={item} />}
              />
            ))}
        </PageWrapper>
      )}
    </>
  );
};
export default Home;

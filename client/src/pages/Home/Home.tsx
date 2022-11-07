import { Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { useGetFeedQuery } from '@/services/feed/feed';
import { MarketplaceItemDTO } from '@/types';
import { useUser } from '@/UserContext/UserContext';

import { Transaction } from '../../../utils/api';
import { bigEther, checkAddressEquality } from '../../../utils/helpers';

const Home: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetFeedQuery();

  const { wallet, web3Handler, Mkp } = useDapp();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, []);

  const buyItem = async (item: MarketplaceItemDTO): Promise<void> => {
    try {
      const parsedItemId = ethers.BigNumber.from(item.ItemId.toString());
      const parsedPrice = bigEther(+item.TotalPrice);

      const res = await Mkp.buyItem(parsedItemId, parsedPrice);
      await Transaction.addNew({
        wallet: wallet,
        tx_hash: res.transactionHash,
      });
      await refetch();
    } catch (e) {
      console.log(e);
    }
  };

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
      {isLoading ? (
        <GridLoader />
      ) : (
        <PageWrapper>
          <div className="grid nft-grid">
            {data &&
              data.map((item, index) => (
                <NftCard
                  key={index}
                  item={item}
                  footer={<RenderFooter item={item} />}
                />
              ))}
          </div>
        </PageWrapper>
      )}
    </>
  );
};
export default Home;

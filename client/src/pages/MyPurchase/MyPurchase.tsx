import { Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import Modal from '@/components/Modal';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { setShow } from '@/features/modal/modalSlice';
import { useAppSelector } from '@/hooks/redux';
import { useGetMyPurchasesQuery } from '@/services/feed/feed';
import { MarketplaceItemDTO } from '@/types';
import { useUser } from '@/UserContext/UserContext';

import { Transaction } from '../../../utils/api';
import { bigEther } from '../../../utils/helpers';
const MyPurchase: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { marketplaceContract, nftContract, wallet } = useDapp();

  const { data, error, isLoading, refetch } = useGetMyPurchasesQuery({
    userWallet: wallet,
    token: user?.token,
  });
  const dispatch = useDispatch();
  const { show } = useAppSelector(state => state.modal);

  const handleSetShow = (value: boolean): void => {
    dispatch(setShow(value));
  };

  useEffect(() => {
    refetch();
  }, []);

  const LIST_FEE = 1;

  const listItem = async (itemId: any, listingPrice: any): Promise<void> => {
    if (nftContract && marketplaceContract) {
      await (
        await nftContract.setApprovalForAll(marketplaceContract?.address, true)
      ).wait();
      const res = await (
        await marketplaceContract.listItem(itemId, listingPrice)
      ).wait();

      await Transaction.addNew({
        wallet: wallet,
        tx_hash: res.transactionHash,
      });
      refetch();
    }
  };

  const handleClick = (id: number): void => {
    navigate('/nft/' + id);
  };

  const handleListItem = (item: MarketplaceItemDTO): void => {
    const parsedItemId = ethers.BigNumber.from(item.ItemId.toString());
    const parsedListingPrice = bigEther(+item.TotalPrice + LIST_FEE);
    listItem(parsedItemId, parsedListingPrice);
  };

  return isLoading ? (
    <GridLoader />
  ) : (
    <PageWrapper>
      <div className="grid nft-grid">
        {data &&
          data.map(item => {
            return (
              <NftCard
                onClick={() => handleClick(item.ItemId)}
                item={item}
                footer={
                  <>
                    {+item.Price < +item.ListingPrice ? (
                      <p>Listed</p>
                    ) : (
                      <div>
                        <p style={{ paddingBottom: '10px' }}>
                          List for {+item.TotalPrice + LIST_FEE} ETH
                        </p>
                        <Button
                          size="lg"
                          w="100%"
                          colorScheme="teal"
                          variant="outline"
                          onClick={() => handleSetShow(true)}
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
      </div>
      <Modal show={show} setShow={handleSetShow} title={'List Nft'}>
        List Modal
      </Modal>
    </PageWrapper>
  );
};
export default MyPurchase;

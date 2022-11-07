import React from 'react';

import PageWrapper from '@/components/Layout/PageWrapper';
import { GridLoader } from '@/components/Loaders';
import NftCard from '@/components/NftCard';
import { useDapp } from '@/DappContext';
import { useGetMyListingsQuery } from '@/services/feed/feed';
import { useUser } from '@/UserContext/UserContext';

import { fromBigToEth } from '../../../utils/helpers';

const MyListed: React.FC = () => {
  const { wallet } = useDapp();
  const { user } = useUser();

  const { data, error, isLoading } = useGetMyListingsQuery({
    token: user?.token,
    userWallet: wallet,
  });

  return isLoading ? (
    <GridLoader />
  ) : (
    <PageWrapper>
      <div className="grid nft-grid">
        {data &&
          data.map((item, index) => (
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
      </div>
    </PageWrapper>
  );
};
export default MyListed;

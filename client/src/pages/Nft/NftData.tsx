import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageBasicProps } from '@/types';

const NftData: React.FC<PageBasicProps> = ({ marketPlace, nft, wallet }) => {
  const { id } = useParams();

  const loadNftData = async (): Promise<void> => {
    try {
      const item = await marketPlace.items(id);
      const boughtFilter = marketPlace.filters.Bought(
        null,
        item.nft,
        null,
        null,
        null,
        null,
      );

      const offersFilter = marketPlace.filters.Offered(
        null,
        item.nft,
        null,
        null,
        null,
      );
      const res_bought = await marketPlace.queryFilter(boughtFilter);
      const res_offers = await marketPlace.queryFilter(offersFilter);
      console.log(res_bought, res_offers);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (marketPlace) {
      loadNftData();
    }
  }, [marketPlace, nft, wallet]);

  return <></>;
};
export default NftData;

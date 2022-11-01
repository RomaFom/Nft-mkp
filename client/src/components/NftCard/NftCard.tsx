import './NftCard.scss';

import { Button } from '@chakra-ui/react';
import { jsx } from '@emotion/react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import nftImg from '@/assets/icon-ethereum.svg';
import { useDapp } from '@/DappContext';
import { MarketplaceItem, MarketplaceItemDTO } from '@/types';
import { useUser } from '@/UserContext/UserContext';

import { Transaction } from '../../../utils/api';
import {
  checkAddressEquality,
  fromBigToEth,
  fromWeiToEth,
} from '../../../utils/helpers';
import JSX = jsx.JSX;
type Props = {
  item: MarketplaceItemDTO;
  footer: React.ReactNode;
  onClick?: () => void;
};

const NftCard: React.FC<Props> = ({ item, footer, onClick }) => {
  const priceInEther = fromWeiToEth(item.TotalPrice);

  return (
    <>
      <div className="card">
        <div className="card__head">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div className="card__product-img">
            <img alt={item.Nft.image} src={item.Nft.image} />
          </div>
        </div>
        <div className="card__body">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">
            <h3 className="card__title">{item.Nft.name}</h3>
          </a>
          <p className="card__text">{item.Nft.description}</p>
          <div className="wrapper">
            <div className="card__price">
              <img alt={'nftImg'} src={nftImg} className="card__icon" />
              <span>{priceInEther} ETH</span>
            </div>
            <div className="card__countdown">
              {/*<img src="#" className="card__icon" />*/}
              {/*<span>3 days left</span>*/}
            </div>
          </div>
        </div>
        <div className="card__footer">{footer}</div>
      </div>
    </>
  );
};
export default NftCard;

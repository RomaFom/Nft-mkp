import './NftCard.scss';

import React from 'react';

import nftImg from '@/assets/icon-ethereum.svg';
import { MarketplaceItem } from '@/types';

import { fromBigToEth } from '../../../utils/helpers';
type Props = {
  item: MarketplaceItem;
  footer: React.ReactNode;
  onClick?: () => void;
};
const NftCard: React.FC<Props> = ({ item, footer, onClick }) => {
  // console.log(item);
  const priceInEther = fromBigToEth(item.listingPrice);
  return (
    <>
      <div className="card">
        <div className="card__head">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div onClick={onClick} className="card__product-img">
            <img alt={item.image} src={item.image} />
          </div>
        </div>
        <div className="card__body">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">
            <h3 className="card__title">{item.name}</h3>
          </a>
          <p className="card__text">{item.description}</p>
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

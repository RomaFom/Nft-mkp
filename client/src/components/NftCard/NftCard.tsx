import React from "react";
import "./NftCard.scss";
import { MarketplaceItem } from "@/types";
import { ethers } from "ethers";
import nftImg from "@/assets/icon-ethereum.svg";
import { Button } from "@chakra-ui/react";
import { fromBigToEth } from "../../../utils/helpers";
type Props = {
  item: MarketplaceItem;
  footer: React.ReactNode;
};
const NftCard: React.FC<Props> = ({ item, footer }) => {
  const priceInEther = fromBigToEth(item.price);
  return (
    <>
      <div className="card">
        <div className="card__head">
          <div className="card__product-img">
            <img src={item.image} />
          </div>
        </div>
        <div className="card__body">
          <a href="#">
            <h3 className="card__title">{item.name}</h3>
          </a>
          <p className="card__text">{item.description}</p>
          <div className="wrapper">
            <div className="card__price">
              <img src={nftImg} className="card__icon" />
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

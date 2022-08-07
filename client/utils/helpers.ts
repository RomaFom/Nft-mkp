import { ethers } from "ethers";

export const fromBigToEth = (value: any): string => {
  const priceInWei = ethers.BigNumber.from(value);
  return ethers.utils.formatEther(priceInWei);
};

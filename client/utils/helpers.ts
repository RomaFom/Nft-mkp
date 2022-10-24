import { ethers } from "ethers";

export const fromBigToEth = (value: any): string => {
  const priceInWei = ethers.BigNumber.from(value);
  return ethers.utils.formatEther(priceInWei);
};

export const checkAddressEquality = (
  address1: string,
  address2: string
): boolean => {
  return address1.toLowerCase() === address2.toLowerCase();
};

import { ethers } from 'ethers';

export const fromBigToEth = (value: any): string => {
  const priceInWei = ethers.BigNumber.from(value);
  return ethers.utils.formatEther(priceInWei);
};

export const checkAddressEquality = (
  address1: string,
  address2: string,
): boolean => {
  return address1.toLowerCase() === address2.toLowerCase();
};

export function cropAddress(string?: string, reduceValue = 16): string {
  if (!string) return '';

  if (string.length > 2 * reduceValue) {
    return `${string.slice(0, reduceValue)}…${string.slice(-reduceValue)}`;
  } else {
    return string;
  }
}

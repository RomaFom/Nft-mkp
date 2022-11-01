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

export const fromWeiToEth = (value: number): string => {
  const eth = ethers.utils.formatEther(value.toString());
  return eth;
};

export const bigEther = (value: number): ethers.BigNumber => {
  return ethers.utils.parseUnits(value.toString(), 'ether');
};

// export const parseWeiToBigEther = (value: number): ethers.BigNumber => {
//   const eth = fromWeiToEth(value);
//   return ethers.utils.parseUnits(eth, 'ether');
// };

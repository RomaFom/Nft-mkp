import { ethers } from 'ethers';

import { MarketplaceItem } from '@/types';

export class Marketplace {
  contract: ethers.Contract;
  constructor(contract: ethers.Contract) {
    this.contract = contract;
  }

  async getItemsCount(): Promise<number> {
    const count = await this.contract.itemCount();
    return count.toNumber();
  }

  async items(index: number): Promise<MarketplaceItem> {
    return await this.contract.items(index);
  }

  async getFinalPrice(itemId: ethers.BigNumber): Promise<ethers.BigNumber> {
    return await this.contract.getFinalPrice(itemId);
  }

  async buyItem(
    itemId: ethers.BigNumber,
    price: ethers.BigNumber,
  ): Promise<ethers.ContractReceipt> {
    return await (
      await this.contract.buyItem(itemId, {
        value: price,
        gasLimit: 1000000,
      })
    ).wait();
  }

  //   const totalPrice = await marketplaceContract?.getFinalPrice(
  //             item.itemId
  //           );
}

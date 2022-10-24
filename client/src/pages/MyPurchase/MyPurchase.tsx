import React, { useCallback, useEffect, useState } from "react";
import { MarketplaceItem } from "@/types";
import GridLoader from "@/components/Loaders/GridLoader";
import PageWrapper from "@/components/Layout/PageWrapper";
import NftCard from "@/components/NftCard";
import { checkAddressEquality, fromBigToEth } from "../../../utils/helpers";
import { Button } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { Transaction } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDapp } from "@/DappContext";
const MyPurchase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState<MarketplaceItem[]>(
    [] as MarketplaceItem[]
  );
  const navigate = useNavigate();
  const { marketplaceContract, nftContract, wallet } = useDapp();

  const TEMP_ADD_ETH = 10;
  const loadPurchasedItems = async () => {
    try {
      setLoading(true);

      const filter = marketplaceContract?.filters.Bought(
        null,
        null,
        null,
        null,
        null,
        wallet
      );
      const results = await marketplaceContract?.queryFilter(filter || {});
      // console.log(await results[0].getBlock());
      const purchases = [] as MarketplaceItem[];
      await Promise.all(
        results!.map(async (item) => {
          const mkpItem: MarketplaceItem = item?.args as any;
          const mkp = await marketplaceContract?.items(mkpItem.itemId);
          const owner = await nftContract?.ownerOf(mkp.tokenId);

          if (!checkAddressEquality(owner, wallet)) {
            return;
          }

          const url = await nftContract?.tokenURI(mkpItem.tokenId);
          const response = await fetch(url);
          const metadata = await response.json();
          const totalPrice = await marketplaceContract?.getFinalPrice(
            mkpItem.itemId
          );
          purchases.push({
            totalPrice,
            itemId: mkpItem.itemId,
            seller: mkpItem.seller,
            name: metadata.name,
            isSold: mkpItem.isSold,
            price: mkpItem.price,
            listingPrice: mkp.listingPrice,
            nft: mkpItem.nft,
            tokenId: mkpItem.tokenId,
            description: metadata.description,
            image: metadata.image,
          });
        })
      );

      setPurchased(purchases);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  const listItem = useCallback(
    async (itemId: any, listingPrice: any) => {
      await (
        await nftContract?.setApprovalForAll(marketplaceContract?.address, true)
      ).wait();
      const res = await (
        await marketplaceContract?.listItem(itemId, listingPrice)
      ).wait();

      await Transaction.addNew({
        wallet: wallet,
        tx_hash: res.transactionHash,
      });

      await loadPurchasedItems();
    },
    [nftContract, marketplaceContract]
  );

  const handleClick = async (id: BigNumber) => {
    const parsedId = parseInt(id._hex);
    navigate("/nft/" + parsedId);
  };

  return loading ? (
    <GridLoader />
  ) : (
    <PageWrapper>
      {purchased.map((item) => {
        return (
          <NftCard
            onClick={() => handleClick(item.itemId as unknown as BigNumber)}
            item={item!}
            footer={
              <>
                {/*<div>*/}
                {/*  <p className="footer-price">*/}
                {/*    Bought for {fromBigToEth(item.price)} ETH*/}
                {/*  </p>*/}
                {/*</div>*/}
                {/*<br />*/}
                {item!.price < item!.listingPrice! ? (
                  <p>Listed</p>
                ) : (
                  <div>
                    <p style={{ paddingBottom: "10px" }}>
                      List for{" "}
                      {+fromBigToEth(item!.listingPrice) + TEMP_ADD_ETH} ETH
                    </p>
                    <Button
                      size="lg"
                      w="100%"
                      colorScheme="teal"
                      variant="outline"
                      onClick={() =>
                        listItem(
                          item!.itemId,
                          ethers.utils.parseEther(
                            (
                              +fromBigToEth(item!.listingPrice) + TEMP_ADD_ETH
                            ).toString()
                          )
                        )
                      }
                    >
                      List
                    </Button>
                  </div>
                )}
              </>
            }
            key={item!.tokenId.toNumber()}
          />
        );
      })}
    </PageWrapper>
  );
};
export default MyPurchase;

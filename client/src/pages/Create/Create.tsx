import React from "react";
import { create as ipsfHttpClient } from "ipfs-http-client";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { Box, Stack, Input, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../../../utils/api";
import { useDapp } from "@/DappContext";

const projectId = import.meta.env.VITE_APP_PROJECT_ID;
const projectSecret = import.meta.env.VITE_APP_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipsfHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Create: React.FC = () => {
  const [image, setImage] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [price, setPrice] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [imgUploading, setImgUploading] = React.useState(false);
  const { marketplaceContract, nftContract, wallet } = useDapp();
  let navigate = useNavigate();
  const uploadImage = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file === "undefined") return;
    try {
      setImgUploading(true);
      const result = await client.add(file);
      console.log(result);
      setImage("https://roma-mkp.infura-ipfs.io/ipfs/" + result.path);
    } catch (e) {
      console.log(e);
    } finally {
      setImgUploading(false);
    }
  };

  const createNFT = async () => {
    if (!image || !name || !price || !description) return;
    try {
      setLoading(true);

      const result = await client.add(
        JSON.stringify({ image, name, description })
      );
      console.log(result);
      await mintThenList(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  const mintThenList = async (result: any) => {
    const uri = "https://roma-mkp.infura-ipfs.io/ipfs/" + result.path;
    await (await nftContract?.mint(uri)).wait();
    const id = await nftContract?.tokenCount();
    console.log("ID", id);
    await (
      await nftContract?.setApprovalForAll(marketplaceContract?.address, true)
    ).wait();
    const listingPrice = ethers.utils.parseEther(price.toString());
    const res = await (
      await marketplaceContract?.makeItem(
        nftContract?.address,
        id,
        listingPrice
      )
    ).wait();

    await Transaction.addNew({
      wallet: wallet,
      tx_hash: res.transactionHash,
    });
  };

  return (
    <>
      <Box w="100%" px={20}>
        <Stack spacing={3}>
          <Input
            variant="outline"
            placeholder="NFT Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            variant="outline"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            variant="outline"
            placeholder="Listing Price"
            type={"number"}
            onChange={(e) => setPrice(e.target.value)}
          />
          {/*<Input type="file" w={"20%"} />*/}

          <input onChange={uploadImage} name={"Select"} type={"file"} />

          <Button
            onClick={createNFT}
            colorScheme="teal"
            size="md"
            w="10%"
            disabled={
              !image ||
              !name ||
              !price ||
              !description ||
              imgUploading ||
              loading
            }
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </>
  );
};
export default Create;

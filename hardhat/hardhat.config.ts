import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// c4b91b70e58626e9200fb1bca16bd0560a1ca658f537f58f95bdaf63050c0c49
// 0x6CD127153a2AC69c6E7c4079417e76Cc89e7A2b6
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/4f498eea35784d35a25ce847551ba7a8",
    //   accounts: ["0xc4b91b70e58626e9200fb1bca16bd0560a1ca658f537f58f95bdaf63050c0c49"],
    // },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/waJET_mizSl_H-9DCccyN5xyxYOx2Wm7`,
      accounts: ["f701252987e09d043924f1b292f43bec679f6bdb6426fd08d742284adf56d928"]
    }
  },
  // paths: {
  //   artifacts: "./artifacts",
  // },
};

export default config;

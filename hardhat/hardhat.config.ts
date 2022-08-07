import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/4f498eea35784d35a25ce847551ba7a8",
      accounts: [""],
    },
  },
  // paths: {
  //   artifacts: "./artifacts",
  // },
};

export default config;

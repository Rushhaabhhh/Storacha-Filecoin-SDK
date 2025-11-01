import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    calibration: {
      // url: process.env.FILECOIN_RPC_URL!,
      url:"https://api.calibration.node.glif.io/rpc/v1",
      chainId: 314159,
      // accounts: process.env.FILECOIN_PRIVATE_KEY
      //   ? [process.env.FILECOIN_PRIVATE_KEY]
      //   : [],
      accounts:["0x05c3b9f2485f64a93c6b7bdb80f2fe6c79e3291742f5b5f2162791a64a153244"]
    },
  },
};

export default config; 

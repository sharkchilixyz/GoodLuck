import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      live: false,
      saveDeployments: true,
      tags: ["local"]
    },
    hardhat: {
      live: false,
      saveDeployments: true,
      tags: ["test", "local"]
    },
    sepolia: {
      live: true,
      saveDeployments: true,
      tags: ["sepolia"],
      url: "",
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2].filter((key) => key !== undefined),
    },
  },
  namedAccounts: {
    deployer: 0,
    player: 1,
  },
  paths: {
    sources: "contracts",
    deploy: "deploy",
    deployments: "deployments"
  },
  gasReporter: {
    enabled: false,
    noColors: true,
    gasPrice: 20,
    currency: "USD",
    token: "ETH",
    coinmarketcap: "",
    gasPriceApi: "",
    outputFile: "gas-reporter.txt",
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: false,
  }
};

export default config;
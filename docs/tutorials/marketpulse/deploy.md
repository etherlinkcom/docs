---
title: Deploy the contract
dependencies:
  viem: 2.41.2
  hardhat: 3.0.17
---

Deploy the contract locally is fine for doing simple tests, but we recommend to target the Etherlink Testnet to run complete scenarios as you may depend on other services like block explorers, oracles, etc.

1. Deploy the contract locally with Hardhat:

   1. Remove the default module for the ignition plugin of Hardhat.
   This module is used as the default script for deployment:

      ```bash
      rm ./ignition/modules/Counter.ts
      ```

   1. Create a module to deploy your contract named `./ignition/modules/Marketpulse.ts` with the following content:

      ```TypeScript
      // This setup uses Hardhat Ignition to manage smart contract deployments.
      // Learn more about it at https://hardhat.org/ignition

      import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

      const MarketpulseModule = buildModule("MarketpulseModule", (m) => {
        const MarketpulseContract = m.contract("Marketpulse", []);

        m.call(MarketpulseContract, "ping", []);

        return { MarketpulseContract };
      });

      export default MarketpulseModule;
      ```

      This module deploys the contract and calls the Ping endpoint to verify that it deployed well.

   1. Start a local Ethereum node:

      ```bash
      npx hardhat node
      ```

   1. In a different terminal window, within the same directory, deploy the contract using Hardhat ignition:

      ```bash
      npx hardhat ignition deploy ignition/modules/Marketpulse.ts --reset --network localhost
      ```

      You can deploy the contract to any local Ethereum node but Etherlink is a good choice because it is persistent and free and most tools and indexers are already deployed on it.

      The response looks like this:

      ```
      Hardhat Ignition 🚀

      Deploying [ MarketpulseModule ]

      Batch #1
        Executed MarketpulseModule#Marketpulse

      Batch #2
        Executed MarketpulseModule#Marketpulse.ping

      [ MarketpulseModule ] successfully deployed 🚀

      Deployed Addresses

      MarketpulseModule#Marketpulse - 0x5FbDB2315678afecb367f032d93F642f64180aa3
      ```

1. Check that your deployment logs do not contain any error and stop the Hardhat node.

1. Deploy the contract on Etherlink Shadownet Testnet:

   1. In the Hardhat configuration file `hardhat.config.ts`, add Etherlink Mainnet and Shadownet Testnet as custom networks by replacing the default file with this code:

      ```TypeScript
      import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
      import { configVariable, defineConfig } from "hardhat/config";

      if (!configVariable("DEPLOYER_PRIVATE_KEY")) {
        console.error("Missing env var DEPLOYER_PRIVATE_KEY");
      }

      const deployerPrivateKey = configVariable("DEPLOYER_PRIVATE_KEY");

      export default defineConfig({
        plugins: [hardhatToolboxViemPlugin],
        solidity: {
          profiles: {
            default: {
              version: "0.8.28",
            },
            production: {
              version: "0.8.28",
              settings: {
                optimizer: {
                  enabled: true,
                  runs: 200,
                },
              },
            },
          },
        },
        networks: {
          hardhatMainnet: {
            type: "edr-simulated",
            chainType: "l1",
          },
          hardhatOp: {
            type: "edr-simulated",
            chainType: "op",
          },
          etherlinkMainnet: {
            type: "http",
            url: "https://node.mainnet.etherlink.com",
            accounts: [deployerPrivateKey],
          },
          etherlinkShadownet: {
            type: "http",
            url: "https://node.shadownet.etherlink.com",
            accounts: [deployerPrivateKey],
          },
        },
        chainDescriptors: {
          127823: {
            chainType: "generic",
            name: "etherlinkShadownet",
            blockExplorers: {
              etherscan: {
                name: "EtherlinkExplorer",
                apiUrl: "https://shadownet.explorer.etherlink.com/api",
                url: "https://shadownet.explorer.etherlink.com",
              },
            },
          },
          42793: {
            name: "EtherlinkMainnet",
          }
        },
        verify: {
          blockscout: {
            enabled: false,
          },
          etherscan: {
            apiKey: "DUMMY",
            enabled: true,
          },
          sourcify: {
            enabled: false,
          }
        }
      });
      ```

   1. Set up an Etherlink Shadownet Testnet account with some native tokens to deploy the contract. See [Using your wallet](/get-started/using-your-wallet) connect your wallet to Etherlink. Then use the faucet to get XTZ tokens on Etherlink Shadownet Testnet, as described in [Getting testnet tokens](/get-started/getting-testnet-tokens).

   1. Export your account private key from your wallet application.

   1. Set the private key (represented in this example as `<YOUR_ETHERLINK_KEY>`) as the value of the `DEPLOYER_PRIVATE_KEY` environment variable by running this command:

      ```bash
      export DEPLOYER_PRIVATE_KEY=<YOUR_ETHERLINK_KEY>
      ```

   1. Deploy the contract to Etherlink Shadownet Testnet network specifying the `--network` option:

      ```bash
      npx hardhat ignition deploy ignition/modules/Marketpulse.ts --network etherlinkShadownet
      ```

      A successful output should look like this:

      ```logs
      Hardhat Ignition 🚀

      Deploying [ MarketpulseModule ]

      Batch #1
        Executed MarketpulseModule#Marketpulse

      Batch #2
        Executed MarketpulseModule#Marketpulse.ping

      [ MarketpulseModule ] successfully deployed 🚀

      Deployed Addresses

      MarketpulseModule#Marketpulse - 0xc64Bc334cf7a6b528357F8E88bbB3712E98629FF
      ```

1. Run this command to verify your deployed contract, using the contract address as the value of `<CONTRACT_ADDRESS>`:

   ```bash
   npx hardhat verify --network etherlinkShadownet <CONTRACT_ADDRESS>
   ```

   The response should include the message "Successfully verified contract Marketpulse on the block explorer" and a link to the block explorer.

   You can also pass the `--verify` option to the deployment command to verify the contract as part of the deployment process.

The next step is to create the frontend application.

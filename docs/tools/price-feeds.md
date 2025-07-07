---
title: Price feeds
---

## Pyth

[Pyth](https://pyth.network/) offers 400+ pull-based price feeds for Etherlink.
Learn more about integrating Pyth with their [docs](https://docs.pyth.network/price-feeds/use-real-time-data/evm).

This example contract accepts price update data from Pyth's Hermes service and uses it to provide the price of one USD in XTZ:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract PythSimple {
  // Pyth oracle data
  IPyth pyth;
  // Price feed ID from https://www.pyth.network/developers/price-feed-ids
  bytes32 xtzUsdPriceId;

  constructor(address _pyth, bytes32 _xtzUsdPriceId) {
    pyth = IPyth(_pyth);
    xtzUsdPriceId = _xtzUsdPriceId;
  }

  // Update the price
  function updatePrice(bytes[] calldata pythPriceUpdate) public {
    uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
    pyth.updatePriceFeeds{ value: updateFee }(pythPriceUpdate);
  }

  // Get 1 USD in wei
  function getPrice() public view returns (uint256) {
    PythStructs.Price memory price = pyth.getPriceNoOlderThan(
      xtzUsdPriceId,
      60
    );
    uint xtzPrice18Decimals = (uint(uint64(price.price)) * (10 ** 18)) /
      (10 ** uint8(uint32(-1 * price.expo)));
    uint oneDollarInWei = ((10 ** 18) * (10 ** 18)) / xtzPrice18Decimals;
    return oneDollarInWei;
  }

  // Update and get the price in a single step
  function updateAndGet(bytes[] calldata pythPriceUpdate) external payable returns (uint256) {
    updatePrice((pythPriceUpdate));
    return getPrice();
  }
}
```

To call this contract, applications must get the price data from Hermes and pass it to the `updatePrice` or `updateAndGet` function.
Here is an example JavaScript application that uses the [`viem`](https://viem.sh/) SDK to call Etherlink:

```javascript
import { HermesClient } from "@pythnetwork/hermes-client";
import { createWalletClient, http, getContract, createPublicClient, defineChain, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const PythContractABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_pyth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_xtzUsdPriceId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getPrice",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateAndGet",
    "inputs": [
      {
        "name": "pythPriceUpdate",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "updatePrice",
    "inputs": [
      {
        "name": "pythPriceUpdate",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];

// Pyth ID for exchange rate of XTZ to USD from https://www.pyth.network/developers/price-feed-ids
const XTZ_USD_ID = "0x0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03";

// Viem custom chain definition for Etherlink sandbox
const etherlinkSandbox = defineChain({
  id: 42793, // Sandbox based on Etherlink mainnet
  name: 'EtherlinkSandbox',
  nativeCurrency: {
    decimals: 18,
    name: 'tez',
    symbol: 'xtz',
  },
  rpcUrls: {
    default: {
      http: ["<RPC_URL>"], // URL of the EVM node; default is http://localhost:8545 for sandbox
    },
  },
});

// Contract I deployed
const CONTRACT_ADDRESS = "<DEPLOYMENT_ADDRESS>";

// My account based on private key
const myAccount = privateKeyToAccount(`<PRIVATE_KEY>`);

// Viem objects that allow programs to call the chain
const walletClient = createWalletClient({
  account: myAccount,
  chain: etherlinkSandbox, // Or use etherlinkTestnet or etherlinkMainnet from "viem/chains"
  transport: http(),
});
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: PythContractABI,
  client: walletClient,
});
const publicClient = createPublicClient({
  chain: etherlinkSandbox, // Or use etherlinkTestnet or etherlinkMainnet from "viem/chains"
  transport: http()
});

const callContract = async () => {

  // Get price update data from Hermes
  const priceIds = [XTZ_USD_ID];
  const connection = new HermesClient("https://hermes.pyth.network");
  const priceFeedUpdateData = await connection.getLatestPriceUpdates(priceIds);

  // Send the data to the contract and include fees
  const updateHash = await contract.write.updatePrice(
    [[`0x${priceFeedUpdateData.binary.data[0]}`]],
    { gas: 30000000n },
  );
  await publicClient.waitForTransactionReceipt({ hash: updateHash });

  // Get the current price from the oracle data in the contract
  const priceInWei = await contract.read.getPrice();
  console.log(formatEther(priceInWei, "wei"), "XTZ equals 1 USD");

}

callContract();
```

## Redstone

[Redstone](https://redstone.finance/) offers push-based price feeds for Etherlink.
Get started with their [docs](https://docs.redstone.finance/docs/introduction) to learn more.

The example in [`etherlinkcom/infra-instruments`](https://github.com/etherlinkcom/infra-instruments/tree/main) includes a contract that retrieves pricing data from Redstone for multiple assets.

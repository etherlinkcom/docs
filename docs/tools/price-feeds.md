---
title: Price feeds
---

## Pyth

[Pyth](https://pyth.network/) offers 400+ pull-based price feeds for Etherlink.
Learn more about integrating Pyth with their [docs](https://docs.pyth.network/price-feeds/use-real-time-data/evm).

This example contract accepts price update data from Pyth and uses it to provide the price of one XTZ in USD:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract PythSimple {
  // Pyth oracle data
  IPyth pyth;
  // Price feed ID from https://www.pyth.network/developers/price-feed-ids
  bytes32 xtzUsdPriceId;

  constructor(address _pyth, bytes32 _priceId) {
    pyth = IPyth(_pyth);
    priceId = _priceId;
  }

  function getPriceId() view external returns (bytes32 _priceId) {
    return (priceId);
  }

  function getPrice() view external returns (uint256 _price){
    PythStructs.Price memory price_ = pyth.getPriceUnsafe(priceId);
    return uint256(int256(price_.price));
  }
}
```

Here is an example JavaScript application that uses the [`viem`](https://viem.sh/) SDK to call the contract on Etherlink:

```javascript
import { createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { etherlinkTestnet } from "viem/chains";

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
        "name": "_priceId",
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
        "name": "_price",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPriceId",
    "inputs": [],
    "outputs": [
      {
        "name": "_priceId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  }
];

// Address of deployed contract
const CONTRACT_ADDRESS = "<DEPLOYMENT_ADDRESS>";

// My account based on private key
const myAccount = privateKeyToAccount(`<PRIVATE_KEY>`);

// Viem objects that allow programs to call the chain
const walletClient = createWalletClient({
  account: myAccount,
  chain: etherlinkTestnet,
  transport: http(),
});
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: PythContractABI,
  client: walletClient,
});

const callContract = async () => {

  const price = await contract.read.getPrice();
  console.log(price);
  // 52425196
  console.log("1 XTZ =", parseInt(price) / 100000000, "USD");
  // 1 XTZ = 0.52425196 USD

}

callContract();
```

## Redstone

[Redstone](https://redstone.finance/) offers push-based price feeds for Etherlink.
Get started with their [docs](https://docs.redstone.finance/docs/introduction) to learn more.

The example in [`etherlinkcom/infra-instruments`](https://github.com/etherlinkcom/infra-instruments/tree/main) includes a contract that retrieves pricing data from Redstone for multiple assets.

This example contract accepts price update data from Redstone and uses it to provide the price of one XTZ in USD:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Chainlink aggregator interface
interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

  function latestRoundData()
    external
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

contract RedstoneSimple {
  address monitorAsset;

  constructor(address _monitorAsset) {
    monitorAsset = _monitorAsset;
  }

  function getAsset() view external returns (address _monitorAsset) {
    return (monitorAsset);
  }

  function getPrice() view external returns (uint256 _price){
    AggregatorV3Interface oracle_ = AggregatorV3Interface(monitorAsset);
    (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) = oracle_.latestRoundData();
    return uint256(answer);
  }

  function decimals() view external returns (uint256 _decimals) {
    AggregatorV3Interface oracle_ = AggregatorV3Interface(monitorAsset);
    return oracle_.decimals();
  }
}
```

Here is an example JavaScript application that uses the [`viem`](https://viem.sh/) SDK to call the contract on Etherlink:

```javascript
import { createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { etherlinkTestnet } from "viem/chains";

const RedstoneContractABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_monitorAsset",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "_decimals",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAsset",
    "inputs": [],
    "outputs": [
      {
        "name": "_monitorAsset",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPrice",
    "inputs": [],
    "outputs": [
      {
        "name": "_price",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
];

// Address of deployed contract
const CONTRACT_ADDRESS = "<DEPLOYMENT_ADDRESS>";

// My account based on private key
const myAccount = privateKeyToAccount(`<PRIVATE_KEY>`);

// Viem objects that allow programs to call the chain
const walletClient = createWalletClient({
  account: myAccount,
  chain: etherlinkTestnet,
  transport: http(),
});
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: RedstoneContractABI,
  client: walletClient,
});

const callContract = async () => {

  const price = await contract.read.getPrice();
  const decimals = await contract.read.decimals();
  console.log(price);
  // 52425196
  console.log("1 XTZ =", parseInt(price) / (10 ** Number(decimals)), "USD");
  // 1 XTZ = 0.52425196 USD

}

callContract();
```

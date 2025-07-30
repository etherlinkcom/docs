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
  // Price feed ID from https://legacy.pyth.network/developers/price-feed-ids
  bytes32 xtzUsdPriceId;

  constructor(address _pyth, bytes32 _priceId) {
    pyth = IPyth(_pyth);
    xtzUsdPriceId = _priceId;
  }

  function getPriceId() view external returns (bytes32 _priceId) {
    return (xtzUsdPriceId);
  }

  function getPrice() view external returns (uint256 _price){
    PythStructs.Price memory price_ = pyth.getPriceUnsafe(xtzUsdPriceId);
    return uint256(int256(price_.price));
  }
}
```

To deploy this contract you need the address of the Pyth on-chain application on Etherlink (`0x2880aB155794e7179c9eE2e38200202908C17B43` on both Mainnet and Testnet) and the ID of the XTZ/USD price feed (`0x0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03` as listed on the Pyth [Price feed IDs](https://legacy.pyth.network/developers/price-feed-ids)).

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

## RedStone

[RedStone](https://redstone.finance/) offers push-based price feeds for Etherlink.
Get started with their [docs](https://docs.redstone.finance/docs/introduction) to learn more.

The example in [`etherlinkcom/infra-instruments`](https://github.com/etherlinkcom/infra-instruments/tree/main) includes a contract that retrieves pricing data from RedStone for multiple assets.

This example contract accepts price update data from RedStone and uses it to provide the price of one XTZ in USD:

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

contract RedStoneSimple {
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

To deploy this contract you need the address of the RedStone on-chain application on Etherlink (`0xe92c00BC72dD12e26E61212c04E8D93aa09624F2` on both Mainnet and Testnet) and the ID of the XTZ/USD price feed `0x0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03`.
Similarly, you can get the price of the URANIUM token in USD with the price feed `0xb81131B6368b3F0a83af09dB4E39Ac23DA96C2Db`.

Here is an example JavaScript application that uses the [`viem`](https://viem.sh/) SDK to call the contract on Etherlink:

```javascript
import { createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { etherlinkTestnet } from "viem/chains";

const RedStoneContractABI = [
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
  abi: RedStoneContractABI,
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

## Acelon

[Acelon](https://acelon.io) provides a price feed for the price of stXTZ tokens, part of a staking pool on Tezos layer 1.

Here is an example JavaScript application that uses the [`viem`](https://viem.sh/) SDK to get the price of stXTZ on Etherlink:

```javascript
import { createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { etherlink } from "viem/chains";

// ABI of Acelon contract, abbreviated for this example
const abbreviatedAcelonABI = [
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      {
        "internalType": "uint80",
        "name": "roundId",
        "type": "uint80"
      },
      {
        "internalType": "int256",
        "name": "answer",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "startedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint80",
        "name": "answeredInRound",
        "type": "uint80"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];

 // stXTZ oracle on Etherlink Mainnet
const CONTRACT_ADDRESS = "0x4Bf5C46Ee59a1110c2a242715f9c3b548A14ee02";

// My account based on private key
const myAccount = privateKeyToAccount(`<PRIVATE_KEY>`);

// Viem objects that allow programs to call the chain
const walletClient = createWalletClient({
  account: myAccount,
  chain: etherlink,
  transport: http(),
});
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: abbreviatedAcelonABI,
  client: walletClient,
});

const callContract = async () => {

  // Get stxtz price
  const decimals = await contract.read.decimals();
  console.log("Decimals:", decimals);
  const latestRoundData = await contract.read.latestRoundData();
  const [roundId, answer, startedAt, updatedAt, answeredInRound] = latestRoundData;
  console.log(answer);
  console.log("1 STXTZ =", parseInt(answer) / (10 ** Number(decimals)), "XTZ");

}

callContract();

```


You can also use the NPM package `@acelon/acelon-sdk` for the same purpose.
---
title: "Part 4: Automating pricing decisions"
---

Now that your contract can use pricing data, you can act on that data to make trading decisions.
In this section, you set up a simple off-chain application to monitor prices and use the contract to buy and sell its simulated token.

You can access the smart contract in many ways, but a simple way is to use Node.JS application because Pyth provides a Node SDK that simplifies getting pricing data from Hermes.
The application that you create in this section also uses the [Viem](https://viem.sh/) EVM toolkit to interact with Etherlink.

1. In the same directory as your `contracts` folder, create a directory named `app` to store your off-chain application.

1. Go into the `app` folder and run `npm init -y` to initialize a Node.JS application.

1. Run this command to install the Pyth and Viem dependencies:

   ```bash
   npm add @pythnetwork/hermes-client @pythnetwork/price-service-client ts-node typescript viem
   ```

1. Run this command to initialize TypeScript:

   ```bash
   tsc --init
   ```

1. In the `tsconfig.json` file, uncomment the `resolveJsonModule` line so `resolveJsonModule` is set to `true`.
This setting allows programs to import JSON files easily.

1. Also in the `tsconfig.json` file, set the `target` field to `ES2020`.

1. Create a file named `src/checkRate.ts` for the code of the application.

1. In the file, import the dependencies:

   ```javascript
   import { HermesClient, PriceUpdate } from "@pythnetwork/hermes-client";
   import { createWalletClient, http, getContract, createPublicClient, defineChain, Account, parseEther } from "viem";
   import { privateKeyToAccount } from "viem/accounts";
   import { abi } from "../../contracts/out/TutorialContract.sol/TutorialContract.json";
   ```

   These dependencies include the Pyth and Viem toolkits and the compiled ABI of your contract.
   You may need to change the path to your contract if you put it in a different place relative to this file.

1. Add these constants to access the environment variables you set, or edit this code to hard-code the values:

   ```javascript
   // Pyth ID for exchange rate of XTZ to USD
   const XTZ_USD_ID = process.env["XTZ_USD_ID"] as string;

   // Contract I deployed
   const CONTRACT_ADDRESS = process.env["DEPLOYMENT_ADDRESS"] as any; // sandbox

   // My account based on private key
   const myAccount: Account = privateKeyToAccount(`0x${process.env["PRIVATE_KEY"] as any}`);
   ```

1. Add this code to define a custom chain for the Etherlink sandbox.
Viem (in `view/chains`) has built-in objects that represent Etherlink Mainnet and Testnet, but you must create your own to use the sandbox.

   ```javascript
   // Viem custom chain definition for Etherlink sandbox
   const etherlinkSandbox = defineChain({
     id: 128123,
     name: 'EtherlinkSandbox',
     nativeCurrency: {
       decimals: 18,
       name: 'tez',
       symbol: 'xtz',
     },
     rpcUrls: {
       default: {
         http: [process.env["RPC_URL"] as string],
       },
     },
   });
   ```

1. Add these Viem objects that represent the wallet and chain so you can access them in code later:

   ```javascript
   // Viem objects that allow programs to call the chain
   const walletClient = createWalletClient({
     account: myAccount,
     chain: etherlinkSandbox, // Or use etherlinkTestnet from "viem/chains"
     transport: http(),
   });
   const contract = getContract({
     address: CONTRACT_ADDRESS,
     abi: abi,
     client: walletClient,
   });
   const publicClient = createPublicClient({
     chain: etherlinkSandbox, // Or use etherlinkTestnet from "viem/chains"
     transport: http()
   });
   ```

1. Add these constants, which you can change later to adjust how the program works:

   ```javascript
   // Delay in seconds between polling Hermes for price data
   const DELAY = 3;
   // Minimum change in exchange rate that counts as a price fluctuation
   const CHANGE_THRESHOLD = 0.0001;
   ```

1. Add these utility functions:

   ```javascript
   // Utility function to call read-only smart contract function
   const getBalance = async () => parseInt(await contract.read.getBalance([myAccount.address]) as string);

   // Pause for a given number of seconds
   const delaySeconds = (seconds: number) => new Promise(res => setTimeout(res, seconds*1000));
   ```

1. Add this function to get current price data from Hermes, just like the `curl` command you used in previous sections:

   ```javascript
   // Utility function to call Hermes and return the current price of one XTZ in USD
   const getPrice = async (connection: HermesClient) => {
     const priceIds = [XTZ_USD_ID];
     const priceFeedUpdateData = await connection.getLatestPriceUpdates(priceIds) as PriceUpdate;
     const parsedPrice = priceFeedUpdateData.parsed![0].price;
     const actualPrice = parseInt(parsedPrice.price) * (10 ** parsedPrice.expo)
     return actualPrice;
   }
   ```

   This function receives a Hermes connection object and returns the current XTZ/USD price.

1. Add this utility function to check the price repeatedly and return the new price when it has changed above a given threshold:

   ```javascript
   // Get the baseline price and poll until it changes past the threshold
   const alertOnPriceFluctuations = async (_baselinePrice: number, connection: HermesClient): Promise<number> => {
     const baselinePrice = _baselinePrice;
     await delaySeconds(DELAY);
     let updatedPrice = await getPrice(connection);
     while (Math.abs(baselinePrice - updatedPrice) < CHANGE_THRESHOLD) {
       await delaySeconds(DELAY);
       updatedPrice = await getPrice(connection);
     }
     return updatedPrice;
   }
   ```

1. Add a`run` function to contain the main logic of the application:

   ```javascript
   const run = async () => {

     // Logic goes here

   }

   run();
   ```

1. Replace the `// Logic goes here` comment with this code, which checks your account and calls the contract's `initAccount` function if necessary to give you some simulated tokens to start with:

   ```javascript
   // Check balance first
   let balance = await getBalance();
   console.log("Starting balance:", balance);
   let cash = await getCash();
   console.log("Starting cash in contract:", cash, "XTZ");
   // If not enough tokens, initialize balance with 5 tokens in the contract
   if (balance < 5) {
     console.log("Initializing account with 5 tez");
     const initHash = await contract.write.initAccount([myAccount.address]);
     await publicClient.waitForTransactionReceipt({ hash: initHash });
     balance = await getBalance()
     console.log("Initialized account. New balance is", balance);
   }
   ```

1. After that code, add this code to create the connection to the Hermes client:

   ```javascript
   const connection = new HermesClient("https://hermes.pyth.network");
   ```

1. Add this loop, which iterates a certain number of times or until the account runs out of tokens:

   ```javascript
   let i = 0;
   while (balance > 0 && i < 5) {
     console.log("\n");
     console.log("Iteration", i++);
     let baselinePrice = await getPrice(connection);
     console.log("Baseline price:", baselinePrice);

     const updatedPrice = await alertOnPriceFluctuations(baselinePrice, connection);
     console.log("Price changed:", updatedPrice);
     const priceFeedUpdateData = await connection.getLatestPriceUpdates([XTZ_USD_ID]);
     if (baselinePrice > updatedPrice) {
       // Buy
       console.log("Price went down; time to buy");
       const oneUSD = Math.ceil((1/updatedPrice) * 100) / 100; // Round up to two decimals
       console.log("Sending", oneUSD, "XTZ (about one USD)");
       const buyHash = await contract.write.buy(
         [[`0x${priceFeedUpdateData.binary.data[0]}`]] as any,
         { value: parseEther(oneUSD.toString()), gas: 30000000n },
       );
       await publicClient.waitForTransactionReceipt({ hash: buyHash });
       console.log("Bought one token");
     } else if (baselinePrice < updatedPrice) {
       console.log("Price went up; time to sell");
       // Sell
       const sellHash = await contract.write.sell(
         [[`0x${priceFeedUpdateData.binary.data[0]}`]] as any,
         { gas: 30000000n }
       );
       await publicClient.waitForTransactionReceipt({ hash: sellHash });
       console.log("Sold one token");
     }
     balance = await getBalance();
   }
   ```

   The code in this loop uses the `alertOnPriceFluctuations` function wait until the XTZ/USD price has changed significantly.
   If the price of USD relative to XTZ went down, it's cheaper to buy the simulated token, so the code buys one.
   If the price of USD went up, it sells a token.

1. After the loop, add this code to cash out so you don't leave your sandbox XTZ locked in the contract:

   ```javascript
   // Cash out
   console.log("Cashing out");
   // Call the cashout function to retrieve the XTZ you've sent to the contract (for tutorial purposes)
   await contract.write.cashout();
   ```

The complete application looks like this:

```javascript
import { HermesClient, PriceUpdate } from "@pythnetwork/hermes-client";
import { createWalletClient, http, getContract, createPublicClient, defineChain, Account, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../../contracts/out/TutorialContract.sol/TutorialContract.json";

// Pyth ID for exchange rate of XTZ to USD
const XTZ_USD_ID = process.env["XTZ_USD_ID"] as string;

// Contract I deployed
const CONTRACT_ADDRESS = process.env["DEPLOYMENT_ADDRESS"] as any; // sandbox

// My account based on private key
const myAccount: Account = privateKeyToAccount(`0x${process.env["PRIVATE_KEY"] as any}`);

// Viem custom chain definition for Etherlink sandbox
const etherlinkSandbox = defineChain({
  id: 128123,
  name: 'EtherlinkSandbox',
  nativeCurrency: {
    decimals: 18,
    name: 'tez',
    symbol: 'xtz',
  },
  rpcUrls: {
    default: {
      http: [process.env["RPC_URL"] as string],
    },
  },
});

// Viem objects that allow programs to call the chain
const walletClient = createWalletClient({
  account: myAccount,
  chain: etherlinkSandbox, // Or use etherlinkTestnet from "viem/chains"
  transport: http(),
});
const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: abi,
  client: walletClient,
});
const publicClient = createPublicClient({
  chain: etherlinkSandbox, // Or use etherlinkTestnet from "viem/chains"
  transport: http()
});

// Delay in seconds between polling Hermes for price data
const DELAY = 3;
// Minimum change in exchange rate that counts as a price fluctuation
const CHANGE_THRESHOLD = 0.0001;

// Utility function to call read-only smart contract function
const getBalance = async () => parseInt(await contract.read.getBalance([myAccount.address]) as string);

// Pause for a given number of seconds
const delaySeconds = (seconds: number) => new Promise(res => setTimeout(res, seconds*1000));

// Utility function to call Hermes and return the current price of one XTZ in USD
const getPrice = async (connection: HermesClient) => {
  const priceIds = [XTZ_USD_ID];
  const priceFeedUpdateData = await connection.getLatestPriceUpdates(priceIds) as PriceUpdate;
  const parsedPrice = priceFeedUpdateData.parsed![0].price;
  const actualPrice = parseInt(parsedPrice.price) * (10 ** parsedPrice.expo)
  return actualPrice;
}

// Get the baseline price and poll until it changes past the threshold
const alertOnPriceFluctuations = async (_baselinePrice: number, connection: HermesClient): Promise<number> => {
  const baselinePrice = _baselinePrice;
  await delaySeconds(DELAY);
  let updatedPrice = await getPrice(connection);
  while (Math.abs(baselinePrice - updatedPrice) < CHANGE_THRESHOLD) {
    await delaySeconds(DELAY);
    updatedPrice = await getPrice(connection);
  }
  return updatedPrice;
}

const run = async () => {

  // Check balance first
  let balance = await getBalance();
  console.log("Starting balance:", balance);
  // If not enough tokens, initialize balance with 5 tokens in the contract
  if (balance < 5) {
    console.log("Initializing account with 5 tez");
    const initHash = await contract.write.initAccount([myAccount.address]);
    await publicClient.waitForTransactionReceipt({ hash: initHash });
    balance = await getBalance()
    console.log("Initialized account. New balance is", balance);
  }

  const connection = new HermesClient("https://hermes.pyth.network");

  let i = 0;
  while (balance > 0 && i < 5) {
    console.log("\n");
    console.log("Iteration", i++);
    let baselinePrice = await getPrice(connection);
    console.log("Baseline price:", baselinePrice);

    const updatedPrice = await alertOnPriceFluctuations(baselinePrice, connection);
    console.log("Price changed:", updatedPrice);
    const priceFeedUpdateData = await connection.getLatestPriceUpdates([XTZ_USD_ID]);
    if (baselinePrice > updatedPrice) {
      // Buy
      console.log("Price went down; time to buy");
      const oneUSD = Math.ceil((1/updatedPrice) * 100) / 100; // Round up to two decimals
      console.log("Sending", oneUSD, "XTZ (about one USD)");
      const buyHash = await contract.write.buy(
        [[`0x${priceFeedUpdateData.binary.data[0]}`]] as any,
        { value: parseEther(oneUSD.toString()), gas: 30000000n },
      );
      await publicClient.waitForTransactionReceipt({ hash: buyHash });
      console.log("Bought one token");
    } else if (baselinePrice < updatedPrice) {
      console.log("Price went up; time to sell");
      // Sell
      const sellHash = await contract.write.sell(
        [[`0x${priceFeedUpdateData.binary.data[0]}`]] as any,
        { gas: 30000000n }
      );
      await publicClient.waitForTransactionReceipt({ hash: sellHash });
      console.log("Sold one token");
    }
    balance = await getBalance();
  }

  // Cash out
  console.log("Cashing out");
  // Call the cashout function to retrieve the XTZ you've sent to the contract (for tutorial purposes)
  await contract.write.cashout();
}

run();
```

To run the off-chain application, run the command `npx ts-node src/checkRate.ts`.
The application calls the `buy` and `sell` function based on real-time data from Hermes.
Here is the output from a sample run:

```
Baseline price: 0.53016063
Price changed: 0.53005698
Price went down; time to buy
Sending 1.89 XTZ (about one USD)
Bought one more token


Iteration 2
Baseline price: 0.52988309
Price changed: 0.53
Price went up; time to sell
Sold one token


Iteration 3
Baseline price: 0.53
Price changed: 0.53010189
Price went up; time to sell
Sold one token


Iteration 4
Baseline price: 0.53015637
Price changed: 0.52978122
Price went down; time to buy
Sending 1.89 XTZ (about one USD)
Bought one token

Cashing out
```

Now you can use the pricing data in the contract from off-chain applications.
You could expand this application by customizing the buy and sell logic or by tracking your account's balance to see if you earned XTZ.

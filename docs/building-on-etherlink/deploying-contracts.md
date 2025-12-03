---
title: Deploying smart contracts
dependencies:
  ethers: 6.13.5
---

import PublicRpcRateLimitNote from '@site/docs/conrefs/rate-limit.md';

As an EVM-compatible chain, Etherlink runs Solidity contracts.
You can deploy Solidity smart contracts in any way that you would deploy them to an EVM-compatible chain.

:::note

Etherlink supports Solidity versions up to and including 0.8.24.

:::

You can use any of the toolkits in [Development toolkits](/building-on-etherlink/development-toolkits) to deploy to Etherlink, as well as standard tools such as the [Remix Ethereum IDE](https://remix.ethereum.org/).

To call the contract after you deploy it, see [Sending transactions](/building-on-etherlink/transactions).

## Deploying with Remix

The Remix online IDE lets you code, compile, and deploy contracts to EVM chains, including Etherlink

1. Connect your wallet to Etherlink Shadownet Testnet as described in [Using your wallet](/get-started/using-your-wallet).

1. Get some Etherlink tokens as described in [Getting Testnet tokens](/get-started/getting-testnet-tokens).

1. Open the Remix IDE at https://remix.ethereum.org.

1. In the **contracts** section of the IDE, create a contract.
For example, you can create a contract named `4_HelloEtherlink.sol` and use this contract from the [Solidity by Example](https://solidity-by-example.org/hello-world/):

   ```solidity
   // SPDX-License-Identifier: MIT
   // compiler version must be greater than or equal to 0.8.24 and less than 0.9.0
   pragma solidity ^0.8.24;
   contract HelloEtherlink {
     string public greet = "Hello Etherlink!";
   }
   ```

   The IDE looks like this, with your contract in the file explorer:

   ![The Remix IDE, showing the new contract in the file explorer and the code of the contract in the editor](/img/remix-new-solidity-contract.png)

1. On the **Compiler** tab, select compiler version 0.8.24, as shown in this picture:

   ![Selecting the Solidity version to use](/img/remix-select-version.png)

1. Compile the contract.

1. On the **Deploy and Run Transactions** tab, in the **Environment** list, select **Browser extension > Injected Provider - MetaMask**.
Your MetaMask wallet opens to confirm the network connection.

1. In MetaMask, confirm the connection and select the account to use.

1. In the IDE, verify that the **Account** field shows your account and the tokens in it, as in this picture:

   ![The connected account in the IDE](/img/remix-connected-account.png)

1. Click **Deploy** and confirm the transaction in MetaMask.

1. Call the contract by clicking the button for its entrypoint in the **Deployed/Unpinned Contracts** section.
If you used the example contract above, you can call the `greet` entrypoint and see the result underneath the button:

   ![The result of calling the `greet` entrypoint in the example contract](/img/remix-call-contract.png)

Now the contract is deployed on Etherlink.
You can look it up on the [Shadownet block explorer](https://shadownet.explorer.etherlink.com/).

## Deploying with ethers.js

If you have the compiled bytecode of the Solidity contract, you can use [ethers.js](https://docs.ethers.org/v6/) to deploy it.

<PublicRpcRateLimitNote />

For example, this program uses ethers.js to deploy a contract:

```javascript
const { ethers } = require("ethers");

const fullABI = []; // Add complete ABI here

const contractByteCode = "0x..."; // Add compiled bytecode here

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function deployContract() {

  // Create contract factory
  const factory = new ethers.ContractFactory(fullABI, contractByteCode, wallet);

  console.log("Deploying contract...");
  const contract = await factory.deploy();

  // Wait for deployment confirmation
  await contract.deploymentTransaction().wait();

  console.log("Contract deployed at:", contract.target);
}

deployContract();
```

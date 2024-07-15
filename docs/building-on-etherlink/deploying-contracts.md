---
title: Deploying Solidity contracts
---

As an EVM-compatible chain, Etherlink runs Solidity contracts.
You can deploy Solidity contracts in any way that you would deploy them to an EVM-compatible chain.

:::note

Etherlink supports Solidity versions up to and including 0.8.24.

:::

You can use any of the toolkits in [Development toolkits](./development-toolkits) to deploy to Etherlink, as well as standard tools such as the [Remix Ethereum IDE](https://remix.ethereum.org/).

## Deploying with Remix

The Remix online IDE lets you code, compile, and deploy Solidity contracts to EVM chains, including Etherlink

1. Connect your wallet to Etherlink Ghostnet as described in [Using your wallet](../get-started/using-your-wallet).

1. Get some Etherlink tokens as described in [Getting testnet tokens](../get-started/getting-testnet-tokens).

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

1. On the **Deploy and Run Transactions** tab, in the **Environment** list, select **Injected Provider - MetaMask**.
Your MetaMask wallet opens to confirm the network connection.

1. In MetaMask, confirm the connection and select the account to use.

1. In the IDE, verify that the **Account** field shows your account and the tokens in it, as in this picture:

   ![The connectec account in the IDE](/img/remix-connected-account.png)

1. Click **Deploy** and confirm the transaction in MetaMask.

1. Call the contract by clicking the button for its entrypoint in the **Deployed/Unpinned Contracts** section.
If you used the example contract above, you can call the `greet` entrypoint and see the result underneath the button:

   ![The result of calling the `greet` entrypoint in the example contract](/img/remix-call-contract.png)

Now the contract is deployed on Etherlink.
You can look it up on the [Ghostnet block explorer](https://testnet-explorer.etherlink.com/).

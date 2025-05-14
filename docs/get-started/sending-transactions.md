---
title: Sending transactions
---

Sending a transaction on Etherlink is similar to sending a transaction on any other EVM-compatible chain.
Etherlink is compatible with EVM wallets that support custom EVM networks, including Metamask, Coinbase Wallet, Trust Wallet, Altme wallet, and Rabby wallet, as described in [Using your wallet](/get-started/using-your-wallet).

Therefore, sending a transaction on Etherlink is just like sending a transaction on other chains: you connect your wallet to a dApp, usually on a web page, and it sends the transaction to your wallet for you to approve and sign.

## Why is my transaction still pending?

Etherlink transactions are typically finalized by the sequencer in a few seconds, which allows your wallet to show that the transaction is complete.

However, if the transaction fee that your wallet included is insufficient to pay the transaction fee, Etherlink drops the transaction, but the wallet may show the transaction in a pending state for a long time.
The amount of time depends on the wallet and its settings.
During this time, the wallet continues to try to send the transaction, and you can wait for it to complete, cancel it, or increase the transaction fee to speed it up.

## Speeding up transactions

Most wallets include options to increase the transaction fee by enough to get the transaction finalized.
You can increase the fee at the time you send the transaction or add fees to a previously sent transaction.

:::note

Any difference between the fee that you set and the necessary fee for the transaction is refunded to you.
Etherlink takes only the fee that is necessary to include the transaction at the current gas cost, not the maximum that you set for the transaction.

:::

### Increasing fees for a new transaction (Metamask)

In the Metamask web browser extension, when you are sending a transaction you can click the edit button next to the **Network fee** field and change the amount, as shown in this picture:

<img src="/img/metamask-change-fee-signing.png" alt="Clicking the Network fee field while signing a Metamask transaction" style={{width: 300}} />

From here, click **Advanced** to set a custom transaction fee:

<img src="/img/metamask-change-fee-signing-advanced.png" alt="Clicking Advanced to set a custom transaction fee " style={{width: 300}} />

Then, increase the base fee in the **Max base fee (gwei)** field, not the Priority fee field, as in the following picture, which shows a base fee of 3 gwei, which is 3 times the default.
The resulting transaction fee is 0.0018713 XTZ.
Etherlink does not use a priority fee (also called a tip) to speed up transactions, so you can ignore the Priority fee field.

<img src="/img/metamask-change-fee-custom-base-fee.png" alt="Setting the maximum base fee" style={{width: 300}} />

Now you can send the transaction as usual and accept a higher fee if it is necessary based on the network's base fee.

### Increasing fees for a new transaction (Rabby wallet)

To change the fees in the Rabby wallet browser extension, click **Advanced Settings** in the transaction confirmation window:

<img src="/img/rabby-change-fee-advanced.png" alt="Selecting the advanced settings for the transaction" style={{width: 300}} />

Then in the advanced settings, change the gas limit, which is the maximum transaction fee to include with the transaction, in gwei:

<img src="/img/rabby-change-fee-max-fee.png" alt="Selecting the advanced settings for the transaction" style={{width: 300}} />

Now you can send the transaction as usual and accept a higher fee if it is necessary based on the network's base fee.

### Increasing the fees on a pending transaction (Metamask)

This Metamask transaction is shown as pending because it did not include enough transaction fees.
Etherlink has dropped the transaction but the wallet has not updated its status yet:

<img src="/img/metamask-speed-up-pending.png" alt="A pending transaction in Metamask" style={{width: 300}} />

To speed up the transaction, click **Speed up** and provide a larger transaction fee.
Then you can set a new fee, as shown in this picture:

<img src="/img/metamask-speed-up-set-fee.png" alt="Setting a new fee for a pending transaction" style={{width: 300}} />

The wallet sends a new transaction with the increased fee.

### Increasing the fees on a pending transaction (Rabby wallet)

Rabby wallet shows a spinning indicator with a number to indicate pending transactions.
In this picture, one transaction is shown as pending because it did not include enough transaction fees.
Etherlink has dropped the transaction but the wallet has not updated its status yet:

<img src="/img/rabby-speed-up-pending.png" alt="A pending transaction in Rabby wallet" style={{width: 300}} />

To speed up the transaction, click the pending indicator.
Rabby wallet shows the pending transactions and warnings about how long they have been pending:

<img src="/img/rabby-speed-up-pending-list.png" alt="The list of pending transactions and warnings about the delay" style={{width: 300}} />

Then, click the lightning bolt icon next to the transaction:

<img src="/img/rabby-speed-up-lightning-bolt.png" alt="Clicking the lightning bold next to a pending transaction" style={{width: 300}} />

A window for the new transaction opens.
From here, click **Advanced Settings**, put in a higher gas limit as described in [Increasing fees for a new transaction (Rabby wallet)](#increasing-fees-for-a-new-transaction-rabby-wallet), and submit the new transaction.

The wallet sends a new transaction with the increased fee.

## Checking gas prices

As described in [Estimating fees](/building-on-etherlink/estimating-fees), the _gas price_ is the cost per unit of computation required by a transaction.
The fee for a transaction depends on the gas price.
The Etherlink gas price (and therefore the fee for a given transaction) varies based on the activity on the chain.
The default gas price is 1 gwei, or 0.000000001 XTZ, but at times of high activity it can go higher.

Here are some ways to get Etherlink's gas price:

- For an average of Etherlink gas prices, go to the [Gas tracker](https://explorer.etherlink.com/gas-tracker) page on the Etherlink block explorer.

- For the actual gas price of the previous block, go to https://explorer.etherlink.com/blocks, click the most recent block, and check the `Base fee per gas` field.

- Developers can use the standard EVM `eth_gasPrice` endpoint, as described in [Estimating fees](/building-on-etherlink/estimating-fees).

The actual cost of a transaction depends on the gas price and the complexity of the transaction.
Wallets show the estimated cost for a transaction before you approve the transaction.

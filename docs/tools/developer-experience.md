---
title: Developer experience
---

## Thirdweb

[Thirdweb](https://thirdweb.com/) provides a series of tools to make developing dApps easier.

Check out their amazing [video tutorials](https://www.youtube.com/watch?v=0DQqtxoMw1E&list=PLhkjr9MPgk0w9CE9HWKUwUfxfxLZQfRnx) to learn more about their SDKs and how to more easily build EVM dApps.

## Safe

[Etherlink Safe](https://safe.etherlink.com) is an Etherlink implementation of [Safe\{Wallet\}](https://github.com/safe-global/safe-wallet-web), which manages multi-signature smart contracts (multisigs).
Multisigs require signatures from two or more accounts before running transactions, which can provide additional security for accounts or require multiple parties to agree to a transaction.
Etherlink Safe helps you create multisigs, select the accounts that can sign transactions, and set the number of signatures required to run a transaction.
It also helps manage transactions that are waiting for signatures.

## Gelato

Gelato Web3 Functions supports Etherlink, which lets you automate Etherlink contracts based on off-chain activity and activity on other chains.
For more information, see the Gelato Web3 Functions documentation at https://docs.gelato.cloud/Web3-Functions/Introduction/Overview.

For example, this contract emits an event when its `sayMarco` function is called:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Marco {
  event MarcoEvent(address indexed caller);

  function sayMarco() public {
    emit MarcoEvent(msg.sender);
  }
}
```

Similarly, this contract has a `hearMarco` function that emits an event when it is called:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Polo {
  event PoloEvent(address indexed caller);

  uint256 timesHeard;

  constructor() {
    timesHeard = 0;
  }

  function hearMarco() public {
    timesHeard += 1;
    emit PoloEvent(msg.sender);
  }

  function getTimesHeard() external view returns (uint256) {
    return timesHeard;
  }
}
```

Because smart contracts cannot respond to events, these two contracts cannot interact directly.
You can use Gelato Web3 Functions to listen for the `Marco` event and call the `hearMarco` function, even if these two contracts are on different networks.

For example, you can register with Gelato at https://app.gelato.cloud and then click **Functions** and **New** to create a new function.

On the New Function Task window, select the trigger, in this case **On-chain Event**.
Gelato also supports time and block-based triggers.

Select the network to monitor (such as Etherlink Testnet or Mainnet), specify the address and ABI of the contract, and the event to trigger on, as in this screencap:

<img src="/img/gelato-trigger.png" alt="Setting the trigger condition for the Web3 Function" style={{width: 300}} />

Then, further down, specify the action to run when the trigger happens.
For example, to call the other contract's `hearMarco` function, click **Transaction**.
Then, select the network and specify the address, ABI, and function to call, as in this screencap:

<img src="/img/gelato-transaction.png" alt="Setting the transaction to run when the trigger happens" style={{width: 300}} />

Now when the first contract emits the event, Gelato calls the second contract.
These contracts can be on the same chain or different chains.

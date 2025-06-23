---
title: "Tutorial: Use the Pyth oracle for DeFi applications on Etherlink"
---

Etherlink is great for DeFi applications because of its low latency, fast confirmation times, and low fees.
This tutorial shows you how to set up a simple application that gets market information from [Pyth](https://www.pyth.network/) and makes trading decisions based on those prices.

Pyth is a network of oracles, which provide information about currency prices and other market data to smart contracts.
As described in [Oracles](https://docs.tezos.com/smart-contracts/oracles) on docs.tezos.com, smart contracts cannot call external APIs, so they depend on oracles for information about the world outside the blockchain.
Smart contracts must call oracles in a specific way and pay fees to use them.

This tutorial is an adaptation of this Pyth tutorial for Etherlink and its sandbox development environment:
https://docs.pyth.network/price-feeds/create-your-first-pyth-app/evm/part-1

## Learning objectives

In this tutorial, you learn how to:

- Start and use the Etherlink sandbox environment
- Call the Pyth DeFi oracle
- Use the Foundry toolkit to build, test, and deploy a smart contract to Etherlink
- Call an oracle from a smart contract
- Call the smart contract from an off-chain application
- Make basic buy and sell decisions based on the information from the oracle

## Tutorial application

The application that you create in this tutorial has an on-chain component in the form of a smart contract deployed to Etherlink.
It also has an off-chain component in the form of a Node.JS application that calls the smart contract.

The code for the completed application is in this GitHub repository: https://github.com/trilitech/tutorial-applications/tree/main/etherlink-defi.

## Tutorial sections

- [Part 1: Setting up a development environment](/tutorials/oracles/environment)
- [Part 2: Getting information from the Pyth oracle](/tutorials/oracles/get_data)
- [Part 3: Using price data to buy and sell tokens](/tutorials/oracles/tokens)
- [Part 4: Automating pricing decisions](/tutorials/oracles/application)

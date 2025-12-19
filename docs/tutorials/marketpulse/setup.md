---
title: Set up a development environment for Etherlink
dependencies:
  hardhat: 3.0.17
---

> Etherlink is 100% compatible with Ethereum technology, which means that you can use any Ethereum-compatible tool for development, including Hardhat, Foundry, Truffle Suite, and Remix IDE.
> For more information on tools that work with Etherlink, see [Developer toolkits](https://docs.etherlink.com/building-on-etherlink/development-toolkits) in the Etherlink documentation.

In this tutorial, you use [Hardhat](https://hardhat.org/tutorial/creating-a-new-hardhat-project) to manage development tasks such as compiling and testing smart contracts.
You also use Viem, which is a lightweight, type-safe Ethereum library for JavaScript/TypeScript.
It provides low-level, efficient blockchain interactions with minimal abstraction.

1. Install Node.JS version 22 or later, which is required for Hardhat.

1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Initialize an Node project with NPM in a fresh directory:

   ```bash
   npm init -y
   npm install -D typescript @types/node ts-node chai @types/chai
   ```

1. Install Hardhat and initialize it:

   ```bash
   npm install -D hardhat
   npx hardhat --init
   ```

1. Follow these steps in the Hardhat prompts:

   1. In the Hardhat prompts, select version 3 of Hardhat and `.` as the relative path to the project.

   1. In the prompt for the type of project to create, select `A TypeScript Hardhat project using Node Test Runner and Viem`.

   1. Select `true` or `Y` to convert the project's `package.json` file to ESM.

   1. At the prompt to install dependencies, select `true` or `Y`.

   1. If Hardhat prompts you to update TypeScript dependencies, select `true` or `Y`.

1. Install `@openzeppelin/contracts` to use the Math library for safe calculations:

   ```bash
   npm i @openzeppelin/contracts
   ```

1. Install dev libraries for verifying your smart contract:

   ```bash
   npm i -D @nomicfoundation/hardhat-verify
   ```

   Verify is a feature that verifies contracts on an Ethereum block explorer by checking the compiled code against the source code.
   Verifying your contracts provides source code transparency and a source reference for some tools to generate utility code.

1. (Optional) If you are using VsCode for development, install the Hardhat/Solidity plugin from Nomic: [Solidity plugin for VsCode](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)

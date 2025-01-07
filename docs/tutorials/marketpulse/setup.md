# Set up a development environment for Etherlink

> Etherlink is 100% compatible with Ethereum technology, which means that you can use any Ethereum-compatible tool for development, including Hardhat, Foundry, Truffle Suite, and Remix IDE.
> For more information on tools that work with Etherlink, see [Developer toolkits](https://docs.etherlink.com/building-on-etherlink/development-toolkits) in the Etherlink documentation.

In this tutorial, you use [Hardhat](https://hardhat.org/tutorial/creating-a-new-hardhat-project) to manage development tasks such as compiling and testing smart contracts.
You also use Viem, which is a lightweight, type-safe Ethereum library for JavaScript/TypeScript.
It provides low-level, efficient blockchain interactions with minimal abstraction.

1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Initialize an Node project with NPM:

   ```bash
   npm init -y
   npm install -D typescript @types/node ts-node
   ```

1. Install Hardhat and initialize it:

   ```bash
   npm install -D hardhat
   npx hardhat init
   ```

1. In the Hardhat prompts, select `Create a TypeScript project (with Viem)`.

1. At the prompt `Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox-viem)? (Y/n)` select `Y`.

1. Install `@openzeppelin/contracts` to use the Math library for safe calculations:

   ```bash
   npm i @openzeppelin/contracts
   ```

1. Install dev libraries for verifying your smart contract:

   ```bash
   npm i -D @nomicfoundation/hardhat-verify
   ```

   Verify is a feature that verifies contracts on an Ethereum block explorer by checking the compiled code against the source code.
   Verifying your contracts provides source code transparency and a source reference for some tools to generate utility code

1. (Optional) If you are using VsCode for development, install the Hardhat/Solidity plugin from Nomic: [Solidity plugin for VsCode](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)

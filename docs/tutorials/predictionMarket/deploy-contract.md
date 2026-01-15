---
title: "Part 2: Deploying the contract"
---

In this section you deploy the contract to the Etherlink Shadownet Testnet, where you can test it without working with real funds.

1. In hte `backend` project, create a file named `scripts/deploy.js` with this code:

   ```javascript
   // scripts/deploy.js
   const hre = require("hardhat");

   async function main() {
     // Get the deployer account
     const [deployer] = await hre.ethers.getSigners();
     console.log("Deploying contract with account:", deployer.address);

     // Compile & get the contract factory
     const MyContract = await ethers.getContractFactory("PredictxtzContract");

     // Deploy the contract
     const DeployedContract = await MyContract.deploy();
     await DeployedContract.deployed();

     console.log("Contract deployed to:", DeployedContract.address);
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error("Deployment failed:", error);
       process.exit(1);
     });
   ```

   This script deploys the compiled contract.
   The account that deploys it automatically becomes the administrator account.

1. Using the [Etherlink Shadownet faucet](https://shadownet.faucet.etherlink.com/), get some XTZ in your account to pay for transaction fees.

1. Run this command to deploy the contract to Shadownet:

   ```bash
   npx hardhat run scripts/deploy.js --network etherlink
   ```

   If deployment is successful, Hardhat prints the address of your account and the address of the deployed contract to the console, as in this example:

   ```
   Deploying contract with account: 0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d
   Contract deployed to: 0xCC276f21e018aD59ee1b91C430AFfeF0147f9C91
   ```

   If the command failed, check your contract and deployment files and run the compilation and deployment commands again.

1. Copy the address of the deployed contract and look it up on the [Etherlink Shadownet block explorer](https://shadownet.explorer.etherlink.com/).

In the block explorer you can see the creator of the contract and information about its transactions.

<img src="/img/tutorials/prediction-deployed-contract.png" alt="The deployed contract in the block explorer, showing only the origination transaction" style={{width: 500}} />

## Interacting with the contract

To test the contract, you can interact with it directly on the block explorer.
However, you must add the ABI of the contract so the block explorer can format transactions correctly.
The ABI is the complete interface for the contract, including all of its public functions and events.
It is generated during the compilation process.

1. Log in to the Etherlink [block explorer](https://shadownet.explorer.etherlink.com/) with your wallet by clicking `Log in`, clicking `Continue with Web3 wallet`, and connecting your wallet.

1. Upload the contract ABI:

   1. Copy the ABI of the compiled contract by opening the `artifacts/contracts/Contract.sol/PredictxtzContract.json` file and copying the value of the `abi` field, which is an array.

   1. On the block explorer, go to the contract, go to the **Contract** tab, click **Custom ABI**, and click **Add custom ABI**.

   1. In the pop-up window, give the contract the name `PredictxtzContract` and paste the ABI array, as in this picture:

      <img src="/img/tutorials/prediction-new-custom-abi.png" alt="Adding a name and custom ABI for the contract" style={{width: 500}} />

   1. Click **Create custom ABI**.

   Now the **Contract > Custom ABI** tab shows the functions in the contract:

   <img src="/img/tutorials/prediction-custom-abi-functions.png" alt="The list of functions in the contract based on the ABI you uploaded" style={{width: 500}} />

1. Create the first prediction market in the contract:

   1. Expand the `CreateMarket` function.

   1. In the **Question** field, put the question for the prediction market, such as "Will it rain one week from today?"

   1. In the **Duration** field, enter `604 800` to represent one week in seconds.

      <img src="/img/tutorials/prediction-create-market.png" alt="Setting the parameters for the function" style={{width: 500}} />

   1. Click **Write**.

   1. Approve the transaction in your wallet and wait for it to be confirmed.

Now the contract has an active prediction market and users can make bets.
Continue to [Part 3: Setting up the frontend](/tutorials/predictionMarket/frontend).

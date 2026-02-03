---
title: "Part 1: Writing a contract"
---

In this section, you write a simple prediction market contract.
This contract uses the [OpenZeppelin](https://docs.openzeppelin.com/) library as a starting point.
The OpenZeppelin library includes tested and secure contracts, and using pre-tested contracts like these can be easier and safer than writing your own contracts, especially when you deal with betting systems that can be manipulated.

Etherlink is compatible with Ethereum technology, which means that you can use any Ethereum-compatible tool for development, including Hardhat, Foundry, Truffle Suite, and Remix IDE.
For more information on tools that work with Etherlink, see [Developer toolkits](/building-on-etherlink/development-toolkits).
The starter project also uses the [Hardhat](/building-on-etherlink/development-toolkits) development environment to simplify the process of compiling and deploying the contract.

## Writing the contract

Follow these steps to set up the contract for the prediction market:

1. Install Node.JS version 22 or later, which is required for Hardhat.

1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Create a directory to store your project in.

1. Initialize a Node project with NPM in that directory:

   ```bash
   npm init -y
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

1. Delete the default files that Hardhat created:

   ```bash
   rm -rf contracts ignition scripts test
   ```

1. Install the `@openzeppelin/contracts` package to use the Openzepplin libraries in your contract:

   ```bash
   npm i @openzeppelin/contracts
   ```

1. Install the `dotenv` package to use variables from `.env` files and [Viem](https://viem.sh/) to interact with Etherlink:

   ```bash
   npm i dotenv @nomicfoundation/hardhat-viem
   ```

1. Replace the default `hardhat.config.ts` file with this file, which includes configuration information for Etherlink Shadownet and local sandbox:

   ```javascript
   import dotenv from 'dotenv';
   dotenv.config();

   import hardhatViem from "@nomicfoundation/hardhat-viem";

   /** @type import('hardhat/config').HardhatUserConfig */
   module.exports = {
     plugins: [
       hardhatViem,
     ],
     solidity: "0.8.24",
     networks: {
       etherlinkShadownet: {
         type: 'http',
         url: "https://node.shadownet.etherlink.com",
         chainId: 127823,
         accounts: [process.env.PRIVATE_KEY],
       },
       etherlinkSandbox: {
         type: 'http',
         url: "http://localhost:8545",
         chainId: 127823,
         accounts: [process.env.PRIVATE_KEY],
       },
     },
   };
   ```

1. Create a file named `contracts/Contract.sol` in any text editor or IDE and add this code:

   ```solidity
   // SPDX-License-Identifier: UNLICENSED
   pragma solidity 0.8.24;

   // for creating a contract that can be owned by an address
   // this is useful for managing access permissions to methods in the contract
   import "@openzeppelin/contracts/access/Ownable.sol";

   // for preventing reentrancy attacks on functions that modify state
   // this is important for functions that involve transferring tokens or ether
   // to ensure that the function cannot be called again while it is still executing
   import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

   /** @title A simple prediction market that uses the Pari-mutuel model allowing winners to share the prize pool.
    */

   contract PredictxtzContract is Ownable, ReentrancyGuard {
      // This contract allows users to create markets, place bets, resolve markets, and claim winnings.

   }
   ```

   This starter contract imports two OpenZeppelin contract libraries:

      - `Ownable`: Manages access permissions in the contract by setting a single administrator account and allowing only that account to run certain functions
      - `ReentrancyGuard`: Helps prevent re-entrancy attacks on functions that modify state, such as preventing the winner from claiming the same reward twice, which is particularly important for functions that involve transferring tokens

1. Within the contract, add this constructor:

   ```solidity
   constructor() Ownable(msg.sender) {}
   ```

   This code initializes the owner as the address that deploys the contract.

1. Within the contract, add these variables and structs:

   ```solidity
   // constants
   uint256 public constant PRECISION = 1e18;
   uint256 public constant VIRTUAL_LIQUIDITY = 1000 * PRECISION; // used to calculate price per share

   // holds information about each market
   struct Market {
       uint256 id;
       string question;
       // string description;
       uint256 endTime; // When betting stops
   //  uint256 resolveTime;    // When market can be resolved. // For now, we resolve immediately after endTime or manually
       bool resolved;
       uint8 winner; // 0 = NO, 1 = YES, 2 = INVALID
       uint256 totalYesAmount; // Total $ bet on YES
       uint256 totalNoAmount; // Total $ bet on NO
       uint256 totalYesShares; // Total YES shares (for price calculation)
       uint256 totalNoShares; // Total No shares (for price calculation)
       uint256 marketBalance; // how much is in the market
       address creator;
       // uint256 createdAt;
       bool active;
   }


   // calculates the total position held by a market participant
   struct Position {
       uint256 yesAmount; // $ amount bet on YES
       uint256 noAmount; // $ amount bet on NO
       uint256 yesShares; // YES shares owned (for pool splitting)
       uint256 noShares; // NO shares owned (for pool splitting)
       bool claimed; // Whether winnings have been claimed
   }

   uint256 public marketCounter; // keeps track of the no of markets created

   mapping(uint256 => Market) public markets;
   mapping(uint256 => mapping(address => Position)) public positions;
   mapping(address => uint256[]) public userMarkets;
   ```

   The `Market` struct defines a type for each prediction market that the contract manages, including a description of the question, the time for the end of the process, and information about the current bets.

   The `Position` struct defines a type for each bet that a user makes, including the amount that they bet on the yes or no options and whether they have claimed their rewards.


1. Add these event definitions:

   ```solidity
   // events
   event MarketCreated(
       uint256 indexed marketId,
       address indexed creator,
       string question,
       uint256 endTime
   );

   event BetPlaced(
       uint256 indexed marketId,
       address indexed user,
       bool indexed isYes,
       uint256 amount,
       uint256 shares
   );

   event MarketResolved(
       uint256 indexed marketId,
       uint8 indexed winner,
       address indexed resolver
   );

   event WinningsClaimed(
       uint256 indexed marketId,
       address indexed user,
       uint256 amount
   );
   ```

   Off-chain applications can listen to these events and learn when a betting market opens, when bets are added, when accounts place bets, and when the winner claims their winnings.

1. Add this function to create a betting market:

   ```solidity
      function createMarket(
       string calldata question,
       uint256 duration
   ) external returns (uint256) {
       require(duration > 0, "Duration must be positive");
       require(bytes(question).length > 0, "Question cannot be empty");

       uint256 marketId = ++marketCounter;

       markets[marketId] = Market({
           id: marketId,
           question: question,
           endTime: block.timestamp + duration,
           resolved: false,
           winner: 2, // Unresolved
           totalYesAmount: 0, // No money in pool yet
           totalNoAmount: 0, // No money in pool yet
           totalYesShares: VIRTUAL_LIQUIDITY, // Virtual shares for pricing
           totalNoShares: VIRTUAL_LIQUIDITY, // Virtual shares for pricing
           marketBalance: 0,
           creator: msg.sender,
           // createdAt: block.timestamp,
           active: true
       });

       // emiting events makes it cheaper to track changes in the contract without needing to read the entire state and paying gas
       emit MarketCreated(
           marketId,
           msg.sender,
           question,
           block.timestamp + duration
       );
       return marketId;
   }
   ```

   This function accepts a question and a duration for the market in seconds.
   It initializes a `Market` variable to store information about the market and emits a `MarketCreated` event to notify users that the new market is available.

1. Add these utility functions:

   ```solidity
   /**
    * Calculate pricePerShare without fees
    */
   function pricePerShareWithoutFees(
       uint256 marketId,
       bool isYes
   ) public view returns (uint256) {
       Market memory market = markets[marketId];
       uint256 totalShares = market.totalYesShares + market.totalNoShares;

       if (isYes) {
           return (market.totalYesShares * PRECISION) / totalShares;
       } else {
           return (market.totalNoShares * PRECISION) / totalShares;
       }
   }

   /**
    * Calculate how many shares you get for a bet amount
    * More money = more shares = bigger portion of winnings
    */
   function calculateShares(
       uint256 marketId,
       bool isYes,
       uint256 betAmount
   ) public view returns (uint256) {
       Market memory market = markets[marketId];
       require(market.active, "Market not active");

       // The share price is now calculated without fees
       uint256 pricePerShare = pricePerShareWithoutFees(marketId, isYes);
       uint256 shares = (betAmount * PRECISION) / pricePerShare;
       return shares;
   }
   ```

   These functions calculate the price per share and how many shares a user gets for a given bet amount.

1. Add this function to allow users to place bets:

   ```solidity
   // BETTING FUNCTIONS

   /**
    * @dev Place a bet on YES or NO
    * @param marketId The market to bet on
    * @param isYes true for a bet on YES, false for a bet on NO
    */
   function placeBet(
       uint256 marketId,
       bool isYes
   ) external payable nonReentrant {
       Market storage market = markets[marketId];
       uint256 betAmount = msg.value; // Use the value sent with the transaction as the bet amount
       market.marketBalance += msg.value;

       // Validation
       require(market.active, "Market not active");
       require(!market.resolved, "Market has been resolved");
       require(block.timestamp < market.endTime, "Betting period ended");
       require(betAmount > 0, "Must bet positive amount");

       uint256 shares = calculateShares(marketId, isYes, betAmount); // 100shares when amount = $51

       // Update market totals
       if (isYes) {
           market.totalYesAmount += betAmount; // Tracks the total amount bet on YES
           market.totalYesShares += shares; // Synthetic YES shares (virtual liquidity) + Real YES shares
           positions[marketId][msg.sender].yesAmount += betAmount; // Tracks user's YES bet amount
           positions[marketId][msg.sender].yesShares += shares; // Tracks user's YES shares
       } else {
           market.totalNoAmount += betAmount;
           market.totalNoShares += shares;
           positions[marketId][msg.sender].noAmount += betAmount;
           positions[marketId][msg.sender].noShares += shares;
       }

       // Track user participation
       if (
           positions[marketId][msg.sender].yesAmount +
               positions[marketId][msg.sender].noAmount ==
           betAmount
       ) {
           userMarkets[msg.sender].push(marketId);
       }

       emit BetPlaced(marketId, msg.sender, isYes, betAmount, shares);
   }
   ```

   Any user can call this function, which places a bet on an open market.
   The user passes the ID of the market and a Boolean value to bet on Yes or No.
   They must also include XTZ for their bet in the transaction.

   The function updates the market with the new bet, updates its records about the user's position, and emits an event to notify applications of the new bet.

1. Add this function to allow the administrator to mark a market as resolved:

   ```solidity
   // Only the owner can resolve markets
   function resolveMarket(uint256 marketId, uint8 winner) external onlyOwner {
       Market storage market = markets[marketId];

       require(!market.resolved, "Already resolved");
       require(winner <= 2, "Invalid winner");

       market.resolved = true;
       market.active = false;
       market.winner = winner;

       emit MarketResolved(marketId, winner, msg.sender);
   }
   ```

   This function has the `onlyOwner` modifier to ensure that only the contract administrator can call it.
   It marks the specified market as resolved, sets the winning value, and emits a `MarketResolved` event that tells winning betters that they can claim their rewards.

1. Add this function to allow winners to claim their share of the pot:

   ```solidity
   // CLAIMING WINNINGS

   /**
    * @dev Claim winnings from a resolved market
    * Winners split the total pool proportionally to their shares
    */
   function claimWinnings(uint256 marketId) external nonReentrant {
       Market storage market = markets[marketId]; //access storage so we can update
       Position storage position = positions[marketId][msg.sender];

       require(market.resolved, "Market not resolved");
       require(!position.claimed, "Already claimed");

       position.claimed = true;

       uint256 payout = 0;

       if (market.winner == 2) {
           // INVALID - refund original bets
           payout = position.yesAmount + position.noAmount;
       } else if (market.winner == 1 && position.yesShares > 0) {
           // YES wins - split the total pool among YES shareholders
           uint256 totalPool = market.totalYesAmount + market.totalNoAmount;
           uint256 winningSideShares = market.totalYesShares -
               VIRTUAL_LIQUIDITY; // Remove virtual liquidity

           if (winningSideShares > 0) {
               payout = (position.yesShares * totalPool) / winningSideShares;
           }
       } else if (market.winner == 0 && position.noShares > 0) {
           // NO wins - split the total pool among NO shareholders
           uint256 totalPool = market.totalYesAmount + market.totalNoAmount;
           uint256 winningSideShares = market.totalNoShares -
               VIRTUAL_LIQUIDITY; // Remove virtual liquidity

           if (winningSideShares > 0) {
               payout = (position.noShares * totalPool) / winningSideShares;
           }
       }

       if (payout > 0) {
           (bool success, ) = payable(msg.sender).call{value: payout}("");
           market.marketBalance -= payout;
           require(success, "XTZ transfer failed");
           emit WinningsClaimed(marketId, msg.sender, payout);
       }
   }
   ```

   This function retrieves a better's position for the given market, calculates that better's share of the winnings, and sends it to them.
   Each winning better needs to call this function to get their share.
   The function also emits a `WinningsClaimed` event to notify applications that the better has claimed their winnings.

1. Add these view functions to make it easier for off-chain applications to get information about betting markets:

   ```solidity
   //  VIEW FUNCTIONS

   function getUserPosition(
       uint256 marketId,
       address user
   ) external view returns (Position memory) {
       return positions[marketId][user];
   }

   function getUserMarkets(
       address user
   ) external view returns (uint256[] memory) {
       return userMarkets[user];
   }

   function getMarket(uint256 marketId) external view returns (Market memory) {
       return markets[marketId];
   }

   // Useful for the frontend to know the most recent probabilities for each outcome
   function getProbability(
       uint256 marketId,
       bool isYes
   ) external view returns (uint256) {
       uint256 price = pricePerShareWithoutFees(marketId, isYes);
       return (price * 100) / PRECISION; // get the percentage probability
   }
   ```

   Using functions like these to get information about an account's position and the current probabilities for a betting market is easier than reading the contract storage directly.

   You can see the completed contract at https://github.com/trilitech/tutorial-applications/blob/main/etherlink-prediction/backend/contracts/Contract.sol.

1. Set up an Etherlink account in a compatible wallet if you don't already have one.
For more information, see [Using your wallet](/get-started/using-your-wallet).

1. Create a file named `.env` in the same folder as the `hardhat.config.js` file and set your Etherlink account private key as the value of the `PRIVATE_KEY` environment variable:

   ```env
   PRIVATE_KEY=<ETHERLINK_PRIVATE_KEY>
   ```

1. Compile the contract:

   ```bash
   npx hardhat compile
   ```

   If you see any errors, compare your contract with the project at https://github.com/trilitech/tutorial-applications/tree/main/etherlink-prediction.

Hardhat compiles the contract into files in the `artifacts/contracts` folder.
Files in this folder include the compiled bytecode of the contract and the application binary interface (ABI) that describes the functions.
Applications use this ABI to know how to format calls to the contract.

## Testing the contract

Hardhat includes a testing framework that lets you test your contracts before deploying them.
Follow these steps to set up a simple test for the contract:

1. Run this command to install packages that Hardhat uses for testing contracts:

   ```bash
   npm add --save-dev @nomicfoundation/hardhat-viem-assertions @nomicfoundation/hardhat-node-test-runner
   ```

1. Add these plugins to the `hardhat.config.ts` file so it looks like this:

   ```javascript
   import dotenv from 'dotenv';
   dotenv.config();

   import hardhatViem from "@nomicfoundation/hardhat-viem";
   import hardhatViemAssertions from "@nomicfoundation/hardhat-viem-assertions";
   import hardhatNodeTestRunner from "@nomicfoundation/hardhat-node-test-runner";

   /** @type import('hardhat/config').HardhatUserConfig */
   module.exports = {
     plugins: [
       hardhatViem,
       hardhatViemAssertions,
       hardhatNodeTestRunner,
     ],
     solidity: "0.8.24",
     networks: {
       etherlinkShadownet: {
         type: 'http',
         url: "https://node.shadownet.etherlink.com",
         chainId: 127823,
         accounts: [process.env.PRIVATE_KEY],
       },
       etherlinkSandbox: {
         type: 'http',
         url: "http://localhost:8545",
         chainId: 127823,
         accounts: [process.env.PRIVATE_KEY],
       },
     },
   };
   ```

1. Create a file named `test/test.js` and put this code in it:

   ```javascript
   import { beforeEach, describe, it } from "node:test";
   import { network } from "hardhat";
   import { parseEther } from "viem";

   const { viem } = await network.connect();

   let contract;

   describe("Test creating and using markets", function () {

     // Initialize the contract before each test
     beforeEach(async () => {
       contract = await viem.deployContract("PredictxtzContract");
     });

     it("Should emit the MarketCreated event when a market is created", async function () {
       await viem.assertions.emit(
         contract.write.createMarket([
           "Will it rain tomorrow?",
           604800,
         ]),
         contract,
         "MarketCreated",
       );
     });

     it("Users should be able to bet on a market", async function () {
       const client = await viem.getPublicClient();
       const tx = await contract.write.createMarket([
         "Will it rain tomorrow?",
         604800,
       ]);
       await client.waitForTransactionReceipt({ hash: tx, confirmations: 1 });

       await viem.assertions.emit(
        contract.write.placeBet([
          1,
          true,
        ], {
          value: parseEther('1'),
        }),
        contract,
        "BetPlaced",
      );
     });
   });
   ```

   This test file deploys the contract and then tests it.
   It uses the `viem.assertions.emit` function to call the `createMarket` and `placeBet` functions and verify that the contract emits the `MarketCreated` and `BetPlaced` events, respectively.

1. Run this command to run the tests:

   ```bash
   npx hardhat test test/test.js
   ```

The results show that the test successfully deployed the contract, called it, and observed the expected events.
If your test fails, verify that it matches the code above and that your contract compiles.

If you want to continue working with hte test, you can test the other functions in a similar way.

Now the contract is compiled and tested and ready to be deployed to a test network.
Continue to [Part 2: Deploying the contract](/tutorials/predictionMarket/deploy-contract).

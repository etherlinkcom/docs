# Create a smart contract

Etherlink runs contracts like the Solidity language.
For more information about Solidity, see https://docs.soliditylang.org.

Follow these steps to set up a Solidity smart contract:

1. Remove the default Solidity smart contract `Lock.sol` in the `./contracts` folder.

1. Create a new file named `Marketpulse.sol` in the `./contracts` folder.

   ```bash
   touch ./contracts/Marketpulse.sol
   ```

1. Put this code in the file:

   ```Solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.24;

   // Use console.log for Hardhat debugging
   import "hardhat/console.sol";

   import "@openzeppelin/contracts/utils/math/Math.sol";

   /**
    * @title Marketpulse
   * @author Benjamin Fuentes
   */
   contract Marketpulse {
       using Math for uint256;

       struct Bet {
           uint256 id;
           address payable owner;
           string option;
           uint256 amount; //wei
       }

       enum BET_RESULT {
           WIN,
           DRAW,
           PENDING
       }

       uint256 public constant ODD_DECIMALS = 10;
       uint256 public constant FEES = 10; // as PERCENTAGE unit (%)

       /** SLOTS */
       address payable public admin; 
       mapping(uint256 => Bet) public bets; 
       uint256[] public betKeys; 
       BET_RESULT public status = BET_RESULT.PENDING; 
       string public winner; 

       event Pong();

       constructor() payable {
           admin = payable(msg.sender);
       }

       /**
        * Getter /setter
       */
       function getBetKeys() public view returns (uint256[] memory) {
           return betKeys;
       }

       function getBets(uint256 betId) public view returns (Bet memory bet) {
           return bets[betId];
       }

       /** Utility
        *
       * */

       function addressToString(
           address _addr
       ) public pure returns (string memory) {
           bytes memory alphabet = "0123456789abcdef";
           bytes20 value = bytes20(_addr);
           bytes memory str = new bytes(42);

           str[0] = "0";
           str[1] = "x";

           for (uint i = 0; i < 20; i++) {
               str[2 + i * 2] = alphabet[uint(uint8(value[i] >> 4))];
               str[3 + i * 2] = alphabet[uint(uint8(value[i] & 0x0f))];
           }

           return string(str);
       }

       /**
        * Simple Ping
       */
       function ping() public{
           console.log("Ping");
           emit Pong();
       }

       function generateBetId() private view returns (uint256) {
           console.log("Calling generateBetId");
           return
               uint256(
                   keccak256(
                       abi.encodePacked(
                           block.timestamp,
                           block.prevrandao,
                           msg.sender
                       )
                   )
               );
       }

       /**
        * place bets and returns the betId
       */
       function bet(
           string calldata selection,
           uint256 odds
       ) public payable returns (uint256) {
           require(msg.value > 0, "Bet amount must be positive.");
           require(
               msg.value <= msg.sender.balance,
               "Insufficient balance to place this bet."
           );

           uint256 betId = generateBetId();

           bets[betId] = Bet({
               id: betId,
               option: selection,
               amount: msg.value,
               owner: payable(msg.sender)
           });
           betKeys.push(betId);

           console.log("Bet %d placed", betId);

           console.log(
               "Bet placed: %d on %s at odds of %d",
               msg.value,
               selection,
               odds
           );
           return betId;
       }

       /**
        *
       * @param option selected option
       * @param betAmount (Optional : default is 0) if user want to know the output gain after putting some money on it. Otherwise it gives actual gain without betting and influencing odds calculation
       * @return odds (in ODDS_DECIMAL unit)
       */
       function calculateOdds(
           string memory option,
           uint256 betAmount //wei
       ) public view returns (uint256) {
           console.log(
               "calculateOdds for option %s and bet amount is %d",
               option,
               betAmount
           );

           uint256 totalLoserAmount = 0; //wei
           for (uint i = 0; i < betKeys.length; i++) {
               Bet memory bet = bets[betKeys[i]];

               if (keccak256(bytes(bet.option)) != keccak256(bytes(option))) {
                   (bool success, uint256 result) = totalLoserAmount.tryAdd(
                       bet.amount
                   );
                   require(success, "Cannot add totalLoserAmount and bet.amount");
                   totalLoserAmount = result;
               }
           }
           console.log("totalLoserAmount : %d", totalLoserAmount);

           uint256 totalWinnerAmount = betAmount; //wei
           for (uint i = 0; i < betKeys.length; i++) {
               Bet memory bet = bets[betKeys[i]];

               if (keccak256(bytes(bet.option)) == keccak256(bytes(option))) {
                   (bool success, uint256 result) = totalWinnerAmount.tryAdd(
                       bet.amount
                   );
                   require(success, "Cannot add totalWinnerAmount and bet.amount");
                   totalWinnerAmount = result;
               }
           }
           console.log("totalWinnerAmount  : %d", totalWinnerAmount);
           uint256 part = Math.mulDiv(
               totalLoserAmount,
               10 ** ODD_DECIMALS,
               totalWinnerAmount
           );

           console.log("part per ODD_DECIMAL : %d", part);

           (bool success1, uint256 oddwithoutFees) = part.tryAdd(
               10 ** ODD_DECIMALS
           );
           require(success1, "Cannot add part and 1");

           console.log("oddwithoutFees  : %d", oddwithoutFees);

           (bool success2, uint256 odd) = oddwithoutFees.trySub(
               (FEES * 10 ** ODD_DECIMALS) / 100
           );
           require(success2, "Cannot remove fees from odd");

           console.log("odd  : %d", odd);

           return odd;
       }

       function resolveResult(
           string memory optionResult,
           BET_RESULT result
       ) public {
           require(
               msg.sender == admin,
               string.concat(
                   "Only the admin ",
                   addressToString(admin),
                   " can give the result."
               )
           );

           require(
               status == BET_RESULT.PENDING,
               string(
                   abi.encodePacked(
                       "Result is already given and bets are resolved : ",
                       status
                   )
               )
           );

           require(
               result == BET_RESULT.WIN || result == BET_RESULT.DRAW,
               "Only give winners or draw, no other choices"
           );

           for (uint i = 0; i < betKeys.length; i++) {
               Bet memory bet = bets[betKeys[i]];
               if (
                   result == BET_RESULT.WIN &&
                   keccak256(bytes(bet.option)) == keccak256(bytes(optionResult))
               ) {
                   //WINNER!
                   uint256 earnings = Math.mulDiv(
                       bet.amount,
                       calculateOdds(bet.option, 0),
                       10 ** ODD_DECIMALS
                   );
                   console.log("earnings : %d for %s", earnings, bet.owner);
                   bet.owner.transfer(earnings);
                   winner = optionResult;
               } else if (result == BET_RESULT.DRAW) {
                   //GIVE BACK MONEY - FEES

                   uint256 feesAmount = Math.mulDiv(bet.amount, FEES, 100);

                   (bool success, uint256 moneyBack) = bet.amount.trySub(
                       feesAmount
                   );

                   require(success, "Cannot sub fees amount from amount");

                   console.log(
                       "give back money : %d for %s",
                       moneyBack,
                       bet.owner
                   );

                   bet.owner.transfer(moneyBack);
               } else {
                   //NEXT
                   console.log("bet lost for %s", bet.owner);
               }
           }

           status = result;
       }
   }
   ```

   This contract is a bet application where any user can place bets on a predefined poll by calling `bet`.
   Each bet includes an ID, the address of the submitter, an option that represents their choice, and the bet amount in wei.

   The ID is randomly generated to showcase on the next advanced tutorial how to use an indexer to list all the bets for local odd calculation and use an oracle for randomization.
   > Note : An optimized implementation would remove the bets themselves and keep only some aggregated variables, saving storage space and removing the need for an indexer.

   Users can place as many bets as they want.
   When you are ready to resolve the bets, you can call `resolveResult` and make the contract pay the correct bets.
   On the next advanced tutorial, an oracle is used to do this job instead of having to call the entrypoint manually.

   The contract calculates odds for the bet using safe math to avoid unexpected and dangerous behaviors.

1. Compile the smart contract:

   ```bash
   npx hardhat compile
   ```

   You can ignore any warnings in the console because they do not affect the application.

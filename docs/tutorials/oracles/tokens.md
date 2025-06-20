---
title: "Part 3: Using price data to buy and sell tokens"
---

Now that the smart contract has current data about prices, you can use that data to buy and sell tokens.
In this section, you expand the contract to simulate a decentralized exchange (DEX) that buys and sells tokens.
Specifically, you add a ledger of token owners to the contract to simulate a token, and `buy` and `sell` functions that allow users to buy and sell a token based on the current price of USD.

## Adding buy and sell functions

To simulate a token in a very simple way, the contract needs a ledger of token owners and functions to buy and sell that token.
Of course, this token is not compliant with any token standard, so it's not a good example of a token, but it's enough to simulate buying and selling for the purposes of the tutorial.

1. Near the top of the `src/TutorialContract.sol` file, next to the `pyth` and `xtzUsdPriceId` storage variables, add a map for the token owners:

   ```solidity
   mapping(address => uint256) balances;
   ```

   This map associates addresses of owners to the number of tokens they own.

1. After the other functions in the contract, add this function to simulate buying one token:

   ```solidity
   // Buy function: increments sender's balance by 1
   function buy(bytes[] calldata pythPriceUpdate) external payable {

     // Update price
     updatePrice(pythPriceUpdate);
     uint256 oneDollarInWei = getPrice();

     // Require 1 USD worth of XTZ
     if (msg.value >= oneDollarInWei) {
       balances[msg.sender] += 1;
     } else {
       revert InsufficientFee();
     }
   }
   ```

   This function accepts the price update data and passes it to the `updateAndGet` function that you created in the previous section.
   Then it verifies that the user sent the correct amount of XTZ based on the updated price data.
   If so, it increments the sender's balance by one token.

1. After the `buy` function, add this function to simulate selling one token:

   ```solidity
   // Sell function: decrements sender's balance by 1
   function sell(bytes[] calldata pythPriceUpdate) external {
     require(getBalance(msg.sender) > 0, "Insufficient balance to sell");
     updatePrice(pythPriceUpdate);
     uint256 oneDollarInWei = getPrice();

     // Send the user 1 USD worth of XTZ
     require(address(this).balance > oneDollarInWei, "Not enough XTZ to send");
     (bool sent, ) = msg.sender.call{value: oneDollarInWei}("");
     require(sent, "Failed to send XTZ");
     balances[msg.sender] -= 1;
   }
   ```

   This function updates the price in the same way that the other functions do.
   It decrements the sender's balance by one token and sends them one USD in XTZ.
   Of course, this contract isn't actually buying and selling tokens through a DEX, so when you deploy the contract, you will include enough sandbox XTZ for it to pay for these sell operations.

1. After the `sell` function, add this function to initialize a user's account with 5 simulated tokens:

   ```solidity
   // Initialize accounts with 5 tokens for the sake of the tutorial
   function initAccount(address user) external {
     require(balances[msg.sender] < 5, "You already have at least 5 tokens");
     balances[user] = 5;
   }
   ```

   This function simplifies the buy and sell process that you will set up later by giving the user 5 tokens for free to start.
   This function is also only for the tutorial and would not be in a real contract.

1. After the `initAccount` function, add this function to get an address's current balance of the simulated token:

   ```solidity
   function getBalance(address user) public view returns (uint256) {
     return balances[user];
   }
   ```

1. After the functions, add this declaration of the error that the contract throws if the user does not send enough XTZ:

   ```solidity
   // Error raised if the payment is not sufficient
   error InsufficientFee();
   ```

The complete contract looks like this:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract TutorialContract {
  IPyth pyth;
  bytes32 xtzUsdPriceId;
  mapping(address => uint256) balances;

  constructor(address _pyth, bytes32 _xtzUsdPriceId) {
    pyth = IPyth(_pyth);
    xtzUsdPriceId = _xtzUsdPriceId;
  }

  // Update the price
  function updatePrice(bytes[] calldata pythPriceUpdate) public {
    uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
    pyth.updatePriceFeeds{ value: updateFee }(pythPriceUpdate);
  }

  // Get 1 USD in wei
  function getPrice() public view returns (uint256) {
    PythStructs.Price memory price = pyth.getPriceNoOlderThan(
      xtzUsdPriceId,
      60
    );
    uint xtzPrice18Decimals = (uint(uint64(price.price)) * (10 ** 18)) /
      (10 ** uint8(uint32(-1 * price.expo)));
    uint oneDollarInWei = ((10 ** 18) * (10 ** 18)) / xtzPrice18Decimals;
    return oneDollarInWei;
  }

  // Update and get the price in a single step
  function updateAndGet(bytes[] calldata pythPriceUpdate) external payable returns (uint256) {
    updatePrice((pythPriceUpdate));
    return getPrice();
  }

  // Buy function: increments sender's balance by 1
  function buy(bytes[] calldata pythPriceUpdate) external payable {

    // Update price
    updatePrice(pythPriceUpdate);
    uint256 oneDollarInWei = getPrice();

    // Require 1 USD worth of XTZ
    if (msg.value >= oneDollarInWei) {
      balances[msg.sender] += 1;
    } else {
      revert InsufficientFee();
    }
  }

  // Sell function: decrements sender's balance by 1
  function sell(bytes[] calldata pythPriceUpdate) external {
    require(getBalance(msg.sender) > 0, "Insufficient balance to sell");
    updatePrice(pythPriceUpdate);
    uint256 oneDollarInWei = getPrice();

    // Send the user 1 USD worth of XTZ
    require(address(this).balance > oneDollarInWei, "Not enough XTZ to send");
    (bool sent, ) = msg.sender.call{value: oneDollarInWei}("");
    require(sent, "Failed to send XTZ");
    balances[msg.sender] -= 1;
  }

  // Initialize accounts with 5 tokens for the sake of the tutorial
  function initAccount(address user) external {
    require(balances[msg.sender] < 5, "You already have at least 5 tokens");
    balances[user] = 5;
  }

  function getBalance(address user) public view returns (uint256) {
    return balances[user];
  }

  // Error raised if the payment is not sufficient
  error InsufficientFee();
}
```

Of course, you could customize these `buy` and `sell` functions to allow users to buy and sell more than one token at a time, but this is enough to demonstrate that the contract pins the price of tokens to one USD in XTZ.

## Testing the buy and sell functions

You could test these new functions in many ways, but in these steps you add a simple test and run it to be sure that the new functions work.

1. Add this test function after the other functions in the file `test/TutorialContract.t.sol`:

   ```solidity
   // Test a full buy/sell scenario
   function testContract() public {
     bytes[] memory updateData = createXtzUpdate(10);

     // Set up a test user
     address testUser = address(0x5E11E1);
     vm.deal(testUser, XTZ_TO_WEI);
     vm.startPrank(testUser);

     // Test buying and selling
     myContract.initAccount(testUser);
     myContract.buy{ value: XTZ_TO_WEI / 10 }(updateData);
     myContract.buy{ value: XTZ_TO_WEI / 10 }(updateData);
     assertEq(7, myContract.getBalance(testUser));
     myContract.sell(updateData);
     assertEq(6, myContract.getBalance(testUser));
   }
   ```

1. Compile and test the contract by running this command:

   ```bash
   forge test
   ```

   If you see any test failures, make sure your contract and test match the code above.

1. Deploy the new contract to the sandbox by following these steps:

   1. Make sure that these environment variables are set:

   - `ADDRESS`: The address of the account that you created with the `cast wallet new` command and funded in the Etherlink sandbox
   - `PRIVATE_KEY`: The private key of the account
   - `RPC_URL`: The address of the sandbox node, by default `http://localhost:8545`
   - `XTZ_USD_ID`: the Pyth ID of the XTZ/USD exchange rate: `0x0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03`
   - `PYTH_OP_ETHERLINK_TESTNET_ADDRESS`: `0x2880aB155794e7179c9eE2e38200202908C17B43` for Etherlink Testnet

   1. Using these environment variables, deploy the contract to the local sandbox by running this command:

      ```bash
      forge create src/TutorialContract.sol:TutorialContract \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        --broadcast \
        --constructor-args $PYTH_OP_ETHERLINK_TESTNET_ADDRESS $XTZ_USD_ID \
        --value 100ether
      ```

      Like the `cast send` command that you used to send XTZ in the previous section, this command includes a `--value` argument to fund the contract with some XTZ so it can pay when a user sells the simulated token.

1. Set the `DEPLOYMENT_ADDRESS` environment variable to the address of the deployed contract.

1. (Optional) As you did in the previous section, call the contract from the command line by getting the price data from Hermes:

  1. Get the price update data from Hermes by running this command:

      ```bash
      curl -s "https://hermes.pyth.network/v2/updates/price/latest?&ids[]=$XTZ_USD_ID" | jq -r ".binary.data[0]" > price_update.txt
      ```

   1. Send the price update data by running this command:

      ```bash
      cast send \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        -j 1 \
        --value 0.0005ether \
        $DEPLOYMENT_ADDRESS \
        "updateAndGet(bytes[])" \
        "[0x`cat price_update.txt`]"
      ```

   1. Retrieve the price from the contract by running this command:

      ```bash
      cast call \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        -j 1 \
        $DEPLOYMENT_ADDRESS \
        "getPrice()"
      ```

   1. Convert the hex number in the response to an amount of XTZ.
   For example, you can paste the hex number that you get in response to a hex to decimal converter such as https://www.rapidtables.com/convert/number/hex-to-decimal.html.

      For example, if the response is `0x0000000000000000000000000000000000000000000000001950f85eb8a92984`, it corresponds to 1824230934793759108 wei, or about 1.82 XTZ.
      You can use a converter such as https://eth-converter.com/ to convert wei to the primary token.

   1. Send that amount of XTZ to the contract's `buy` function, as in this example, which rounds up to 1.85 XTZ for safety:

      ```bash
      cast send \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        -j 1 \
        --value 1.85ether \
        $DEPLOYMENT_ADDRESS \
        "buy(bytes[])" \
        "[0x`cat price_update.txt`]"
      ```

    1. If the previous command succeeded, check your balance of tokens by calling the `getBalance` function:

       ```bash
       cast call \
         --private-key $PRIVATE_KEY \
         --rpc-url $RPC_URL \
         -j 1 \
         $DEPLOYMENT_ADDRESS \
         "getBalance(address)" \
         "$ADDRESS"
       ```

       This command should return `0x0000000000000000000000000000000000000000000000000000000000000001`, representing the one simulated token that you bought.

       If you can't run all of the commands before the price goes stale, don't worry, because in the next section you write a program to automate the process.

Now you know that the contract can get price data from the Pyth oracle and use that data to make pricing decisions.
From here, you can expand the contract to handle multiple currencies or do other things with the price data.
Continue to [Part 4: Automating pricing decisions](/tutorials/oracles/application).

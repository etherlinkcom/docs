---
title: "Part 2: Getting information from the Pyth oracle"
---

Getting price information from the Pyth oracle takes a few steps:

1. The off-chain caller gets price update data from Hermes, Pyth's service that listens for price updates and provides them to off-chain applications via a REST API.
This data contains the information that Pyth needs to provide a current price to on-chain applications.

1. The off-chain caller sends that update data to the smart contract.

1. Based on the update data, smart contract calculates the fee that Pyth charges to provide that price data to smart contracts.

1. The smart contract calls Pyth's on-chain application and pays the fee.

1. The Pyth on-chain application gets the price data from Hermes and provides it to the smart contract.

1. The smart contract stores the updated price data.

## Getting oracle data in a contract

Follow these steps to create a contract that uses the Pyth oracle in the way described above:

1. Create a directory to store your work in:

   ```bash
   mkdir -p etherlink_defi/contracts
   cd etherlink_defi/contracts
   ```

   Later you will create a folder named `etherlink_defi/app` to store the off-chain portion of the tutorial application.

1. Create an empty Foundry project in the `etherlink_defi/contracts` folder:

   ```bash
   forge init
   ```

   This command creates starter contracts and tests.

1. Remove the starter contracts and tests by running this command:

   ```bash
   rm -r src/* test/* script/*
   ```

1. Set up a Node.JS project and install the Pyth SDK by running these commands:

   ```bash
   npm init -y
   npm install @pythnetwork/pyth-sdk-solidity
   ```

1. Run this command to create mappings that tell Foundry where to find the SDK so you can import it from Solidity contracts:

   ```bash
   echo '@pythnetwork/pyth-sdk-solidity/=node_modules/@pythnetwork/pyth-sdk-solidity' > remappings.txt
   ```

1. Create a file named `src/TutorialContract.sol` and open it in any text editor.

1. Paste this stub of a Solidity smart contract into the file:

   ```solidity
   // SPDX-License-Identifier: UNLICENSED
   pragma solidity ^0.8.13;

   import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

   contract TutorialContract {
     IPyth pyth;
     bytes32 xtzUsdPriceId;

     constructor(address _pyth, bytes32 _xtzUsdPriceId) {
       pyth = IPyth(_pyth);
       xtzUsdPriceId = _xtzUsdPriceId;
     }

     // Functions go here

   }
   ```

   The contract stores two variables: an object that represents the Pyth on-chain application and an identifier that represents the exchange rate that the contract is interested in.
   In this case, the contract is interested in the exchange rate between Tezos/Etherlink XTZ and USD.

   This stub includes only the contract constructor; you add functions in the next few steps.

1. Replace the `// Functions go here` comment with this function:

   ```solidity
   // Update the price
   function updatePrice(bytes[] calldata pythPriceUpdate) public {
     uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
     pyth.updatePriceFeeds{ value: updateFee }(pythPriceUpdate);
   }
   ```

   This function receives price update data that an off-chain caller got from Hermes.
   It uses this data and the Pyth on-chain application to get the cost of the on-chain price update.
   Finally, it passes the fee and the price data to Pyth.

   If this function succeeds, the `pyth` variable in the contract is updated with current price data, which other functions in the smart contract can access, as in the next function that you will add.

1. After the `updatePrice` function, add this function:

   ```solidity
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
   ```

   This function uses the Pyth data in the `pyth` variable to return the amount of wei currently equal to 1 USD.
   It uses the `pyth.getPriceNoOlderThan` function, which fails if the data is stale, in this case older than 60 seconds.
   Later in this section you add tests to verify that this function is accurate.

1. After the `getPrice` function, add this function:

   ```solidity
   // Update and get the price in a single step
   function updateAndGet(bytes[] calldata pythPriceUpdate) external payable returns (uint256) {
     updatePrice((pythPriceUpdate));
     return getPrice();
   }
   ```

   Because the price goes stale, it's convenient to update the price and retrieve it in a single step.
   This function merely calls the two pervious functions in order.

1. Make sure that your contract compiles by running this command:

   ```bash
   forge build
   ```

If you see any errors, make sure that the contract matches this code:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract TutorialContract {
  IPyth pyth;
  bytes32 xtzUsdPriceId;

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
}
```

## Testing the data

To test the contract and how it gets data from Pyth, you can write Foundry tests that use a mocked version of Pyth.
In these steps, you set the exchange rate in the mocked version of Pyth and use tests to verify that the contract gets that exchange rate correctly:

1. Create a test file named `test/TutorialContract.t.sol` and open it in any text editor.

1. Put this test stub code in the file:

   ```solidity
   // SPDX-License-Identifier: UNLICENSED
   pragma solidity ^0.8.13;

   import { Test, console2 } from "forge-std/Test.sol";
   import { TutorialContract } from "../src/TutorialContract.sol";
   import { MockPyth } from "@pythnetwork/pyth-sdk-solidity/MockPyth.sol";

   contract ContractToTest is Test {
     MockPyth public pyth;
     bytes32 XTZ_PRICE_FEED_ID = bytes32(uint256(0x1));
     TutorialContract public myContract;

     uint256 XTZ_TO_WEI = 10 ** 18;

     function setUp() public {
       pyth = new MockPyth(60, 1);
       myContract = new TutorialContract(address(pyth), XTZ_PRICE_FEED_ID);
     }

     // Test functions go here

   }
   ```

   This stub imports your contract and creates an instance of it in the`setUp` function, which runs automatically before each test.
   It creates a mocked version of Pyth for the purposes of the test.

1. Replace the `// Test functions go here` comment with this utility function:

   ```solidity
   // Utility function to create a mocked Pyth price update for the test
   function createXtzUpdate(
     int64 xtzPrice
   ) private view returns (bytes[] memory) {
     bytes[] memory updateData = new bytes[](1);
     updateData[0] = pyth.createPriceFeedUpdateData(
       XTZ_PRICE_FEED_ID,
       xtzPrice * 100000, // price
       10 * 100000, // confidence
       -5, // exponent
       xtzPrice * 100000, // emaPrice
       10 * 100000, // emaConfidence
       uint64(block.timestamp), // publishTime
       uint64(block.timestamp) // prevPublishTime
     );

     return updateData;
   }
   ```

   This function accepts a price as an integer (such as 10 to mean that 10 XTZ equals 1 USD) and creates mocked Hermes data for a price update.

1. After the `createXtzUpdate` function, add this utility function:

   ```solidity
   // Utility function to set the Pyth price
   function setXtzPrice(int64 xtzPrice) private {
     bytes[] memory updateData = createXtzUpdate(xtzPrice);
     uint updateFee = pyth.getUpdateFee(updateData);
     vm.deal(address(this), updateFee);
     pyth.updatePriceFeeds{ value: updateFee }(updateData);
   }
   ```

   This function calls the `createXtzUpdate` function to create the mocked Hermes data.
   Then it gets the amount of the fee from the mocked instance of Pyth and sends this fee and the data to Pyth.

   These utility functions mirror the functions in the contract, but they are to operate the mocked instance of Pyth.
   These functions allow the test to set the current price in the Pyth on-chain application itself, which the contract accesses.
   The next functions that you create use an instance of your contract in the test and verify that it gets the data from Pyth correctly.

1. After the `setXtzPrice` function, add this test function:

   ```solidity
   // Set the price that 5 XTZ = 1 USD and verify
   function testUpdateAndGet() public {
     // Set price in mocked version of Pyth
     int64 xtzPrice = 5;
     setXtzPrice(xtzPrice);

     // Call the updateAndGet function and send enough for the Pyth fee
     bytes[] memory updateData = createXtzUpdate(xtzPrice);
     uint updateFee = pyth.getUpdateFee(updateData);
     vm.deal(address(this), updateFee);

     // Verify that the contract has the same exchange rate for XTZ/USD
     uint256 priceWei = myContract.updateAndGet{ value: updateFee }(updateData);
     assertEq(priceWei, XTZ_TO_WEI / 5);
   }
   ```

   This function uses the utility functions to set the current exchange rate of 5 XTZ to 1 USD.
   Then it calls the contract's `updateAndGet` function.
   Finally, the test verifies that the response from that function matches the price that it set in Pyth.

   This is a simple test, but it verifies that the contract can get accurate information from Pyth and return it in a useful manner to callers.

1. After the `testUpdateAndGet` function, add this test function:

   ```solidity
   // Test that the transaction fails with stale data
   function testStaleData() public {
     int64 xtzPrice = 10;
     setXtzPrice(xtzPrice);
     bytes[] memory updateData = createXtzUpdate(xtzPrice);
     uint updateFee = pyth.getUpdateFee(updateData);
     vm.deal(address(this), updateFee);

     // Wait until the data is stale
     skip(120);

     // Expect the update to fail with stale data
     vm.expectRevert();
     myContract.getPrice();
   }
   ```

   Of course, it's important to test failure cases, so this test does the same thing as the previous test but waits 2 minutes so the data goes stale.
   The command `vm.expectRevert();` assumes that the following call to the contract's `getPrice` function will fail.
   This way, if the contract allows the test to request stale data, the test fails.

1. Run this command to run the test:

   ```bash
   forge test
   ```

   The result from the tests should show that it ran the test functions successfully, as in this example:

   ```
   Ran 2 tests for test/TutorialContract.t.sol:ContractToTest
   [PASS] testStaleData() (gas: 175874)
   [PASS] testUpdateAndGet() (gas: 203736)
   Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 2.07ms (655.13µs CPU time)

   Ran 1 test suite in 146.43ms (2.07ms CPU time): 2 tests passed, 0 failed, 0 skipped (2 total tests)
   ```

If your tests have errors, make sure that the test matches the following code and that the paths in the test (such as the path to your contract) are correct:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console2 } from "forge-std/Test.sol";
import { TutorialContract } from "../src/TutorialContract.sol";
import { MockPyth } from "@pythnetwork/pyth-sdk-solidity/MockPyth.sol";

contract ContractToTest is Test {
   MockPyth public pyth;
   bytes32 XTZ_PRICE_FEED_ID = bytes32(uint256(0x1));
   TutorialContract public myContract;

   uint256 XTZ_TO_WEI = 10 ** 18;

   function setUp() public {
      pyth = new MockPyth(60, 1);
      myContract = new TutorialContract(address(pyth), XTZ_PRICE_FEED_ID);
   }

   // Utility function to create a mocked Pyth price update for the test
   function createXtzUpdate(
      int64 xtzPrice
   ) private view returns (bytes[] memory) {
      bytes[] memory updateData = new bytes[](1);
      updateData[0] = pyth.createPriceFeedUpdateData(
      XTZ_PRICE_FEED_ID,
      xtzPrice * 100000, // price
      10 * 100000, // confidence
      -5, // exponent
      xtzPrice * 100000, // emaPrice
      10 * 100000, // emaConfidence
      uint64(block.timestamp), // publishTime
      uint64(block.timestamp) // prevPublishTime
      );

      return updateData;
   }

   // Utility function to set the Pyth price
   function setXtzPrice(int64 xtzPrice) private {
      bytes[] memory updateData = createXtzUpdate(xtzPrice);
      uint updateFee = pyth.getUpdateFee(updateData);
      vm.deal(address(this), updateFee);
      pyth.updatePriceFeeds{ value: updateFee }(updateData);
   }

   // Set the price that 5 XTZ = 1 USD and verify
   function testUpdateAndGet() public {
      // Set price
      int64 xtzPrice = 5;
      setXtzPrice(xtzPrice);

      // Call the updateAndGet function and send enough for the Pyth fee
      bytes[] memory updateData = createXtzUpdate(xtzPrice);
      uint updateFee = pyth.getUpdateFee(updateData);
      vm.deal(address(this), updateFee);

      // Verify that the contract has the same exchange rate for XTZ/USD
      uint256 priceWei = myContract.updateAndGet{ value: updateFee }(updateData);
      assertEq(priceWei, XTZ_TO_WEI / 5);
   }

   // Test that the transaction fails with stale data
   function testStaleData() public {
      int64 xtzPrice = 10;
      setXtzPrice(xtzPrice);
      bytes[] memory updateData = createXtzUpdate(xtzPrice);
      uint updateFee = pyth.getUpdateFee(updateData);
      vm.deal(address(this), updateFee);

      // Wait until the data is stale
      skip(120);

      // Expect the update to fail with stale data
      vm.expectRevert();
      myContract.getPrice();
   }
}
```

Now you know that the contract works and you can try deploying it to the Etherlink sandbox.

## Deploying to Etherlink

Foundry has built-in commands to deploy and call smart contracts, so in this section you use Foundry to deploy your contract and call it from the command line.

1. Ensure that your EVM node is still running as described in [Part 1: Setting up a development environment](/tutorials/oracles/environment).

1. Make sure that the contract is compiled by running this command:

   ```bash
   forge build
   ```

   The `forge test` command automatically compiles the contract, but before deploying you should be sure that you have compiled the current source code.

1. Make sure that these environment variables are set:

   - `ADDRESS`: The address of the account that you created with the `cast wallet new` command and funded in the Etherlink sandbox
   - `PRIVATE_KEY`: The private key of the account
   - `RPC_URL`: The address of the sandbox node, by default `http://localhost:8545`

1. Set the `XTZ_USD_ID` environment variable to the Pyth ID of the XTZ/USD exchange rate.
These price feeds are listed at https://www.pyth.network/developers/price-feed-ids, where you can see that the price feed ID for XTZ/USD is:

   ```
   0x0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03
   ```

1. Set the `PYTH_OP_ETHERLINK_TESTNET_ADDRESS` environment variable to the address of the Pyth on-chain application on Etherlink Testnet.
The addresses of Pyth applications are listed at https://docs.pyth.network/price-feeds/contract-addresses/evm, where you can see that the Pyth application is deployed on both Etherlink Testnet and Etherlink Mainnet at this address:

   ```
   0x2880aB155794e7179c9eE2e38200202908C17B43
   ```

1. Using these environment variables, deploy the contract to the local sandbox by running this command:

   ```bash
   forge create src/TutorialContract.sol:TutorialContract \
     --private-key $PRIVATE_KEY \
     --rpc-url $RPC_URL \
     --broadcast \
     --constructor-args $PYTH_OP_ETHERLINK_TESTNET_ADDRESS $XTZ_USD_ID
   ```

   This Foundry command deploys the contract and returns the address of the deployed contract and the hash of the deployment transaction.
   If you get errors, verify that the path to the contract and name of the contract are correct.
   Also check that the environment variables are set to the correct values.

1. Set the `DEPLOYMENT_ADDRESS` environment variable to the address of the deployed contract.

1. Call the contract by getting update data from Hermes, sending it and the update fee to the `updateAndGet` function, and then calling the `getPrice` function, as described in the next steps.

   Because the price data goes stale after 60 seconds, you need to run these commands within 60 seconds.
   You can put them in a single shell script to run at once or you can copy and paste them quickly.

   1. Get the price update data from Hermes by running this command:

      ```bash
      curl -s "https://hermes.pyth.network/v2/updates/price/latest?&ids[]=$XTZ_USD_ID" | jq -r ".binary.data[0]" > price_update.txt
      ```

   1. Send the price update data and some XTZ for the update fees by running this command:

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

      This command includes a small amount of XTZ to pay the fee.
      The command refers to it as `ether` but really it means the native token of the chain, in this case Etherlink XTZ.

      The response to the command includes information about the transaction but not the price data.

   1. Retrieve the price from the contract by running this command:

      ```bash
      cast call \
        --private-key $PRIVATE_KEY \
        --rpc-url $RPC_URL \
        -j 1 \
        $DEPLOYMENT_ADDRESS \
        "getPrice()"
      ```

      This command calls the read-only function `getPrice` and returns the current data in the `pyth` object in the contract.
      It returns the amount of XTZ that equal one USD.

      For example, assume that the response is `0x0000000000000000000000000000000000000000000000001950f85eb8a92984`.
      This hex number corresponds to 1824230934793759108 wei, or about 1.82 XTZ.
      This means that 1.82 XTZ equals 1 USD, so one XTZ is equal to 1 / 1.82 USD, or about 0.55 USD.
      You can paste the hex number that you get in response to a hex to decimal converter such as https://www.rapidtables.com/convert/number/hex-to-decimal.html.

If the commands failed, verify that the `curl` command to get the Hermes data succeeds; it should write a long string of hex code to the file `price_update.txt`.
Also make sure that the environment variables are correct and that you are copying and pasting the commands into your terminal correctly.

Now you have a smart contract that can get up-to-date price information from Pyth.
In the next section, you expand the smart contract to buy and sell based on that information.
Continue to [Part 3: Using price data to buy and sell tokens](/tutorials/oracles/tokens).

---
title: Indexing Etherlink contracts with TheGraph
sidebar_label: Indexing Etherlink contracts
---

[TheGraph](https://thegraph.com/) indexes smart contracts and provides information about them in a GraphQL interface.
You provide your contract address and interface and TheGraph provides historical information about how it has been called based on the events it emits.

## Indexing Etherlink contracts

Follow these steps to set up a subgraph in TheGraph to provide information about a smart contract:

1. Deploy the contract to Etherlink as you would deploy any other smart contract to an EVM-compatible chain.

   You can use any EVM client including the [Geth](https://geth.ethereum.org/) toolkit and the [Remix](https://remix.ethereum.org/) online IDE.
   For a walkthrough, see [How to take part in Etherlink](https://medium.com/etherlink/how-to-take-part-in-etherlink-8c8d00b0ca3e).

1. Optional: Verify the source code on the Etherlink block explorer:

   1. Find the deployed contract on https://explorer.etherlink.com/ or https://testnet.explorer.etherlink.com/.

   1. On the **Contract** tab, click **Verify & publish**.

   1. In the **New smart contract verification** window, select the license and verification method.
   In most cases, use the **Solidity (Flattened source code)** verification method.

   1. Under "Contract verification via Solidity (flattened source code)", in the **Compiler** field, select the same compiler version that you used to compile the contract.

   1. In the **EVM version** field, select the same EVM version that you used to compile the contract.

   1. If your compiler optimized the contract source code, select the **Optimization enabled** check box.
   This setting must match your compiler's setting.

   1. Paste the source code of the contract in the **Contract code** field.

      The page looks like this:

      ![Verifying the source code](/img/verify-source.png)

   1. Click **Verify & publish**.

   Now the block explorer shows the source code and ABI of the contract on the **Contract** tab.

1. If you did not verify the source code on the Etherlink block explorer, get the Application Binary Interface (ABI) for the contract and store it in a file.

   The ABI is a JSON object that describes the contract interface.
   Solidity compilers provide the ABI for contracts, so you can get the ABI from your compiler.
   For example, if you are using the command-line solidity compiler, you can get the ABI from a contract's source code with this command:

   ```bash
   solc --abi MyContract.sol -o build
   ```

1. Get your deployed contract's address.

1. In [Subgraph Studio](https://thegraph.com/studio/), connect your wallet.

1. Click **Create a Subgraph** and give the subgraph a name and any other information that you want to provide about it.

1. In a terminal window on your computer, run the commands on the right-hand side of the page to initialize the subgraph with information about the contract.
These instructions include:

   1. Install the TheGraph tools locally:

      ```bash
      npm install -g @graphprotocol/graph-cli
      ```

   1. Initialize the tools with the slug of your subgraph.
   For example, if your subgraph's display name is "My Subgraph," its default slug is `my-subgraph` and the command looks like this:

      ```bash
      graph init --studio my-subgraph
      ```

      Provide this information to the interactive command:

         - **Protocol**: `ethereum`
         - **Subgraph slug**: The slug for the subgraph
         - **Ethereum network**: Etherlink Mainnet or Etherlink Testnet, depending on which network your contract is deployed to
         - **Contract address**: The address of the deployed contract

      The command attempts to retrieve the ABI from the Etherlink block explorer, but it will fail if the contract source is not verified there.
      In this case, you must provide the path to the file with the ABI.
      <!-- Index contract events and entities (Y/n)?-->

   1. Authenticate to TheGraph with the key listed on the right-hand side of the page, as in this example:

      ```bash
      graph auth --studio abcde12345
      ```

   1. Go into the default folder created by the tools:

      ```bash
      cd my-subgraph
      ```

   1. Generate the types for the subgraph and build the subgraph:

      ```bash
      graph codegen && graph build
      ```

   1. Deploy the subgraph to Subgraph Studio:

      ```bash
      graph deploy --studio my-subgraph
      ```

Now you should be able to see information about your contract in the subgraph at `https://thegraph.com/studio/subgraph/my-subgraph/`, where `my-subgraph` is the slug for your subgraph.

## Getting information about an indexed smart contract

When you have set up a subgraph for your contract, you can query it via a GraphQL interface.
[Subgraph Studio](https://thegraph.com/studio/) provides an interface for sending queries, but you can use any GraphQL client.

For example, assume that this contract is published to Etherlink and indexed with a subgraph named `my-subgraph`:

```solidity
// SPDX License-Identifier: GPL 3.0

pragma solidity ^0.8.0;

contract Storage {

  uint256 value = 5;
  event setCalled(uint256 eventNumber);

  function set(uint256 number) public{
    value = number;
    emit setCalled(number);
  }

  function retrieve() public view returns (uint256){
    return value;
  }
}
```

The subgraph indexes the `setCalled` event into the GraphQL fields `setCalled` for information about individual times that the contract emitted the event and `setCalleds` for information about all of the times that that the contract emitted the event.

For example, this command gets information about the 2 most recent times this event has fired:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ setCalleds(first: 2) { id eventNumber blockNumber blockTimestamp } }", "operationName": "Subgraphs", "variables": {}}' \
  https://api.studio.thegraph.com/query/84791/my-contract/version/latest
```

The response includes the fields from the query, including the ID of the event:

```json
{
  "data": {
    "setCalleds": [
      {
        "id": "0xc83d4d0664533754c367ce3e7e1ee460ac3a945df617857f2c6299b9a0eec16a00000000",
        "eventNumber": "130",
        "blockNumber": "4258416",
        "blockTimestamp": "1722021523"
      },
      {
        "id": "0xcc263d947f449674f871ad6359ddc683d57b75f44a55daf6f5e8726d4b04d36200000000",
        "eventNumber": "12",
        "blockNumber": "4258409",
        "blockTimestamp": "1722021504"
      }
    ]
  }
}
```

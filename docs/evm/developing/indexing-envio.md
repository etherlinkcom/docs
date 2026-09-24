---
title: Indexing Etherlink EVM contracts with Envio # tevm
sidebar_label: Indexing contracts with Envio
---

[Envio](https://envio.dev/) HyperIndex is an indexing framework that turns smart contract events into a GraphQL API.
You describe the contracts and events to index, write handlers that store the data you need, and query the results with GraphQL.
HyperIndex can generate a working indexer from a contract that is [verified on the block explorer](/evm/developing/verifying-contracts).

Etherlink<!--TX--> Mainnet (chain ID `42793`) is on the list of [HyperSync supported networks](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks), so HyperIndex reads Etherlink<!--TX--> Mainnet data through HyperSync by default.
Shadownet Testnet is not on that list.
To index a network that HyperSync does not support, see [RPC as a data source](https://docs.envio.dev/docs/HyperIndex/rpc-sync) in the Envio documentation.

This guide builds an indexer for the Wrapped XTZ (WXTZ) token on Etherlink<!--TX--> Mainnet at address `0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb`.
You can follow the same steps with any verified contract.

## Quick start

To get started, follow these three steps:

- Initialize your indexer project
- Run the indexer locally
- Query the indexed data

## Prerequisites

- [Node.js](https://nodejs.org/en/download) version 22 or later
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), which HyperIndex uses to run its local database and GraphQL server
- An Envio API token, which you can create at https://envio.dev/app/api-tokens

## Initialize your indexer project

1. Run the Envio CLI

   In an empty folder, run this command:

   ```bash
   pnpx envio init
   ```

   The CLI asks a series of questions to set up the project.

1. Answer the prompts

   Give the project a folder name, then choose these options:

   - For the blockchain ecosystem, select `Evm`.
   - For the initialization option, select `From Address - Lookup ABI from block explorer`.
   - For the blockchain, type `etherlink` to filter the list and select `etherlink`.
   - For the contract address, enter the address of your contract, such as `0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb` for WXTZ.

   The CLI fetches the contract ABI from the Etherlink EVM<!--TEVM--> block explorer and lists the events in the contract.
   All events are selected by default.
   Press the left arrow key to clear the selection, then use the arrow keys and space bar to select the events you want.
   For this guide, select `Approval`, `Deposit`, `Transfer`, and `Withdrawal`, then press Enter:

   ```
   > Which events would you like to index? Approval(address indexed owner, address indexed spender, uint256 value), Deposit(address indexed dst, uint256 wad), Transfer(address indexed from, address indexed to, uint256 value), Withdrawal(address indexed src, uint256 wad)
   ```

   When the CLI asks whether you want to add another contract, select `I'm finished`.
   If the `ENVIO_API_TOKEN` environment variable is not set, the CLI asks you to create a new API token or add an existing one to the project's `.env` file.

   The CLI generates the project, runs code generation and installs the dependencies:

   ```
   Your indexer is ready! Pick how you'd like to run it:

     1. cd etherlink-wxtz-indexer && pnpm test    # run the tests (recommended for AI)
     2. cd etherlink-wxtz-indexer && pnpm dev     # run locally
     3. cd etherlink-wxtz-indexer && pnpm start   # run in production
   ```

1. Review the generated files

   The project contains these main files:

   - `config.yaml`: The chain, contract address and events to index
   - `schema.graphql`: The entities that the indexer stores, one for each selected event
   - `src/handlers/WXTZ.ts`: The handler functions that turn each event into an entity
   - `.env`: Your Envio API token

   The generated `config.yaml` file looks like this:

   ```yaml
   # yaml-language-server: $schema=./node_modules/envio/evm.schema.json
   name: etherlink-wxtz-indexer
   disable_default_cross_chain: true
   chains:
   - id: 42793
     start_block: 0
     contracts:
     - name: WXTZ
       address:
       - "0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb"
       events:
       - event: Approval(address indexed owner, address indexed spender, uint256 value)
       - event: Deposit(address indexed dst, uint256 wad)
       - event: Transfer(address indexed from, address indexed to, uint256 value)
       - event: Withdrawal(address indexed src, uint256 wad)
   ```

   The `id` field is the Etherlink<!--TX--> Mainnet chain ID.
   Each handler stores the event parameters in an entity with an ID in the format `<chain ID>_<block number>_<log index>`, as in this generated handler for the `Deposit` event:

   ```typescript
   indexer.onEvent({ contract: "WXTZ", event: "Deposit" }, async ({ event, context }) => {
     const entity: WXTZ_Deposit = {
       id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
       dst: event.params.dst,
       wad: event.params.wad,
     };

     context.WXTZ_Deposit.set(entity);
   });
   ```

   You can edit the schema and handlers to store the data your application needs.
   For more information, see [Configuration file](https://docs.envio.dev/docs/HyperIndex/configuration-file), [Schema](https://docs.envio.dev/docs/HyperIndex/schema) and [Event handlers](https://docs.envio.dev/docs/HyperIndex/event-handlers) in the Envio documentation.

## Run the indexer locally

1. Run the tests

   The generated project includes tests for the handlers.
   Run them from the project folder:

   ```bash
   cd etherlink-wxtz-indexer
   pnpm test
   ```

   The output shows the result of each test:

   ```
    Test Files  1 passed (1)
         Tests  2 passed (2)
   ```

1. Start the indexer

   Make sure that Docker is running, then run this command:

   ```bash
   pnpm dev
   ```

   The indexer starts a Postgres database and a Hasura GraphQL server in Docker, then starts indexing:

   ```
   Connected to Docker via default socket
   Started envio-postgres
   Started envio-hasura
   Waiting for Postgres...Waiting for Hasura... ready (0.0s)
   ... ready (3.0s)
   [17:30:03.036] INFO: Initializing the indexer storage...
   [17:30:03.075] INFO: No cache found to upload.
   [17:30:03.094] INFO: Tracking tables in Hasura
   [17:30:03.421] INFO: Hasura configuration completed
   [17:30:03.421] INFO: The indexer storage is ready. Starting indexing!
   ```

1. Check the indexing status

   The Hasura console is available at http://localhost:8080.
   When it asks for the admin secret, enter `testing`.

   To see how far the indexer has synced, run the `_meta` query, either in the **API** tab of the Hasura console or from the command line:

   ```bash
   curl -s http://localhost:8080/v1/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ _meta { chainId progressBlock sourceBlock isReady } }"}'
   ```

   The response shows the last block that the indexer processed (`progressBlock`) and the latest block on the chain (`sourceBlock`).
   The `isReady` field is `false` while the indexer is still catching up with the chain:

   ```json
   {"data":{"_meta":[{"chainId":42793,"progressBlock":8573209,"sourceBlock":54162031,"isReady":false}]}}
   ```

## Query the indexed data

You can query the indexed data from the GraphQL endpoint at `http://localhost:8080/v1/graphql` while the indexer is running.
Each entity in `schema.graphql` has a query with the same name, such as `WXTZ_Deposit`, and a `_by_pk` query that returns one entity by its chain ID and ID.

For example, this query returns the WXTZ deposit with log index 1 in block 659864:

```bash
curl -s http://localhost:8080/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ WXTZ_Deposit_by_pk(chainId: 42793, id: \"42793_659864_1\") { id dst wad } }"}'
```

The response contains the account that received the WXTZ and the amount, in the token's smallest unit:

```json
{"data":{"WXTZ_Deposit_by_pk":{"id":"42793_659864_1","dst":"0x21c79736B62A0C9a1c843D9F99049Bac391B9A05","wad":"100000000000000"}}}
```

You can compare this result with [the transaction on the block explorer](https://explorer.etherlink.com/tx/0xc87dfdc37cf52b65d0313a2cb9a08cef577ed2c4dbdfad1e26adf350a6ae08b3).

To stop the local environment and delete the local database, run `pnpm envio stop`.

## Deploy your indexer

The local setup is for development.
To run the indexer in production, you can deploy it to Envio Cloud, which hosts the indexer and gives it a GraphQL endpoint, or host it on your own infrastructure.
For more information, see [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service), [Deploying your indexer](https://docs.envio.dev/docs/HyperIndex/hosted-service-deployment) and [Self-hosting](https://docs.envio.dev/docs/HyperIndex/self-hosting) in the Envio documentation.

## Appendix

### Sample query

This query returns the three largest WXTZ deposits that the indexer has processed:

```graphql
{
  WXTZ_Deposit(limit: 3, order_by: {wad: desc}) {
    id
    dst
    wad
  }
}
```

The results depend on how far the indexer has synced.
This is an example of the result:

```json
{
  "WXTZ_Deposit": [
    {
      "id": "42793_7883592_3",
      "dst": "0x0D1C515CCb1B723eCBA2Cbb14c458168078529DA",
      "wad": "500000000000000000000000"
    },
    {
      "id": "42793_3199737_1",
      "dst": "0x34f957BCD46A9B0f8fCCdcc945004cE03ac6bDb5",
      "wad": "478216070729682252095318"
    },
    {
      "id": "42793_8077778_1",
      "dst": "0xA237E96Abc3180AF377EcF22aE590C02991f9b1F",
      "wad": "370000000000000000000000"
    }
  ]
}
```

### Sample code

This Node.js script sends the sample query to the local GraphQL endpoint and prints the result.
Save it as `query.mjs` and run it with `node query.mjs`:

```javascript
const query = `{
  WXTZ_Deposit(limit: 3, order_by: {wad: desc}) {
    id
    dst
    wad
  }
}`;

const response = await fetch("http://localhost:8080/v1/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});

const { data } = await response.json();
console.log(JSON.stringify(data, null, 2));
```

### Additional resources

- For more ways to set up an indexer, see the [HyperIndex quickstart](https://docs.envio.dev/docs/HyperIndex/quickstart).
- For the commands that the Envio CLI provides, see [CLI commands](https://docs.envio.dev/docs/HyperIndex/cli-commands).
- For more information about the Hasura console, see [Navigating Hasura](https://docs.envio.dev/docs/HyperIndex/navigating-hasura).

# AGENTS.md for Etherlink doc

Guidelines for AI agents and contributors working on the documentation for Etherlink, a Layer 2 on top of Tezos powered by Smart Rollups, which implements a single blockchain addressable through two interfaces: the **EVM interface** and the **Michelson interface**.
Thus, it enables seamless integration with existing Ethereum and Tezos tools, including wallets and indexers, and facilitates assets transfers to and from other EVM-compatible chains as well as Tezos L1 Mainnet.

The documentation is currently published at https://docs.etherlink.com/.

## Rebranding

Etherlink will be renamed soon "Tezos X".

To prepare the work in this documentation, all the mentions of Etherlink have been annotated with their future name, according to the following rules.

### Rebranding rules

First, a few particular cases:
- formerly Etherlink -> stays the same
- Etherlink upgrade -> Tezos X kernel upgrade
- Etherlink X.Y -> Tezos X kernel X.Y
- (Etherlink/Octez) EVM node -> Tezos X node
- Etherlink RPC node -> Tezos X node
- the Etherlink tutorial -> the prediction market tutorial

For all the other occurrences of "Etherlink", the choice was done depending on the context, according to the following rules: 
- when it refers to a concept that maps to a concept local to the EVM interface, such as running or deploying a contract on Etherlink, replace "Etherlink" with "Tezos EVM". The local concepts include:
	- gas
	- fees
	- running contracts
	- deploying contracts
	- websocket events
	- RPC
	- block explorer
	- dApps
	- tokens
	- XTZ
	- funds
	- price feeds
	- oracles
	- users

- when it refers to a concept that maps to a concept global to Tezos X, such as the Etherlink architecture or blockchain, replace "Etherlink" with "Tezos X". The global concepts include:
	- architecture
	- blockchain
	- network
	- testnet
	- Mainnet
	- Shadownet
	- transaction
	- context
	- state
	- kernel
	- (inbox) messages
	- Smart Rollup (node)
	- sequencer
	- team
	- support

### Markers used

Markers differ by file type because MDX v3's JSX parser rejects `<!--` in body text (it tries to parse `<` as a JSX element).

**In `.md` body text** (outside frontmatter and code blocks):

| Marker | Current text | Original text |
|--------|-------------|---------------|
| `<!--TX-->` | `Etherlink<!--TX-->` | `Tezos X` |
| `<!--TEVM-->` | `Etherlink EVM<!--TEVM-->` | `Tezos EVM` |
| `<!--TXN-->` | `EVM node<!--TXN-->` | `Tezos X node` |

**In `.mdx` body text** (JSX comment syntax, invisible when rendered):

| Marker | Current text | Original text |
|--------|-------------|---------------|
| `{/* TX */}` | `Etherlink{/* TX */}` | `Tezos X` |
| `{/* TEVM */}` | `Etherlink EVM{/* TEVM */}` | `Tezos EVM` |
| `{/* TXN */}` | `EVM node{/* TXN */}` | `Tezos X node` |

**In `.mdx` JSX string attributes** (e.g. `TabItem` `label=`), the string form is converted to a JSX expression with a JS comment:

| Current form | Original |
|---|---|
| `label={"Etherlink Mainnet" /* TX */}` | `label="Tezos X Mainnet"` |
| `label={"Etherlink Shadownet Testnet" /* TX */}` | `label="Tezos X Shadownet Testnet"` |

**In YAML frontmatter** (HTML/JSX comments are not valid in YAML values), a trailing inline YAML comment is used:

| Comment | Example | Original |
|---------|---------|----------|
| `# tx` | `title: Etherlink architecture # tx` | `Tezos X architecture` |
| `# tevm` | `title: Indexing Etherlink EVM contracts # tevm` | `Tezos EVM` |
| `# txn` | `title: Running an EVM node # txn` | `Tezos X node` |

### Doing the substitution

Run from the repo root:

```bash
# --- .md files: revert HTML comment markers ---

# Revert <!--TX--> → Tezos X
find docs -name '*.md' | xargs sed -i '' 's/Etherlink<!--TX-->/Tezos X/g'

# Revert <!--TEVM--> → Tezos EVM
find docs -name '*.md' | xargs sed -i '' 's/Etherlink EVM<!--TEVM-->/Tezos EVM/g'

# Revert <!--TXN--> — also restores "an EVM" → "a Tezos X"
find docs -name '*.md' | xargs sed -i '' 's/an EVM node<!--TXN-->/a Tezos X node/g'
find docs -name '*.md' | xargs sed -i '' 's/An EVM node<!--TXN-->/A Tezos X node/g'
find docs -name '*.md' | xargs sed -i '' 's/EVM nodes<!--TXN-->/Tezos X nodes/g'
find docs -name '*.md' | xargs sed -i '' 's/EVM node<!--TXN-->/Tezos X node/g'

# --- .mdx files: revert JSX comment markers ---

find docs -name '*.mdx' | xargs sed -i '' 's/Etherlink{\/\* TX \*\/}/Tezos X/g'
find docs -name '*.mdx' | xargs sed -i '' 's/Etherlink EVM{\/\* TEVM \*\/}/Tezos EVM/g'
find docs -name '*.mdx' | xargs sed -i '' 's/an EVM node{\/\* TXN \*\/}/a Tezos X node/g'
find docs -name '*.mdx' | xargs sed -i '' 's/An EVM node{\/\* TXN \*\/}/A Tezos X node/g'
find docs -name '*.mdx' | xargs sed -i '' 's/EVM nodes{\/\* TXN \*\/}/Tezos X nodes/g'
find docs -name '*.mdx' | xargs sed -i '' 's/EVM node{\/\* TXN \*\/}/Tezos X node/g'

# --- .mdx files: revert JSX expression attributes ---
# (only in network/evm-nodes.mdx and network/smart-rollup-nodes.mdx)
find docs -name '*.mdx' | xargs sed -i '' \
  's/label={"Etherlink Mainnet" \/\* TX \*\/}/label="Tezos X Mainnet"/g'
find docs -name '*.mdx' | xargs sed -i '' \
  's/label={"Etherlink Shadownet Testnet" \/\* TX \*\/}/label="Tezos X Shadownet Testnet"/g'

# --- All files: revert frontmatter YAML comments ---
find docs -name '*.md' -o -name '*.mdx' | xargs sed -i '' \
  's/ # tx$//; s/ # tevm$//; s/ # txn$//'

# --- evm-nodes.mdx: remove explicit anchor pin added for stability ---
# Remove {#from-an-existing-etherlink-smart-rollup-node} from the heading
```

### Caveats when substituting

- **Explicit anchor pin**: The heading `### From an existing Etherlink... Smart Rollup node` in `docs/network/evm-nodes.mdx` has `{#from-an-existing-etherlink-smart-rollup-node}` appended to stabilise the anchor. When reverting, remove that suffix and update the corresponding link in the same file.

- **Code blocks**: The 5 occurrences inside fenced code blocks were substituted without markers (plain `Etherlink` / `EVM node`). They must be reverted manually. Affected files:
  - `docs/evm/tools/price-feeds.md:405` — `// stXTZ oracle on Etherlink Mainnet`
  - `docs/evm/developing/deploying-contracts.md:40` — `"Hello Etherlink!"`
  - `docs/evm/developing/transactions.md:824,895` — `// Sign and return Etherlink ...`
  - `docs/tutorials/nac-counter.md:284` — `/// @dev Etherlink Previewnet NAC ...`

- **Articles "a" / "an"**: The substitution corrected `a Tezos X node` → `an EVM node` (since "EVM" takes "an"). Reverting puts "a Tezos X node" back correctly. However, a handful of other spots where `a Tezos X` became `a Etherlink` (e.g. some frontmatter titles) were not article-corrected; after reverting, verify no stray "an Tezos X" crept in.

- **New content added after the temporary rebranding**: Use the appropriate marker for the file type — HTML comments (`<!--TX-->` etc.) in `.md` files, JSX comments (`{/* TX */}` etc.) in `.mdx` body text — so that the revert commands above will catch it automatically.

## Sources of information

This documentation is maintained up-to-date with respect to (and partly generated from) the knowledge bases and internal documentation below.
Other existing documentation can serve for background knowledge about the Tezos ecosystem.

### Knowledge bases

The following knowledge bases for AI agents can be used as authoritative sources of information:
- https://github.com/trilitech/tezos-x for the design and implementation of Tezos X
- https://github.com/trilitech/tezos-kb for background knowledge about Tezos at large

## Source code

The source code for Etherlink lives at <https://gitlab.com/tezos/tezos/-/tree/master/etherlink>.
It is part of the Octez code base at <https://gitlab.com/tezos/tezos/>.

### Internal documentation

Internal developer documentation exists mostly in the Linear initiative: https://linear.app/tezos/initiative/etherlink-becomes-tezos-x-by-featuring-the-michelson-runtime-3ce17800416e/ and especially;
* [TezosX PoC: Overview]()https://linear.app/tezos/document/tezosx-poc-overview-90f3e2dab2a9
* [Technical Design Document](https://linear.app/tezos/document/technical-design-document-68fb013fdbae)
* [Tezos X glossary](https://linear.app/tezos/document/tezos-x-glossary-94d5828b101b)
* [Product Requirements Document](https://linear.app/tezos/document/product-requirements-document-f487b7d895d6)
* [Cross-runtime contract calls in Tezos X](https://linear.app/tezos/document/cross-runtime-contract-calls-in-tezos-x-793b2c3e4d50)
* [Architecture description records and especially](https://linear.app/tezos/project/architecture-decision-record-28155101efa9/issues)
  - [Naming conventions](https://linear.app/tezos/issue/L2-822/001-naming-conventions)
  - [DA fees distribution on the Michelson runtime](https://linear.app/tezos/issue/L2-823/002-da-fees-distribution-on-the-michelson-runtime)
  - [Tezos aliases](https://linear.app/tezos/issue/L2-830/005-tezos-aliases)
  - [EIP-7702 Delegation for Ethereum Alias Generation](https://linear.app/tezos/issue/L2-824/003-eip-7702-delegation-for-ethereum-alias-generation)
  - [Resources management for the MVP cross-runtime calls](https://linear.app/tezos/issue/L2-858/006-resources-management-for-the-mvp-cross-runtime-calls)
* [Tezos X Mainnet Infrastructure](https://linear.app/tezos/project/tezos-x-mainnet-infrastructure-1a9364d32cb7/overview)
* [TechRel testing feedback and especially](https://linear.app/tezos/project/techrel-testing-feedback-5bd1ff8ef77d)
  - [TezosX Onboarding guide](https://linear.app/tezos/document/tezosx-onboarding-guide-da27b417c992)
  - [CRAC usage](https://linear.app/tezos/document/crac-usage-3afdc32c4cd2)
* See also the complete Bibliography
* See also the RFCs within the contained projects, especially those that are Completed
  - For instance [RFC: TezosX Blocks format](https://linear.app/tezos/document/rfc-tezosx-blocks-format-40cdbfca134e) in project [Tezos X blocks](https://linear.app/tezos/project/tezos-x-blocks-1a1f20746dee)

## Documentation guidelines

### General guidelines

User-facing documentation is built from internal developer documentation, but making it more concise and adjusting the level of details:
- drop info about: rejected designs, implementation details
- drop considerations about: more than 2 runtimes, the Jstz runtime
- clarify parts that aren’t clear
- consistently use the terms in the glossary
- always use "Native atomic calls" or NAC instead of "Cross-runtime atomic calls" or CRAC
- for Tezos "tz" addresses, always use "user account" instead of "implicit account"
- for Tezos "KT" addresses, always use "smart contract" instead of "originated account"
- follow the terminology guidelines at https://docs.google.com/document/d/1tdgxm2G9NRZBajYmnOHbv2AcPMPhy9mPS79h4xKxhbU/

### Specific rules

- In body text, use "native atomic composability" when introducing the feature, and "cross-runtime call" / "cross-runtime interaction" for specific operations. The glossary entry for CRAC should be replaced with an entry called NAC.
- Explain the semantics regarding the number of decimals when transferring tez between the two interfaces (the number of decimals used by Michelson and EVM differ for tez)


# How do I participate in governance?

Etherlink bakers can participate in the [Etherlink governance process](/governance/how-is-etherlink-governed) by submitting proposals and voting for them.

The voting power of a baker is the amount of tez that it has staked plus the tez that delegators have delegated to it, also called its _staking balance_.

Separate contracts manage the kernel updates, security updates, and the Sequencer Committee, so to interact with them, bakers send transactions to those contracts, such as with the Octez client.
The addresses of the governance contracts are specified in Etherlink's kernel.
For information about the Octez client, see [Command Line Interface](https://tezos.gitlab.io/active/cli-commands.html) in the Octez documentation.

## Governance contract addresses

You need the address of the correct governance contract to propose changes and vote on changes.

### Mainnet governance contracts

These are the governance contracts for the Etherlink Smart Rollup on Mainnet, which has the address [`sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf`](https://tzkt.io/sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf):

Governance contract | Address
--- | ---
Kernel governance | [KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J](https://better-call.dev/mainnet/KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J)
Kernel security governance | [KT1N5MHQW5fkqXkW9GPjRYfn5KwbuYrvsY1g](https://better-call.dev/mainnet/KT1N5MHQW5fkqXkW9GPjRYfn5KwbuYrvsY1g)
Sequencer committee | [KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF](https://better-call.dev/mainnet/KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF)

### Ghostnet governance contracts

These are the governance contracts for the Etherlink Smart Rollup on Ghostnet, which has the address [`sr18wx6ezkeRjt1SZSeZ2UQzQN3Uc3YLMLqg`](https://ghostnet.tzkt.io/sr18wx6ezkeRjt1SZSeZ2UQzQN3Uc3YLMLqg):

Governance contract | Address
--- | ---
Kernel governance | [KT1HfJb718fGszcgYguA4bfTjAqe1BEmFHkv](https://better-call.dev/ghostnet/KT1HfJb718fGszcgYguA4bfTjAqe1BEmFHkv)
Kernel security governance | [KT1QDgF5pBkXEizj5RnmagEyxLxMTwVRpmYk](https://better-call.dev/ghostnet/KT1QDgF5pBkXEizj5RnmagEyxLxMTwVRpmYk)
Sequencer committee | [KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9](https://better-call.dev/ghostnet/KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9)

## Participating in kernel and security governance

Bakers can propose, vote on, and trigger kernel updates and security updates with these commands.
The commands are the same for kernel upgrades and security upgrades but they target different governance contracts.

### Getting information about the current period

To get information about the current state of the kernel or security governance contract, call its `get_voting_state` view.
For example, this Octez client command calls this view for the security governance contract on Mainnet:

```bash
octez-client run view get_voting_state on contract KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J
```

The view returns information about the current governance period in this order:

- The index of the current period
- Whether the current period is Proposal (`Left Unit`) or Promotion (`Right Unit`)
- The number of blocks remaining in the period
- Information about voting during the period

For example, this response shows that the contract is currently in the Proposal period:

```
(Pair 1619 (Left Unit) 64 None)
```

Block explorers show this information in a more human-readable format.

You can also subscribe to the `voting_finished` event to be notified when the Proposal period completes.

### Proposing and upvoting upgrades

During a Proposal period, bakers can propose kernel or security updates by calling the `new_proposal` entrypoint of the appropriate governance contract, as in this example:

```bash
octez-client transfer 0 from my_wallet to KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J \
  --entrypoint "new_proposal" \
  --arg "0x009279df4982e47cf101e2525b605fa06cd3ccc0f67d1c792a6a3ea56af9606abc"
```

The command takes these parameters:

- The address or Octez client alias of your baker account
- The address of the Etherlink kernel or security governance contract
- The hash of the kernel upgrade

The proposer must make the code of the new kernel available for people to evaluate.
Proposers can make it easier for bakers to upgrade to the new kernel by providing the preimages for the kernel online so nodes can update from them directly.

To upvote a proposed kernel or security update during a Proposal period, call the `upvote_proposal` entrypoint with the same parameters:

```bash
octez-client transfer 0 from my_wallet to KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J \
  --entrypoint "upvote_proposal" \
  --arg "0x009279df4982e47cf101e2525b605fa06cd3ccc0f67d1c792a6a3ea56af9606abc"
```

It's not necessary to upvote a proposal that you submitted; submitting a proposal implies that your account upvotes it.

### Voting for or against upgrades

When a proposal is in the Promotion period, you can vote for or against it or pass on voting by calling the `vote` entrypoint of the appropriate governance contract:

```bash
octez-client transfer 0 from my_wallet to KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J \
  --entrypoint "vote" --arg '"yea"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account
- The address of the Etherlink kernel or security governance contract
- `"yea"`, `"nay"`, or `"pass"`, including the double quotes

### Triggering upgrades

After a proposal wins a vote, any user can trigger the kernel or security upgrade by calling the governance contract's `trigger_kernel_upgrade` entrypoint:

```bash
octez-client transfer 0 from my_wallet to KT1N5MHQW5fkqXkW9GPjRYfn5KwbuYrvsY1g \
  --entrypoint "trigger_kernel_upgrade" \
  --arg '"sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account
- The address of the Etherlink kernel or security governance contract
- The address of the Etherlink Smart Rollup; the parameter must include the double quotes

After the new kernel becomes active, bakers must provide their nodes with the preimages for the new kernel to continue to participate in Etherlink.
If a node uses a preimages endpoint as described in [Running an Etherlink EVM node](../network/evm-nodes) and [Running an Etherlink Smart Rollup node](../network/smart-rollup-nodes), the node updates automatically.

## Participating in Sequencer Committee governance

Bakers can propose a member for Etherlink's Sequencer Committee, vote for or against proposed members, and trigger the change to committee members.

### Getting information about the current period

To get information about the current state of the Sequencer Committee governance contract, call its `get_voting_state` view.
For example, this Octez client command calls this view for the kernel governance contract on Mainnet:

```bash
octez-client run view get_voting_state on contract KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF
```

The view returns information about the current governance period.
Block explorers show this information in a more human-readable format.

You can also subscribe to the `voting_finished` event to be notified when the Proposal period completes.

### Proposing and voting for a new member

To propose a member for the Sequencer Committee, bakers can call the `new_proposal` entrypoint of the governance contract during the Proposal period:

```bash
octez-client transfer 0 from my_wallet to KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF \
  --entrypoint "new_proposal" \
  --arg "Pair \"$PUBLIC_KEY\" $L2_ADDRESS"
```

The command takes these parameters:

- The address or Octez client alias of your baker account
- The address of the Sequencer Committee governance contract
- The public key (not the public key hash or account address) of the account to propose, including the double quotes
- The Etherlink address of the account to propose

For example:

```bash
octez-client transfer 0 from my_wallet to KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF \
  --entrypoint "new_proposal" \
  --arg 'Pair "edpkurcgafZ2URyB6zsm5d1YqmLt9r1Lk89J81N6KpyMaUzXWEsv1X" 0xb7a97043983f24991398e5a82f63f4c58a417185'
```

To upvote a proposed committee member during a Proposal period, call the `upvote_proposal` entrypoint with the same parameters:

```bash
octez-client transfer 0 from my_wallet to KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF \
  --entrypoint "upvote_proposal" \
  --arg 'Pair "edpkurcgafZ2URyB6zsm5d1YqmLt9r1Lk89J81N6KpyMaUzXWEsv1X" 0xb7a97043983f24991398e5a82f63f4c58a417185'
```

It's not necessary to upvote a proposal that you submitted; submitting a proposal implies that your account upvotes it.

### Voting for or against a new member

When a proposal is in the Promotion period, you can vote for or against it or pass on voting by calling the `vote` entrypoint of the governance contract:

```bash
octez-client transfer 0 from my_wallet to KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J \
  --entrypoint "vote" --arg '"yea"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account
- The address of the Sequencer Committee governance contract
- `"yea"`, `"nay"`, or `"pass"`, including the double quotes

For example:

```bash
octez-client transfer 0 from tz1RLPEeMxbJYQBFbXYw8WHdXjeUjnG5ZXNq to KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9 \
  --entrypoint "vote" --arg "\"yea\""
```

### Triggering committee upgrades

After a proposed member wins a vote, any user can trigger the change to the committee by calling the governance contract's `trigger_committee_upgrade` entrypoint:

```bash
octez-client transfer 0 from my_wallet to KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J \
  --entrypoint "trigger_committee_upgrade" \
  --arg '"sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account
- The address of the Sequencer Committee governance contract
- The address of the Etherlink Smart Rollup; the parameter must include the double quotes

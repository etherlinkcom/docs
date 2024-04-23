# 🗳️ How do I participate in governance?

Etherlink bakers can participate in the [Etherlink governance process](./how-is-etherlink-governed) by submitting proposals and voting for them.

The voting power of a baker is the amount of tez that it has staked plus the tez that delegators have delegated to it, also called its _staking balance_.

Separate contracts manage the kernel updates, security updates, and the Sequencer Committee, so to interact with them, bakers send transactions to those contracts, such as with the Octez client.
The addresses of the governance contracts are specified in Etherlink's kernel.
For information about the Octez client, see [Command Line Interface](https://tezos.gitlab.io/active/cli-commands.html) in the Octez documentation.

## Participating in kernel and security governance

Bakers can propose, vote on, and trigger kernel updates and security updates with these commands.
The commands are the same for kernel upgrades and security upgrades but they target different governance contracts.

### Getting information about the current period

To get information about the current state of the kernel or security governance contract, call its `get_voting_state` view.
For example, this Octez client command calls this view for the kernel governance contract on Ghostnet:

```bash
octez-client run view get_voting_state on contract KT1QDgF5pBkXEizj5RnmagEyxLxMTwVRpmYk
```

The view returns information about the current governance period in this order:

- The index of the current period
- Whether the current period is Proposal (`Left Unit`) or Promotion (`Right Unit`)
- The number of blocks remaining in the period
- Whether voting is complete for the period

For example, this response shows that the contract is currently in the Proposal period:

```
(Pair 1619 (Left Unit) 64 None)
```

Block explorers show this information in a more human-readable format.

You can also subscribe to the `voting_finished` event to be notified when the Proposal period completes.
For past events, look up the contract on a block explorer, as in this example:
https://better-call.dev/ghostnet/KT1QDgF5pBkXEizj5RnmagEyxLxMTwVRpmYk/events

### Proposing and upvoting upgrades

During a Proposal period, bakers can propose kernel or security updates by calling the `new_proposal` entrypoint of the appropriate governance contract:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "new_proposal" --arg "$KERNEL_ROOT_HASH"
```

The command takes these parameters:

- `YOUR_ADDRESS`: The address or Octez client alias of your baker account
- `CONTRACT_ADDRESS`: The address of the Etherlink kernel or security governance contract
- `KERNEL_ROOT_HASH`: The hash of the kernel upgrade

For example:

```bash
octez-client transfer 0 from tz1RfbwbXjE8UaRLLjZjUyxbj4KCxibTp9xN to KT1HfJb718fGszcgYguA4bfTjAqe1BEmFHkv \
  --entrypoint "new_proposal" \
  --arg "0x009279df4982e47cf101e2525b605fa06cd3ccc0f67d1c792a6a3ea56af9606abc"
```

To upvote a proposed kernel or security update during a Proposal period, call the `upvote_proposal` entrypoint with the same parameters:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "upvote_proposal" \
  --arg "$KERNEL_ROOT_HASH"
```

For example:

```bash
octez-client transfer 0 from tz1RfbwbXjE8UaRLLjZjUyxbj4KCxibTp9xN to KT1HfJb718fGszcgYguA4bfTjAqe1BEmFHkv \
  --entrypoint "upvote_proposal" \
  --arg "0x009279df4982e47cf101e2525b605fa06cd3ccc0f67d1c792a6a3ea56af9606abc"
```

It's not necessary to upvote a proposal that you submitted; submitting a proposal implies that your account upvotes it.

### Voting for or against upgrades

When a proposal is in the Promotion period, you can vote for or against it or pass on voting by calling the `vote` entrypoint of the appropriate governance contract:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "vote" --arg "\"$YOUR_VOTE\""
```

The command takes these parameters:

- `YOUR_ADDRESS`: The address or Octez client alias of your baker account
- `CONTRACT_ADDRESS`: The address of the Etherlink kernel or security governance contract
- `YOUR_VOTE`: `"yea"`, `"nay"`, or `"pass"`, including the double quotes

For example:

```bash
octez-client transfer 0 from tz1RfbwbXjE8UaRLLjZjUyxbj4KCxibTp9xN to KT1HfJb718fGszcgYguA4bfTjAqe1BEmFHkv \
  --entrypoint "vote" --arg "\"yea\""
```

### Triggering upgrades

After a proposal wins a vote, any user can trigger the kernel or security upgrade by calling the governance contract's `trigger_kernel_upgrade` entrypoint:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "trigger_kernel_upgrade" \
  --arg "\"$SMART_ROLLUP_ADDRESS\""
```

The command takes these parameters:

- `YOUR_ADDRESS`: The address or Octez client alias of your baker account
- `CONTRACT_ADDRESS`: The address of the Etherlink kernel or security governance contract
- `SMART_ROLLUP_ADDRESS`: The address of the Etherlink Smart Rollup, which you can get from block explorers or from etherlink.com; the command must include the double quotes

For example:

```bash
octez-client transfer 0 from tz1RfbwbXjE8UaRLLjZjUyxbj4KCxibTp9xN to KT1HfJb718fGszcgYguA4bfTjAqe1BEmFHkv \
  --entrypoint "trigger_kernel_upgrade" \
  --arg "\"sr1EStimadnRRA3vnjpWV1RwNAsDbM3JaDt6\""
```

## Participating in Sequencer Committee governance

Bakers can propose a member for Etherlink's Sequencer Committee, vote for or against proposed members, and trigger the change to committee members.

### Getting information about the current period

To get information about the current state of the Sequencer Committee governance contract, call its `get_voting_state` view.
For example, this Octez client command calls this view for the kernel governance contract on Ghostnet:

```bash
octez-client run view get_voting_state on contract KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9
```

The view returns information about the current governance period.
Block explorers show this information in a more human-readable format.

You can also subscribe to the `voting_finished` event to be notified when the Proposal period completes.
For past events, look up the contract on a block explorer, as in this example:
https://better-call.dev/ghostnet/KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9/events

### Proposing and voting for a new member

To propose a member for the Sequencer Committee, bakers can call the `new_proposal` entrypoint of the governance contract during the Proposal period:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "new_proposal" \
  --arg "Pair \"$PUBLIC_KEY\" $L2_ADDRESS"
```

The command takes these parameters:

- `YOUR_ADDRESS`: The address or Octez client alias of your baker account
- `CONTRACT_ADDRESS`: The address of the Sequencer Committee governance contract
- `PUBLIC_KEY`: The public key (not the public key hash or account address) of the account to propose, including the double quotes
- `L2_ADDRESS`: The Etherlink address of the account to propose

For example:

```bash
octez-client transfer 0 from tz1RLPEeMxbJYQBFbXYw8WHdXjeUjnG5ZXNq to KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9 \
  --entrypoint "new_proposal" \
  --arg "Pair \"edpkurcgafZ2URyB6zsm5d1YqmLt9r1Lk89J81N6KpyMaUzXWEsv1X\" 0xb7a97043983f24991398e5a82f63f4c58a417185"
```

To upvote a proposed committee member during a Proposal period, call the `upvote_proposal` entrypoint with the same parameters:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "upvote_proposal" \
  --arg "Pair \"$PUBLIC_KEY\" $L2_ADDRESS"
```

For example:

```bash
octez-client transfer 0 from tz1RLPEeMxbJYQBFbXYw8WHdXjeUjnG5ZXNq to KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9 \
  --entrypoint "upvote_proposal" \
  --arg "0x009279df4982e47cf101e2525b605fa06cd3ccc0f67d1c792a6a3ea56af9606abc"
```

It's not necessary to upvote a proposal that you submitted; submitting a proposal implies that your account upvotes it.

### Voting for or against a new member

When a proposal is in the Promotion period, you can vote for or against it or pass on voting by calling the `vote` entrypoint of the governance contract:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "vote" --arg "\"$YOUR_VOTE\""
```

The command takes these parameters:

- `YOUR_ADDRESS`: The address or Octez client alias of your baker account
- `CONTRACT_ADDRESS`: The address of the Sequencer C0mmittee governance contract
- `YOUR_VOTE`: `"yea"`, `"nay"`, or `"pass"`, including the double quotes

For example:

```bash
octez-client transfer 0 from tz1RLPEeMxbJYQBFbXYw8WHdXjeUjnG5ZXNq to KT1FRzozuzFMWLimpFeSdADHTMxzU8KtgCr9 \
  --entrypoint "vote" --arg "\"yea\""
```

### Triggering committee upgrades

After a proposed member wins a vote, any user can trigger the change to the committee by calling the governance contract's `trigger_committee_upgrade` entrypoint:

```bash
octez-client transfer 0 from $YOUR_ADDRESS to $CONTRACT_ADDRESS \
  --entrypoint "trigger_committee_upgrade" \
  --arg "\"$SMART_ROLLUP_ADDRESS\""
```

The command takes these parameters:

- `YOUR_ADDRESS`: The address or Octez client alias of your baker account
- `CONTRACT_ADDRESS`: The address of the Sequencer Committee governance contract
- `SMART_ROLLUP_ADDRESS`: The address of the Etherlink Smart Rollup, which you can get from block explorers or from etherlink.com; the command must include the double quotes

For example:

```bash
octez-client transfer 0 from tz1RfbwbXjE8UaRLLjZjUyxbj4KCxibTp9xN to KT1Bda2EHR3pwjPgQc6mBHwtfCP8Cuf5ud5j \
  --entrypoint "trigger_committee_upgrade" \
  --arg "\"sr1EStimadnRRA3vnjpWV1RwNAsDbM3JaDt6\""
```

---
title: Network operators
---

Etherlink relies on operators who run nodes.
For information on the roles of these different nodes, see [Etherlink architecture](/network/architecture).

## Smart Rollup node operators

Anyone can run Etherlink [Smart Rollup nodes](/network/smart-rollup-nodes), and due to the optimistic nature of Tezos [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) it takes only one honest Smart Rollup node operator to keep Etherlink secure.
Honest Smart Rollup nodes can catch any misbehavior by other nodes by refuting their incorrect commitments.

These organizations currently run Etherlink Smart Rollup nodes in operator mode to post and defend commitments for the current state of Etherlink:

- [The Tezos Foundation](https://tezos.foundation/)
- [Zeeve](https://www.zeeve.io)

You can look up the current Smart Rollup node operators by checking the accounts that currently have bond set so they can post commitments for the Etherlink Smart Rollup, such as on the TzKT block explorer: https://tzkt.io/sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf/bondholders.

## Sequencer

Etherlink users rely on the sequencer to put transactions in a fair order and to ensure that transactions are included quickly.
Under normal circumstances, Etherlink users trust the sequencer to include their transactions, but if it does not, they can insert their transactions into the delayed inbox to force them to be included, as described in [Transaction lifecycle](/network/architecture#transaction-lifecycle).

Currently only the sequencer operator can run a sequencer, which is an Etherlink EVM node running in sequencer mode.
Users relying on the sequencer to include their transactions in Etherlink pay a so-called DA (Data Availability) fee, which covers the cost of including the transaction in a Layer 1 block.
The address of the sequencer operator's account (the account that receives the DA fees) is determined as part of the governance process.
As described in [Sequencer governance](/governance/how-is-etherlink-governed#sequencer-governance), users can propose and vote on new sequencer operators.
You can watch the results of the governance process at https://governance.etherlink.com.

These features give Etherlink users two important checks on the sequencer operator's power:

- The delayed inbox ensures that if the sequencer does not include transactions, Etherlink users can force transactions to be included
- If the sequencer does not operate efficiently or fairly, Etherlink users through Tezos bakers can vote the operator out

The sequencer is currently run by Optimistic labs, whose address on Etherlink is [0x3b1885eec759c22c878e12c84fac33b3b9d153e4](https://explorer.etherlink.com/address/0x3b1885eec759c22c878e12c84fac33b3b9d153e4), in technical partnership with Nomadic Labs and TriliTech.

:::note
<h3>Bridging time</h3>
Tokens that you bridge from Tezos layer 1 to Etherlink are available for use on Etherlink immediately.

By default, tokens that you bridge from Etherlink to Tezos layer 1 are available for use on Tezos in 15 days.
You can bridge XTZ tokens faster for an additional fee with [fast withdrawals](/bridging/bridging-tezos#fast-withdrawals).

This delay is caused by the Smart Rollup refutation period.
As with all Smart Rollups, Etherlink nodes post commitments about their state to Tezos layer 1, including incoming bridging transactions, on a regular schedule.
Other nodes have the length of the refutation period (14 days) to challenge those commitments.
At the end of the refutation period, the correct commitment is cemented, or made final and unchangeable.

After the commitment with the withdrawal transaction is cemented, any user can execute the transaction to make the bridged tokens available on Tezos layer 1.

<h3>Delay variations</h3>

This delay can vary if a Tezos layer 1 protocol upgrade changes the block times during a commitment's refutation period.

When layer 1 changes block times, it adjusts the number of blocks in the refutation period to keep the refutation period at the same real-world length.
It uses this new number of blocks to determine whether commitments can be cemented.

For this reason, if the block time gets shorter during the commitment's refutation period, the number of blocks that must pass before cementing a commitment increases.
Therefore, commitments that are not cemented when the number of blocks changes must wait slightly longer before they can be cemented.

This variation affects only commitments that are not cemented when the layer 1 protocol upgrade happens.
The delay is based on how much the block times changed and on how close a commitment is to being cemented when the number of blocks in the refutation period changes.

The maximum change is the new block time divided by the old block time multiplied by the standard refutation period.
For example, if the new block time is 8 seconds and the old block time is 10 seconds, the maximum addition to a commitment's refutation period is 10 / 8, or 1.25 times the standard 14-day period.
Commitments that are close to being cemented when the block time changes have the largest change to their refutation periods, while commitments that are made close to when the block time changes have a very small change.

:::
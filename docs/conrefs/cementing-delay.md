:::note
<h3>Bridging time</h3>
Tokens that you bridge from Tezos layer 1 to Etherlink are available for use on Etherlink immediately.

Tokens that you bridge from Etherlink to Tezos layer 1 are available for use on Tezos in 15 days.

This delay is caused by the Smart Rollup refutation period.
As with all Smart Rollups, Etherlink nodes post commitments about their state to Tezos layer 1, including incoming bridging transactions, on a regular schedule.
Other nodes have the length of the refutation period (14 days) to challenge those commitments.
At the end of the refutation period, the correct commitment is cemented, or made final and unchangeable.

After the commitment with the withdrawal transaction is cemented, any user can execute the transaction to make the bridged tokens available on Tezos layer 1.
:::
:::warning

Versions of the EVM node before 0.25 had an issue with gas price estimation.
As intended by the EVM specification, the node's implementation of the `eth_gasPrice` endpoint provides the current gas price.
If a wallet uses that information to calculate the cost of a transaction and the gas price goes up, the wallet might not include enough of a transaction fee.
In this case, the sequencer silently rejects the transaction.

Starting with version 0.25, the EVM node's implementation of the `eth_gasPrice` endpoint includes an increased safety margin to help ensure that the transaction fee is sufficient.
However, wallets may still not include a high enough transaction fee if the gas price increases rapidly or if they do not check the gas price often enough.
For greater control, wallets and dApps can call the `eth_getBlockByNumber` endpoint, which includes the base fee for transactions in the `baseFeePerGas` field.

If you are using an earlier version of the EVM node, you can increase the transaction fee to ensure that the sequencer will accept your transaction.
Because the sequencer rejects these transactions silently, wallets may resubmit the transaction automatically, still with insufficient transaction fees.
Most wallets periodically check the status of submitted transactions via the `eth_getTransactionByHash` and `eth_getTransactionReceipt` endpoints and update their information to show that they have failed, but it can take time before the wallet shows that the transaction has failed.

If the gas price drops, the sequencer may eventually accept the transaction, but the better solution is to use the wallet's "speed up" function (available in most popular supported wallets), and increase the maximum base gas fee.

:::
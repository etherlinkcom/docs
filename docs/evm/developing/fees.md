---
title: Etherlink EVM Fees # tevm
---

The Etherlink EVM<!--TEVM--> gas price (and therefore the fee for a given transaction) varies based on the activity on the chain.
As activity increases, fees increase, and vice versa.
For information about estimating fees, see [Estimating fees](/evm/developing/estimating-fees).

Etherlink EVM<!--TEVM--> fees accounts for the cost of running the transaction,
called the _execution fee_, sometimes known as the _gas fee_.
It changes depending on Etherlink EVM<!--TEVM--> throughput over time; at times of high demand for Etherlink EVM<!--TEVM--> transactions, the gas fee rises.
This fee is burned.

As explained in [Fee structure](/overview/fee-structure), the Etherlink<!--TX-->  kernel also requires some fees accounting for the cost of writing the transaction to layer 1.
These _inclusion fee_ are added to execution fees in the total cost of a transaction.
Keep in mind that transactions that use more data pay a higher inclusion fee.

The base fee of the transaction (in the Ethereum `max_fee_per_gas` [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md) field) must be enough to cover all these Etherlink<!--TX--> fees.

:::note

Unlike some other chains, Etherlink EVM<!--TEVM--> does not use a voluntary gas fee, also known as a tip or priority fee, to encourage block producers to include transactions more quickly.
Because the Etherlink<!--TX--> sequencer orders transactions in first-come-first-served order, there is no need to offer higher fees for faster inclusion.

For this reason, Etherlink EVM<!--TEVM--> ignores priority fees offered with transactions in the `max_priority_fee_per_gas` field and deducts only the execution fee and the inclusion fee.
If the transaction's base fee is not enough to cover Etherlink EVM<!--TEVM-->'s fees, the transaction fails, even if the amount of the priority fee would be enough to cover the fee.

:::

## Execution fee

The execution fee changes based on the transaction throughput over time.

Etherlink EVM<!--TEVM--> measures throughput in terms of the amount of execution gas (that is, the units of computation used to execute transactions) used over time.
As demand increases and more execution gas is used in a shorter time, Etherlink EVM<!--TEVM--> increases the gas price to increase the execution fee.

Etherlink EVM<!--TEVM--> has a target amount of execution gas to use per second, referred to as the _speed limit_ or _target_.
The speed limit is currently set to 13.5 million gas units per second, exactly half of Etherlink EVM<!--TEVM-->'s capacity of 27 million gas units per second.
To calculate the throughput, Etherlink EVM<!--TEVM--> records the total execution gas used and subtracts the speed limit every second.
The remaining execution gas amount is known as the _backlog_.

In this way, if the execution gas used per second exceeds the speed limit for a certain amount of time, the backlog increases and the execution fee can go up.
If the gas used per second is below the speed limit, the backlog decreases or reaches zero and the execution fee decreases or reaches a base amount.
The backlog never goes below zero and the execution fee never goes below the base amount.

The execution fee depends on these parameters:

- `minimum_base_fee_per_gas`: The base fee for Etherlink EVM<!--TEVM--> transactions, which is 1 gwei
- `speed_limit`: The target amount of execution gas used per second
- `tolerance`: The size the backlog is allowed to grow to before the execution fee increases, which is 20 million gas units
- `backlog`: A measure of the amount of execution gas used in excess of the speed limit; Etherlink EVM<!--TEVM--> deducts the speed limit from the backlog every second
- `alpha`: A scaling factor, currently 7 * 10<sup>-9</sup>

If the backlog is less than the tolerance, the execution fee for a transaction is `minimum_base_fee_per_gas`.

If the backlog is greater than the tolerance, Etherlink EVM<!--TEVM--> calculates the execution fee with this equation:

```
execution_fee = minimum_base_fee_per_gas * e^(a * (backlog - tolerance))
```

In other words, the execution fee is the minimum fee times the exponential function of the alpha scaling factor times the backlog in excess of the tolerance.
For example, if the backlog reaches 40 million gas units (twice the tolerance), the gas price is:

```
1 gwei * e^((7 * 10^-9) * (40,000,000 - 20,000,000)) = 1.15 gwei
```

Here is a table of gas prices at different backlog levels:

Backlog amount (in gas units) | Backlog amount relative to tolerance | Gas price (gwei)
--- | --- | ---
20,000,000 or less | Less than or equal to the tolerance | 1
30,000,000 | 150% of the tolerance | 1.07
40,000,000 | 200% of the tolerance | 1.15
80,000,000 | 400% of the tolerance | 1.52
160,000,000 | 800% of the tolerance | 2.66
240,000,000 | 1200% of the tolerance | 4.66
320,000,000 | 1600% of the tolerance | 8.17

## Inclusion fee

The inclusion fee, also called the _data availability fee_, helps Etherlink EVM<!--TEVM--> cover the cost of posting data to layer 1.

The amount of the fee depends on the size of the data in the transaction (as provided by `tx.data.size()`) and the size of the access list, a list of addresses and storage keys that a transaction intends to access (as provided by `tx.access_list.size()`).

Etherlink EVM<!--TEVM--> calculates the inclusion fee with this equation:

```
inclusion_fee = 0.000004 XTZ * (150 + tx.data.size() + tx.access_list.size())
```

## Block gas limit

The block gas limit, or the maximum total amount of execution fees in a single Etherlink EVM<!--TEVM--> block, is 30 million gas units (i.e. excluding inclusion fees).
Transactions that require a higher execution fee fail.

There is no straightforward way of determining the execution fee for a transaction because the `eth_estimateGas` endpoint returns the sum of the execution fee and the inclusion fee as a single amount.
For this reason, some large transactions with a total fee higher than the gas limit may succeed because the execution fee is still less than the gas limit.

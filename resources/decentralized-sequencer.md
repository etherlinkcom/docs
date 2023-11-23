---
description: Getting up to speed on consensus state-of-the-art
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# 🕸 Decentralized Sequencer

## General Overview

* [HotStuff](https://pdos.csail.mit.edu/6.824/papers/hotstuff.pdf)&#x20;
  * [HotStuff-2](https://eprint.iacr.org/2023/397.pdf)
  * [Jolteon](https://arxiv.org/abs/2106.10362)  (-33% latency) _**\[In Production on Aptos]**_
* [Narwhal & Tusk](https://arxiv.org/abs/2105.11827)&#x20;
  * Proposes separating the task of reliable transaction dissemination from transaction ordering for performance increase
  * Originally implemented by Facebook Research, see [GitHub](https://github.com/facebookresearch/narwhal)
* [Bullshark](https://arxiv.org/abs/2201.05677) _**\[In Production on Sui]**_
  * Vanilla Bullshark = Bullshark + support for “weak links” (see section 5.1 [here](https://arxiv.org/abs/2306.03058))
* [Shoal](https://arxiv.org/abs/2306.03058)
  * A framework for higher performance for DAG consensus (Bullshark) using pipelining and leader reputation
  * Improves Bullshark latency by [40% in failure-free cases, 80% in failure cases](https://medium.com/aptoslabs/shoal-how-we-reduce-bullshark-latency-on-the-aptos-blockchain-44a600d977a1)

<figure><img src="../.gitbook/assets/etherlink_consensus.jpg" alt=""><figcaption></figcaption></figure>

## Further Reading

* [DiemBFT v4: State Machine Replication in the Diem Blockchain](https://developers.diem.com/papers/diem-consensus-state-machine-replication-in-the-diem-blockchain/2021-08-17.pdf)&#x20;
* [Narwhal and Bullshark, Sui's Mempool and Consensus Engines](https://docs.sui.io/learn/architecture/consensus)&#x20;
* [Cosmos without Tendermint: Exploring Narwhal and Bullshark](https://www.paradigm.xyz/2022/07/experiment-narwhal-bullshark-cosmos-stack)&#x20;
* [MEV Resistance on a DAG | Chainlink Blog](https://blog.chain.link/mev-resistance-on-a-dag/)&#x20;
* [Cordial Miners: Fast and Efficient Consensus for Every Eventuality](https://arxiv.org/abs/2205.09174)&#x20;

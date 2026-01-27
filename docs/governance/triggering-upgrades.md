---
title: Triggering kernel upgrades
dependencies:
  octez: 24.1
---

After a proposal wins a vote, any account can trigger the kernel upgrade by calling the appropriate governance contract's `trigger_kernel_upgrade` entrypoint:

```bash
octez-client call KT1DxndcFitAbxLdJCN3C1pPivqbC3RJxD1R from my_wallet \
  --entrypoint "trigger_kernel_upgrade" \
  --arg '"sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account or voting key
- The address of the appropriate Etherlink kernel governance contract
- The address of the Etherlink Smart Rollup; the parameter must include the double quotes

After the new kernel becomes active, bakers must provide their nodes with the preimages for the new kernel to continue to participate in Etherlink.
They can copy the new preimages into the node data directory without stopping or restarting the node.
If a node uses a preimages endpoint as described in [Running an Etherlink EVM node](/network/evm-nodes) and [Running an Etherlink Smart Rollup node](/network/smart-rollup-nodes), the node updates automatically.

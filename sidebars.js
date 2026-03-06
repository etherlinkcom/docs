/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {
  documentationSidebar: [
    {
      type: 'link',
      label: 'Etherlink',
      href: 'https://www.etherlink.com/',
    },
    {
      type: 'link',
      label: 'Testnet migration',
      href: 'https://docs.etherlink.com/network/migrating-testnet',
    },
    {
      type: 'link',
      label: 'Documentation map',
      href: 'https://docs.tezos.com/overview/resources#documentation-map',
    },
    {
      type: 'link',
      label: 'Status',
      href: 'https://status.etherlink.com',
    },
    {
      type: 'link',
      label: 'Developers',
      href: 'https://discord.com/invite/etherlink',
    },
    {
      type: 'link',
      label: 'GitLab',
      href: 'https://gitlab.com/tezos/tezos/-/tree/master/etherlink?ref_type=heads',
    },
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: [
        'index',
        'get-started/chatbot',
        'get-started/using-your-wallet',
        'get-started/sending-transactions',
        'get-started/network-information',
        'get-started/getting-testnet-tokens',
        'get-started/getting-mainnet-tokens',
      ],
    },
    {
      type: 'category',
      label: 'Tutorial',
      collapsed: false,
      items: [
        'tutorials/predictionMarket/index',
        'tutorials/predictionMarket/write-contract',
        'tutorials/predictionMarket/deploy-contract',
        'tutorials/predictionMarket/frontend',
      ],
    },
    {
      type: 'category',
      label: 'Bridging',
      collapsed: false,
      items: [
        'bridging/bridging',
        'bridging/bridging-evm',
        'bridging/bridging-tezos',
        'bridging/bridging-fa',
        'bridging/bridging-fa-how',
        'bridging/bridging-fa-transactions',
      ],
    },
    {
      type: 'category',
      label: 'Developing',
      collapsed: false,
      items: [
        'building-on-etherlink/endpoint-support',
        'building-on-etherlink/sandbox',
        'building-on-etherlink/testnet',
        'building-on-etherlink/information',
        'building-on-etherlink/estimating-fees',
        'building-on-etherlink/transactions',
        'building-on-etherlink/deploying-contracts',
        'building-on-etherlink/verifying-contracts',
        'building-on-etherlink/indexing-graph',
        'building-on-etherlink/websockets',
        'building-on-etherlink/tokens',
        'building-on-etherlink/development-toolkits',
      ],
    },
    {
      type: 'category',
      label: 'Network',
      collapsed: false,
      items: [
        'network/architecture',
        'network/fees',
        'network/operators',
        'network/smart-rollup-nodes',
        'network/evm-nodes',
        'network/building-kernel',
        'network/monitoring',
        'network/migrating-testnet',
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      collapsed: false,
      items: [
        'tools/exchanges',
        'tools/onramps',
        'tools/node-providers',
        'tools/price-feeds',
        'tools/vrf',
        'tools/data-indexers',
        'tools/cross-chain-comms',
        'tools/game-development',
        'tools/developer-experience',
        'tools/institutions',
        'tools/communication'
      ],
    },
    {
      type: 'category',
      label: 'Governance',
      collapsed: false,
      items: [
        'governance/overview',
        'governance/quickstart',
        'governance/how-is-etherlink-governed',
        'governance/voting-key',
        'governance/proposing-upgrades',
        'governance/kernel-governance',
        'governance/triggering-upgrades',
        'governance/sequencer-upgrades',
      ],
    },
    {
      type: 'category',
      label: 'Track progress',
      collapsed: false,
      items: [
        'progress/upgrades',
        'progress/changelogs',
        {
          type: 'link',
          href: 'https://gitlab.com/tezos/tezos/-/tree/master/etherlink',
          label: 'Source code',
        },
        {
          type: 'link',
          href: 'https://gitlab.com/groups/tezos/-/issues/?sort=created\_date\&state=opened\&search=EVM%20\&first\_page\_size=20',
          label: 'Pull requests',
        },
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      collapsed: false,
      items: [
        'resources/etherlink-further-reading',
        'resources/scaling-on-tezos',
      ],
    },
  ],
};

module.exports = sidebars;

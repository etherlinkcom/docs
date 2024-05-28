/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {
  documentationSidebar: [
    {
      type: 'category',
      label: 'Welcome 👋',
      collapsed: false,
      collapsible: false,
      items: [
        'index',
        {
          type: 'link',
          href: 'https://discord.gg/etherlink',
          label: 'Join our Discord',
        },
        {
          type: 'link',
          href: 'https://twitter.com/etherlink',
          label: 'Follow us on Twitter',
        },
      ],
    },
    {
      type: 'category',
      label: 'Get Started 🚀',
      collapsed: false,
      collapsible: false,
      items: [
        'get-started/using-your-wallet',
        'get-started/on-ramping',
        {
          type: 'link',
          href: 'https://explorer.etherlink.com',
          label: 'Block Explorer',
        },
      ],
    },
    {
      type: 'category',
      label: 'Building on Etherlink ⛓',
      collapsed: false,
      collapsible: false,
      items: [
        'building-on-etherlink/networks-and-public-rpc-endpoints',
        'building-on-etherlink/etherlink-node-specifications',
        'building-on-etherlink/token-addresses',
        'building-on-etherlink/development-toolkits',
      ],
    },
    {
      type: 'category',
      label: '🛜 The Etherlink network',
      collapsed: false,
      collapsible: false,
      items: [
        'network/architecture',
        'network/smart-rollup-nodes',
        'network/evm-nodes',
        'network/building-kernel',
      ],
    },
    {
      type: 'category',
      label: '🔨 Tools',
      collapsed: false,
      collapsible: false,
      items: [
        'tools/node-providers',
        'tools/price-feeds',
        'tools/vrf',
        'tools/data-indexers',
        'tools/cross-chain-comms',
        'tools/developer-experience',
        'tools/institutions'
      ],
    },
    {
      type: 'category',
      label: 'Governance 🧑‍⚖️',
      collapsed: false,
      collapsible: false,
      items: [
        'governance/how-is-etherlink-governed',
        'governance/how-do-i-participate-in-governance',
      ],
    },
    {
      type: 'category',
      label: 'Track Etherlink\'s Progress 🏁',
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: 'link',
          href: 'https://gitlab.com/tezos/tezos/-/tree/master/etherlink',
          label: 'Etherlink Source Code',
        },
        {
          type: 'link',
          href: 'https://gitlab.com/groups/tezos/-/issues/?sort=created\_date\&state=opened\&search=EVM%20\&first\_page\_size=20',
          label: 'Etherlink Pull Requests',
        },
      ],
    },
    {
      type: 'category',
      label: 'Resources 📚',
      collapsed: false,
      collapsible: false,
      items: [
        'resources/etherlink-further-reading',
        'resources/scaling-on-tezos',
      ],
    },
  ],
};

module.exports = sidebars;

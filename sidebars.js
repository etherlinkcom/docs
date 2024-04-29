/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {
  documentationSidebar: [
    {
      type: 'category',
      label: '👋 Welcome',
      collapsed: false,
      collapsible: false,
      items: [
        'index',
        {
          type: 'link',
          href: 'https://discord.gg/etherlink',
          label: '👉 Join our Discord',
        },
        {
          type: 'link',
          href: 'https://twitter.com/etherlink',
          label: '👉 Follow us on Twitter',
        },
      ],
    },
    {
      type: 'category',
      label: '🚀 Get Started',
      collapsed: false,
      collapsible: false,
      items: [
        'get-started/connect-your-wallet-to-etherlink',
        'get-started/get-testnet-xtz-on-etherlink',
      ],
    },
    {
      type: 'category',
      label: '⛓ Building on Etherlink',
      collapsed: false,
      collapsible: false,
      items: [
        'developer-tools/networks-and-public-rpc-endpoints',
        'developer-tools/etherlink-node-specifications',
        'developer-tools/development-toolkits',
        {
          type: 'link',
          href: 'https://testnet-explorer.etherlink.com/',
          label: '🔍 Etherlink Explorer',
        },
      ],
    },
    {
      type: 'category',
      label: '🧑‍⚖️ Governance',
      collapsed: false,
      collapsible: false,
      items: [
        'governance/how-is-etherlink-governed',
        'governance/how-do-i-participate-in-governance',
      ],
    },
    {
      type: 'category',
      label: '🏁 Track Etherlink\'s Progress',
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: 'link',
          href: 'https://gitlab.com/tezos/tezos/-/tree/master/etherlink',
          label: '🧙 Etherlink Source Code',
        },
        {
          type: 'link',
          href: 'https://gitlab.com/groups/tezos/-/issues/?sort=created\_date\&state=opened\&search=EVM%20\&first\_page\_size=20',
          label: '🔨 Etherlink Pull Requests',
        },
      ],
    },
    {
      type: 'category',
      label: '📚 Resources',
      collapsed: false,
      collapsible: false,
      items: [
        'resources/etherlink-further-reading',
        'resources/decentralized-sequencer',
        'resources/scaling-on-tezos',
      ],
    },
  ],
};

module.exports = sidebars;

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
      label: 'Overview',
      collapsed: false,
      items: [
        'overview/index',
        'overview/get-started',
        'overview/architecture',
        'overview/native-atomic-composability',
        'overview/accounts-and-aliases',
        'overview/blocks-and-blueprints',
        'overview/fee-structure',
        'overview/resources',
        'overview/chatbot',
        'overview/glossary',
      ],
    },
    {
      type: 'category',
      label: 'EVM Interface',
      items: [
        'evm/index',
        {
          type: 'category',
          label: 'Getting started',
          link: {
            type: 'doc',
            id: 'evm/getting-started',
          },
          items: [
            'evm/get-started/using-your-wallet',
            'evm/get-started/network-information',
            'evm/get-started/getting-testnet-tokens',
            'evm/get-started/getting-mainnet-tokens',
            'evm/get-started/sending-transactions',
          ],
        },
        'evm/nac-usage',
        {
          type: 'category',
          label: 'Bridging',
          items: [
            'evm/bridging/bridging',
            'evm/bridging/bridging-evm',
            'evm/bridging/bridging-tezos',
            'evm/bridging/bridging-fa',
            'evm/bridging/bridging-fa-how',
            'evm/bridging/bridging-fa-transactions',
          ],
        },
        {
          type: 'category',
          label: 'Developing',
          items: [
            'evm/developing/compatibility',
            'evm/developing/endpoint-support',
            'evm/developing/information',
            'evm/developing/fees',
            'evm/developing/estimating-fees',
            'evm/developing/transactions',
            'evm/developing/deploying-contracts',
            'evm/developing/verifying-contracts',
            'evm/developing/indexing-graph',
            'evm/developing/websockets',
            'evm/developing/tokens',
            'evm/developing/development-toolkits',
          ],
        },
        {
          type: 'category',
          label: 'Tools',
          items: [
            'evm/tools/exchanges',
            'evm/tools/onramps',
            'evm/tools/node-providers',
            'evm/tools/price-feeds',
            'evm/tools/vrf',
            'evm/tools/data-indexers',
            'evm/tools/cross-chain-comms',
            'evm/tools/game-development',
            'evm/tools/developer-experience',
            'evm/tools/institutions',
            'evm/tools/communication',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Michelson Interface',
      items: [
        'michelson/index',
        {
          type: 'category',
          label: 'Getting started',
          link: {
            type: 'doc',
            id: 'michelson/getting-started',
          },
          items: [
            'michelson/wallet-support',
            'michelson/network-information',
            'michelson/relayer',
          ],
        },
        'michelson/nac-usage',
        'michelson/self-address',
        'michelson/bridging',
        {
          type: 'category',
          label: 'Developing',
          items: [
            'michelson/developing/compatibility',
            'michelson/developing/accounts',
            'michelson/developing/tokens',
            'michelson/developing/smart-contracts',
            'michelson/developing/rpc-reference',
          ],
        },
        {
          type: 'category',
          label: 'Tools',
          items: [
            'michelson/tools/dapps',
            'michelson/tools/tezos-unity-sdk',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      items: [
        'testing/sandbox',
        'testing/testnet',
        'testing/previewnet',
        'testing/migrating-testnet'
      ],
    },
    {
      type: 'category',
      label: 'Running the Network',
      items: [
        'network/architecture',
        'network/operators',
        'network/smart-rollup-nodes',
        'network/evm-nodes',
        'network/building-kernel',
        'network/monitoring',
      ],
    },
    {
      type: 'category',
      label: 'Governance',
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
      label: 'Tutorials',
      link: {
        type: 'doc',
        id: 'tutorials/index',
      },
      items: [
        {
          type: 'category',
          label: 'Prediction market',
          link: {
            type: 'doc',
            id: 'tutorials/predictionMarket/index',
          },
          items: [
            'tutorials/predictionMarket/write-contract',
            'tutorials/predictionMarket/deploy-contract',
            'tutorials/predictionMarket/frontend',
          ],
        },
        'tutorials/nac-counter',
        {
          type: 'category',
          label: 'Advanced Examples',
          link: {
            type: 'doc',
            id: 'examples/index',
          },
          items: [
            'examples/potluck-game',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Track Progress',
      items: [
        'progress/upgrades',
        'progress/changelogs',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/etherlink-further-reading',
        'resources/scaling-on-tezos',
      ],
    },
  ],
};

module.exports = sidebars;

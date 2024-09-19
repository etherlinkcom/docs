// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const math = require('remark-math');
const katex = require('rehype-katex');
require('dotenv').config();

// script-src causes development builds to fail
// But unsafe-eval should NOT be in production builds
// Also, put GTM first because sometimes the ';' in the escaped single quotes causes the browser to think it's the end
const scriptSrc = process.env.NODE_ENV === 'development' ?
  `https://*.googletagmanager.com https://cdn.jsdelivr.net 'self' 'unsafe-inline' 'unsafe-eval'`
  : `https://*.googletagmanager.com https://cdn.jsdelivr.net 'self' 'unsafe-inline'`;

const contentSecurityPolicy = `
default-src 'none';
base-uri 'self';
manifest-src 'self';
script-src ${scriptSrc};
style-src https://cdn.jsdelivr.net https://fonts.googleapis.com 'self' 'unsafe-inline';
font-src https://cdn.jsdelivr.net https://fonts.gstatic.com 'self';
img-src 'self' https://*.googletagmanager.com https://*.google-analytics.com data:;
media-src 'self';
form-action 'self';
connect-src 'self' https://node.mainnet.etherlink.com https://node.ghostnet.etherlink.com https://ethereum.rpc.thirdweb.com https://*.algolia.net https://*.algolianet.com https://c.thirdweb.com https://app.pushfeedback.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;
frame-src https://tezosbot.vercel.app https://*.loom.com;`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Etherlink documentation',
  tagline: 'Etherlink builds on the decentralisation of L1 Tezos to provide an EVM-compatible solution with distributed sequencing.',
  favicon: '/img/favicon.svg',
  url: 'https://docs.etherlink.com',
  baseUrl: '/',
  organizationName: 'etherlinkcom',
  projectName: 'docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },

  customFields: {
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Content-Security-Policy',
        content: contentSecurityPolicy,
      },
    },
  ],

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve the docs at the site's root
          remarkPlugins: [math],
          rehypePlugins: [katex],
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleTagManager: {
          containerId: 'G-Z575XCDLCX',
        },
      }),
    ],
  ],

  plugins: [
    'plugin-image-zoom',
    'docusaurus-node-polyfills',
    [
      'docusaurus-pushfeedback', {
        project: 'zh2wgyi1d7',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        // style: 'primary',
        // title: 'Etherlink documentation',
        // logo: {
        //   alt: 'Etherlink developer documentation',
        //   src: '/img/Etherlink-Docs-Logo.svg',
        // },
        items: [
          {
            type: 'search',
            position: 'left'
          },
          {
            to: 'https://x.com/etherlink',
            position: 'right',
            target: '_blank',
            className: 'x-link',
          },
          {
            to: 'https://discord.gg/etherlink',
            position: 'right',
            target: '_blank',
            className: 'discord-link',
          },
        ],
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
        additionalLanguages: ['solidity'],
      },
      // https://github.com/flexanalytics/plugin-image-zoom
      // Enable click to zoom in to large images
      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          scrollOffset: 0,
        },
      },
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID || "PM6ZQ764IP",
        // Public API key: it is safe to commit it
        apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY || "c652d71679eec3859b7064047793bab2",
        indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME || "etherlink",
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },
        // Optional: Algolia search parameters
        // searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: false,
        disableUserPersonalization: true,
        //... other Algolia params
      },
    }),
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;

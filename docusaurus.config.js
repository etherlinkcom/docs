// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Etherlink documentation',
  tagline: 'Etherlink builds on the decentralisation of L1 Tezos to provide an EVM-compatible solution with distributed sequencing.',
  favicon: 'img/favicon.ico',
  url: 'https://docs.etherlink.com',
  baseUrl: '/docs/',
  organizationName: 'etherlinkcom',
  projectName: 'docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },

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
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        style: 'primary',
        title: 'Etherlink documentation',
        logo: {
          alt: 'Etherlink developer documentation',
          src: '/img/logo-tezos.svg',
        },
        items: [
          {
            href: 'https://github.com/etherlinkcom/docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
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

    }),
  stylesheets: [
    {
      href: '/css/katex.min.css',
      type: 'text/css',
    },
  ],
};

module.exports = config;

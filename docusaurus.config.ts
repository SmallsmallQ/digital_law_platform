import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '数字法治知识平台',
  tagline: '连接理论研究、法律实践与技术交叉议题',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://lawstudy.wiki',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SmallsmallQ',
  projectName: 'digital_law_platform',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            'https://github.com/SmallsmallQ/digital_law_platform/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '数字法治知识平台',
      logo: {
        alt: '数字法治知识平台 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'overviewSidebar',
          position: 'left',
          label: '平台导览',
        },
        {
          type: 'docSidebar',
          sidebarId: 'theorySidebar',
          position: 'left',
          label: '理论研究',
        },
        {
          type: 'docSidebar',
          sidebarId: 'practiceSidebar',
          position: 'left',
          label: '法律实践',
        },
        {
          type: 'docSidebar',
          sidebarId: 'technologySidebar',
          position: 'left',
          label: '技术交叉',
        },
        {
          type: 'docSidebar',
          sidebarId: 'authoritySidebar',
          position: 'left',
          label: '权威动态',
        },
        {
          to: '/article-builder',
          position: 'left',
          label: '写作工具',
        },
        {
          href: 'https://github.com/SmallsmallQ/digital_law_platform',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '知识库',
          items: [
            {
              label: '平台导览',
              to: '/docs/intro',
            },
            {
              label: '理论研究',
              to: '/docs/theory/',
            },
            {
              label: '法律实践',
              to: '/docs/practice/',
            },
            {
              label: '技术交叉',
              to: '/docs/technology/',
            },
            {
              label: '权威动态',
              to: '/docs/authority/',
            },
          ],
        },
        {
          title: '平台说明',
          items: [
            {
              label: '项目定位',
              to: '/docs/intro',
            },
            {
              label: '平台结构',
              to: '/docs/intro#网站整体结构',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '理论研究',
              to: '/docs/theory/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/SmallsmallQ/digital_law_platform',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 数字法治知识平台. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;

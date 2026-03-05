import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'lawstudy.wiki',
  tagline: '数字法治平台：连接理论研究、法律实践与技术交叉议题',
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
  organizationName: 'lawstudy-wiki',
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
          editUrl:
            'https://github.com/lawstudy-wiki/digital_law_platform/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/lawstudy-wiki/digital_law_platform/edit/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
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
      title: 'lawstudy.wiki',
      logo: {
        alt: 'lawstudy.wiki Logo',
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
        {to: '/blog', label: '更新', position: 'left'},
        {
          href: 'https://github.com/lawstudy-wiki/digital_law_platform',
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
              label: '更新日志',
              to: '/blog',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '更新',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/lawstudy-wiki/digital_law_platform',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} lawstudy.wiki. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

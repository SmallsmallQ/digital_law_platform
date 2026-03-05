import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  overviewSidebar: [
    'intro',
  ],

  theorySidebar: [
    'theory/index',
    {
      type: 'category',
      label: '数字法学词典',
      items: [
        'theory/glossary/index',
        'theory/glossary/data-rights',
      ],
    },
    {
      type: 'category',
      label: '经典文献',
      items: [
        'theory/classic-literature/index',
        'theory/classic-literature/platform-governance-review',
      ],
    },
    {
      type: 'category',
      label: '专题研究',
      items: [
        'theory/digital-governance',
        'theory/algorithm-governance',
      ],
    },
  ],

  practiceSidebar: [
    'practice/index',
    {
      type: 'category',
      label: '法规体系',
      items: [
        'practice/law-system/index',
        'practice/law-system/data-protection-law',
      ],
    },
    {
      type: 'category',
      label: '典型案例',
      items: [
        'practice/cases/index',
        'practice/cases/platform-liability-case',
      ],
    },
    {
      type: 'category',
      label: '监管动态',
      items: [
        'practice/regulation-updates/index',
        'practice/regulation-updates/ai-regulation-tracker',
      ],
    },
  ],

  technologySidebar: [
    'technology/index',
    {
      type: 'category',
      label: '人工智能',
      items: [
        'technology/ai/index',
        'technology/ai/ai-and-law',
      ],
    },
    {
      type: 'category',
      label: '数据治理技术',
      items: [
        'technology/data-governance-tech/index',
        'technology/data-governance-tech/privacy-computing',
      ],
    },
    {
      type: 'category',
      label: '区块链与可信技术',
      items: [
        'technology/blockchain-trust-tech/index',
        'technology/blockchain-trust-tech/smart-contract-risk',
      ],
    },
  ],
};

export default sidebars;

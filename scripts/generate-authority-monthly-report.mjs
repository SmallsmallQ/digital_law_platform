import {access, mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, 'docs', 'authority');

function parseArgs(argv) {
  const args = {month: '', force: false};
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === '--month' && argv[index + 1]) {
      args.month = argv[index + 1];
      index += 1;
    }
    if (current === '--force') {
      args.force = true;
    }
  }
  return args;
}

function getPreviousMonthString() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const previous = new Date(Date.UTC(year, month - 1, 1));
  const yyyy = previous.getUTCFullYear();
  const mm = String(previous.getUTCMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

function validateMonth(month) {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`month 参数格式错误，应为 YYYY-MM，收到: ${month}`);
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'digital-law-platform-monthly-bot/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`抓取失败: ${url} (${response.status})`);
  }
  return response.text();
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'digital-law-platform-monthly-bot/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`抓取失败: ${url} (${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function fetchCssnPages() {
  const urls = [
    'https://www.cssn.cn/fx/szfx/',
    'https://www.cssn.cn/fx/szfx/index_1.shtml',
    'https://www.cssn.cn/fx/szfx/index_2.shtml',
    'https://www.cssn.cn/fx/szfx/index_3.shtml',
  ];

  const pages = await Promise.all(
    urls.map(async (url) => {
      try {
        return await fetchText(url);
      } catch {
        return '';
      }
    }),
  );

  return pages.filter(Boolean).join('\n');
}

function extractCssnArticleLinks(html, month) {
  const compactMonth = month.replace('-', '');
  const tailRegex = /(\d{6}\/t\d+_\d+\.shtml)/g;
  const seen = new Set();
  const links = [];
  let matched = tailRegex.exec(html);

  while (matched) {
    const tail = matched[1];
    if (!tail.startsWith(compactMonth)) {
      matched = tailRegex.exec(html);
      continue;
    }

    const url = `https://www.cssn.cn/fx/szfx/${tail}`;
    if (!seen.has(url)) {
      seen.add(url);
      links.push(url);
    }
    matched = tailRegex.exec(html);
  }

  return links.slice(0, 8);
}

function decodeUtf8(bytes) {
  return bytes.toString('utf8');
}

function extractTitleFromArticle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (h1) {
    return stripHtml(h1);
  }
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (!title) return '';
  return stripHtml(title).replace(/[-_|｜].*$/, '').trim();
}

function extractDateFromArticle(html) {
  const date = html.match(/(\d{4}-\d{2}-\d{2})/);
  return date?.[1] || '';
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&ensp;|&emsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCssnItems(html, month) {
  const regex = /<a[^>]*href=['"]([^'"]*\/fx\/[^'"]*t\d+_\d+\.shtml)['"][^>]*>(.*?)<\/a>/g;
  const result = [];
  const seen = new Set();
  let matched = regex.exec(html);

  while (matched) {
    const href = matched[1];
    const title = stripHtml(matched[2]);
    const nearby = html.slice(matched.index, matched.index + 900);
    const dateMatch = nearby.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch?.[1] || '';
    if (date && date.startsWith(month)) {
      const link = href.startsWith('http') ? href : `https://www.cssn.cn${href}`;
      const key = `${title}|${link}|${date}`;
      if (!seen.has(key) && title) {
        seen.add(key);
        result.push({title, link, date});
      }
    }
    matched = regex.exec(html);
  }

  return result.slice(0, 8);
}

async function collectCssnItems(month) {
  const pagesHtml = await fetchCssnPages();
  const links = extractCssnArticleLinks(pagesHtml, month);

  const items = [];
  for (const link of links) {
    try {
      const bytes = await fetchBytes(link);
      const html = decodeUtf8(bytes);
      const title = extractTitleFromArticle(html);
      const date = extractDateFromArticle(html) || `${month}-01`;
      if (!title) continue;
      items.push({title, link, date});
    } catch {
      // 单条失败时跳过，保持整体任务可用
    }
  }

  return items.slice(0, 8);
}

function buildMarkdown(month, cssnItems) {
  const [year, monthNumber] = month.split('-');
  const title = `数字法治权威动态月报（${year}年${Number(monthNumber)}月）`;

  const cssnSection = cssnItems.length
    ? cssnItems
        .map((item, index) => {
          const number = index + 1;
          return [`### ${number}. ${item.title}`, '', `- 来源机构：中国社会科学网（法学频道）`, `- 发布时间：${item.date}`, `- 原文链接：${item.link}`, `- 观察要点：`, `  - （待补充）请根据原文提炼2-3条核心观点。`, ''].join('\n');
        })
        .join('\n')
    : '本月暂未自动抓取到中国社科网符合条件条目，请手动补充。\n';

  return `---
slug: /authority/authority-brief-${month}
sidebar_position: 2
---

# ${title}

## 使用说明

本页由月报脚本自动生成初稿，请在发布前完成“观察要点”补充与来源核验。

## 本月抓取流程（固定）

1. 政策监管：国家网信办（https://www.cac.gov.cn/）
2. 司法动态：最高人民法院（https://www.court.gov.cn/）
3. 学术研究：中国社会科学网数字法学频道（https://www.cssn.cn/fx/szfx/）
4. 法规入口：中国政府网政策/法规/规章库（https://www.gov.cn/zhengce/index.htm）

## 一、监管与治理动态（待补充）

- 请补充 3-5 条官方动态：标题、发布日期、链接、2-3条要点。

## 二、司法与网络治理动态（待补充）

- 请补充 1-3 条司法发布：标题、发布日期、链接、2-3条要点。

## 三、学术研究动态（中国社科网）

> 来源频道：https://www.cssn.cn/fx/szfx/

${cssnSection}

## 四、权威检索入口（长期可用）

- 中国政府网：政策主页
  - https://www.gov.cn/zhengce/index.htm
- 中国政府网：国家行政法规库
  - https://www.gov.cn/zhengce/xzfgk/
- 中国政府网：国家规章库
  - https://www.gov.cn/zhengce/xxgk/gjgzk/
- 中央网信办（国家互联网信息办公室）
  - https://www.cac.gov.cn/
- 最高人民法院
  - https://www.court.gov.cn/
`;
}

async function updateAuthorityIndex(month) {
  const indexPath = path.join(docsDir, 'index.md');
  const file = await readFile(indexPath, 'utf8');
  const reportLink = `- [${month} 月报](./authority-brief-${month}.md)`;
  if (file.includes(reportLink)) {
    return;
  }

  const marker = '## 更新频率';
  if (!file.includes(marker)) {
    return;
  }

  const appendBlock = `\n## 月报列表\n\n${reportLink}\n`;
  const updated = `${file}${appendBlock}`;
  await writeFile(indexPath, updated, 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const month = args.month || getPreviousMonthString();
  validateMonth(month);

  await mkdir(docsDir, {recursive: true});

  const cssnItems = await collectCssnItems(month);

  const outputPath = path.join(docsDir, `authority-brief-${month}.md`);
  if (!args.force) {
    try {
      await access(outputPath);
      console.log(`已存在月报文件，跳过覆盖：docs/authority/authority-brief-${month}.md`);
      console.log('如需覆盖，请追加 --force');
      return;
    } catch {
      // 文件不存在，继续生成
    }
  }

  const markdown = buildMarkdown(month, cssnItems);
  await writeFile(outputPath, markdown, 'utf8');

  await updateAuthorityIndex(month);

  console.log(`已生成月报初稿：docs/authority/authority-brief-${month}.md`);
  console.log(`社科网自动抓取条目：${cssnItems.length} 条`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

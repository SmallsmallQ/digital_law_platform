import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';

const TEMPLATE_DIR = 'article-templates';
const TEMPLATE_INDEX = {
  article: 'article.yaml',
  'classic-term-wiki': 'classic-term-wiki.yaml',
  regulation: 'regulation.yaml',
  'article-share': 'article-share.yaml',
};

function parseArgs(argv) {
  const args = {force: false, template: 'article'};
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === '--config' || current === '-c') {
      args.config = argv[index + 1];
      index += 1;
    } else if (current === '--force' || current === '-f') {
      args.force = true;
    } else if (current === '--init') {
      args.init = argv[index + 1] ?? 'article.config.yaml';
      if (argv[index + 1]) index += 1;
    } else if (current === '--template' || current === '-t') {
      args.template = argv[index + 1] ?? 'article';
      if (argv[index + 1]) index += 1;
    } else if (current === '--list-templates') {
      args.listTemplates = true;
    }
  }
  return args;
}

function usage() {
  console.log('用法:');
  console.log('  npm run article:new -- --list-templates');
  console.log('  npm run article:new -- --init [文件名] --template <模板名>');
  console.log('  npm run article:new -- --config <yaml文件> [--force]');
}

async function readTemplateContent(templateName) {
  const templateFile = TEMPLATE_INDEX[templateName];
  if (!templateFile) {
    const available = Object.keys(TEMPLATE_INDEX).join(', ');
    throw new Error(`未知模板: ${templateName}。可选模板: ${available}`);
  }
  const templatePath = path.resolve(process.cwd(), TEMPLATE_DIR, templateFile);
  return fs.readFile(templatePath, 'utf8');
}

function printTemplates() {
  console.log('可用模板:');
  console.log('  article             通用文章模板');
  console.log('  classic-term-wiki   经典理论（名词）Wiki模板');
  console.log('  regulation          法规解读模板');
  console.log('  article-share       文章分享模板');
}

function normalizeKeywords(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim());
  return String(value)
    .split(/[,，;；]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return [String(value).trim()].filter(Boolean);
}

function buildMarkdown(config) {
  const frontMatter = config.frontMatter ?? {};
  const lines = [];

  if (Object.keys(frontMatter).length > 0) {
    lines.push('---');
    lines.push(yaml.dump(frontMatter, {lineWidth: -1}).trimEnd());
    lines.push('---');
    lines.push('');
  }

  lines.push(`# ${config.title}`);
  lines.push('');

  const meta = config.meta ?? {};
  if (Object.keys(meta).length > 0) {
    lines.push('## 文献信息');
    lines.push('');
    for (const [key, value] of Object.entries(meta)) {
      lines.push(`- ${key}：${value}`);
    }
    lines.push('');
  }

  if (config.abstract) {
    lines.push('## 摘要');
    lines.push('');
    lines.push(String(config.abstract).trim());
    lines.push('');
  }

  const keywords = normalizeKeywords(config.keywords);
  if (keywords.length > 0) {
    lines.push('## 关键词');
    lines.push('');
    for (const keyword of keywords) {
      lines.push(`- ${keyword}`);
    }
    lines.push('');
  }

  const toc = toList(config.toc);
  if (toc.length > 0) {
    lines.push('## 目录');
    lines.push('');
    for (const heading of toc) {
      lines.push(`- ${heading}`);
    }
    lines.push('');
  }

  const sections = Array.isArray(config.sections) ? config.sections : [];
  if (sections.length > 0) {
    for (const section of sections) {
      if (!section || !section.heading) continue;
      lines.push(`## ${String(section.heading).trim()}`);
      lines.push('');
      lines.push((section.body ? String(section.body) : '待补充').trim());
      lines.push('');
    }
  } else if (toc.length > 0) {
    for (const heading of toc) {
      lines.push(`## ${heading}`);
      lines.push('');
      lines.push('待补充');
      lines.push('');
    }
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.listTemplates) {
    printTemplates();
    return;
  }

  if (args.init) {
    const templatePath = path.resolve(process.cwd(), args.init);
    const templateContent = await readTemplateContent(args.template);
    await fs.writeFile(templatePath, templateContent, 'utf8');
    console.log(`已创建模板配置: ${templatePath}`);
    console.log(`已使用模板: ${args.template}`);
    return;
  }

  if (!args.config) {
    usage();
    process.exitCode = 1;
    return;
  }

  const configPath = path.resolve(process.cwd(), args.config);
  const raw = await fs.readFile(configPath, 'utf8');
  const config = yaml.load(raw);

  if (!config || typeof config !== 'object') {
    throw new Error('配置文件为空或格式错误');
  }

  if (!config.output || !config.title) {
    throw new Error('配置缺少必填字段: output, title');
  }

  const outputPath = path.resolve(process.cwd(), String(config.output));
  const outputDir = path.dirname(outputPath);

  await fs.mkdir(outputDir, {recursive: true});

  if (!args.force) {
    try {
      await fs.access(outputPath);
      throw new Error(`目标文件已存在: ${outputPath}，如需覆盖请增加 --force`);
    } catch (error) {
      if (error && error.code !== 'ENOENT') throw error;
    }
  }

  const markdown = buildMarkdown(config);
  await fs.writeFile(outputPath, markdown, 'utf8');
  console.log(`文章已生成: ${outputPath}`);
}

main().catch((error) => {
  console.error('生成失败:', error.message);
  process.exitCode = 1;
});

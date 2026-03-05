import type {ReactNode} from 'react';
import {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './article-builder.module.css';

type TemplatePreset = {
  label: string;
  outputDir: string;
  slugPrefix: string;
  title: string;
  abstract: string;
  keywords: string;
  meta: string;
  content: string;
};

const PRESETS: Record<string, TemplatePreset> = {
  article: {
    label: '通用文章',
    outputDir: 'docs/theory/classic-literature/digital',
    slugPrefix: '/theory/classic-literature',
    title: '示例文章标题',
    abstract: '这里填写摘要。',
    keywords: '数字法学\n理论研究',
    meta: '发表信息: 发表于《期刊名称》2026年第1期\n作者: 张三\n文章下载链接: 待补充',
    content: '## 一、问题的提出\n\n这里填写正文第一部分。\n\n## 二、核心观点\n\n这里填写正文第二部分。\n\n## 结语\n\n这里填写结语。\n',
  },
  'classic-term-wiki': {
    label: '经典理论（名词）Wiki',
    outputDir: 'docs/theory/glossary',
    slugPrefix: '/theory/glossary',
    title: '术语名称（中英文）',
    abstract: '用 2-4 句话说明该术语是什么、为何重要。',
    keywords: '术语\n数字法学',
    meta: '所属领域: 经典理论（名词）\n版本: v1.0\n最后更新: 2026-03-05',
    content: '## 一、定义\n\n给出简明定义，并说明适用语境。\n\n## 二、规范基础\n\n列出相关法律规范、政策或理论来源。\n\n## 三、争议焦点\n\n说明不同观点及其分歧。\n\n## 四、相关概念\n\n关联近义/对比概念。\n\n## 五、参考资料\n\n- 文献1\n- 文献2\n',
  },
  regulation: {
    label: '法规解读',
    outputDir: 'docs/practice/law-system',
    slugPrefix: '/practice/law-system',
    title: '法规名称（解读）',
    abstract: '概括法规核心目标、调整对象和制度变化。',
    keywords: '法规解读\n合规',
    meta: '发布机关: 待补充\n生效日期: 待补充\n适用范围: 待补充',
    content: '## 一、出台背景\n\n概述政策背景与治理目标。\n\n## 二、核心条款\n\n按条款分点提炼关键规则。\n\n## 三、合规要点\n\n列出主体义务、风险点、红线条款。\n\n## 四、实务影响\n\n对企业、平台、监管、司法的影响。\n\n## 五、实施建议\n\n给出可执行的合规动作清单。\n',
  },
  'article-share': {
    label: '文章分享',
    outputDir: 'docs/theory/classic-literature/shares',
    slugPrefix: '/theory/classic-literature',
    title: '文章标题（分享）',
    abstract: '用 3-5 句话说明本文核心观点与价值。',
    keywords: '文章分享\n理论研究',
    meta: '来源: 期刊/公众号/会议\n作者: 待补充\n年份: 2026\n链接: 待补充',
    content: '## 一、文章概览\n\n介绍研究问题、研究对象与主要结论。\n\n## 二、核心观点提炼\n\n以要点列表提炼关键论点。\n\n## 三、方法与证据\n\n说明作者使用的方法、数据和论证路径。\n\n## 四、启发与批评\n\n写你对本文的评价与可改进之处。\n\n## 五、延伸阅读\n\n- 推荐文献1\n- 推荐文献2\n',
  },
};

function slugify(input: string): string {
  const value = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  if (value) return value;
  const now = new Date();
  return `post-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
}

function parseMeta(metaRaw: string): Array<{key: string; value: string}> {
  return metaRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(':');
      if (separator === -1) return {key: line, value: ''};
      return {
        key: line.slice(0, separator).trim(),
        value: line.slice(separator + 1).trim(),
      };
    })
    .filter((item) => item.key);
}

function buildMarkdown(options: {
  title: string;
  slug: string;
  sidebarPosition: number;
  abstract: string;
  keywordsRaw: string;
  metaRaw: string;
  content: string;
}) {
  const keywords = options.keywordsRaw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const meta = parseMeta(options.metaRaw);

  const lines: string[] = [];
  lines.push('---');
  lines.push(`slug: ${options.slug}`);
  lines.push(`sidebar_position: ${options.sidebarPosition}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${options.title}`);
  lines.push('');
  lines.push('## 文献信息');
  lines.push('');
  meta.forEach((item) => lines.push(`- ${item.key}：${item.value || '待补充'}`));
  lines.push('');
  lines.push('## 摘要');
  lines.push('');
  lines.push(options.abstract || '待补充');
  lines.push('');
  lines.push('## 关键词');
  lines.push('');
  keywords.forEach((item) => lines.push(`- ${item}`));
  lines.push('');
  lines.push(options.content.trim());
  lines.push('');
  return `${lines.join('\n').trimEnd()}\n`;
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ArticleBuilder(): ReactNode {
  const [templateKey, setTemplateKey] = useState<keyof typeof PRESETS>('article');
  const [title, setTitle] = useState(PRESETS.article.title);
  const [abstract, setAbstract] = useState(PRESETS.article.abstract);
  const [keywordsRaw, setKeywordsRaw] = useState(PRESETS.article.keywords);
  const [metaRaw, setMetaRaw] = useState(PRESETS.article.meta);
  const [content, setContent] = useState(PRESETS.article.content);
  const [sidebarPosition, setSidebarPosition] = useState(10);
  const [status, setStatus] = useState('');

  const preset = PRESETS[templateKey];
  const slugSegment = useMemo(() => slugify(title), [title]);
  const slug = `${preset.slugPrefix}/${slugSegment}`;
  const outputPath = `${preset.outputDir}/${slugSegment}.md`;

  const markdown = useMemo(
    () =>
      buildMarkdown({
        title,
        slug,
        sidebarPosition,
        abstract,
        keywordsRaw,
        metaRaw,
        content,
      }),
    [title, slug, sidebarPosition, abstract, keywordsRaw, metaRaw, content],
  );

  async function handleSubmitWrite() {
    try {
      const response = await fetch('http://localhost:4310/api/write-article', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({outputPath, content: markdown, overwrite: true}),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || '写入失败');
      }

      setStatus(`已写入：${outputPath}`);
    } catch (error) {
      setStatus('提交失败：请先运行 npm run article:server');
    }
  }

  return (
    <Layout title="写作工具" description="可视化填写并直接生成文章文件">
      <main className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <Heading as="h1">写作工具</Heading>
            <p className={styles.muted}>聚焦写作：填写标题与正文，路径自动生成，一键提交落盘。</p>
          </div>

          <div className={styles.layout}>
            <section className={styles.panel}>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>模板</label>
                  <select
                    className="input"
                    value={templateKey}
                    onChange={(event) => {
                      const next = event.target.value as keyof typeof PRESETS;
                      setTemplateKey(next);
                      setTitle(PRESETS[next].title);
                      setAbstract(PRESETS[next].abstract);
                      setKeywordsRaw(PRESETS[next].keywords);
                      setMetaRaw(PRESETS[next].meta);
                      setContent(PRESETS[next].content);
                      setStatus('');
                    }}>
                    {Object.entries(PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>标题</label>
                  <input className="input" placeholder="请输入文章标题" value={title} onChange={(event) => setTitle(event.target.value)} />
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>关键词（每行一个）</label>
                  <textarea className="input" rows={4} value={keywordsRaw} onChange={(event) => setKeywordsRaw(event.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>摘要</label>
                  <textarea className="input" rows={4} value={abstract} onChange={(event) => setAbstract(event.target.value)} />
                </div>
              </div>

              <div className={styles.field}>
                <label>文献信息（每行：键: 值）</label>
                <textarea className="input" rows={4} placeholder="例如：作者: 张三" value={metaRaw} onChange={(event) => setMetaRaw(event.target.value)} />
              </div>

              <div className={styles.field}>
                <label>正文 Markdown</label>
                <textarea className={`input ${styles.editor}`} placeholder="在这里直接写正文..." value={content} onChange={(event) => setContent(event.target.value)} />
              </div>

              <div className={styles.actions}>
                <button className="button button--primary" type="button" onClick={handleSubmitWrite}>提交写入项目</button>
                <button className="button button--secondary" type="button" onClick={() => navigator.clipboard.writeText(markdown)}>复制正文</button>
                <button className="button button--secondary" type="button" onClick={() => downloadText(`${slugSegment}.md`, markdown)}>下载正文</button>
              </div>

              {status ? <p className={styles.status}>{status}</p> : null}
            </section>

            <aside className={styles.side}>
              <h3>自动生成</h3>
              <p><strong>Slug：</strong>{slug}</p>
              <p><strong>输出路径：</strong>{outputPath}</p>
              <p className={styles.muted}>如需“点击提交”生效，请先在项目根目录运行：`npm run article:server`</p>
              <div className={styles.code}>{`npm run article:server`}</div>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
}

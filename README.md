# 数字法治知识平台

本项目是一个面向中文用户的开放知识平台，旨在系统整理和连接数字社会中的法律问题。平台通过结构化条目沉淀理论研究、法律实践与技术交叉议题，为法学生、研究者、法律实务人员和技术从业者提供可持续更新的知识基础设施。

项目仓库：https://github.com/SmallsmallQ/digital_law_platform

## 项目目标

- 建立可检索、可引用、可持续增长的数字法治知识库
- 通过统一页面结构连接论文、案例、法规与技术议题
- 形成“理论—制度—技术”相互链接的知识网络

本平台不提供个案法律咨询，重点在于学术与实务知识整理。

## 信息架构

### 顶层

- 平台导览（网站总体说明与导航）

### 二级板块

- 理论研究（Theory）
- 法律实践（Practice）
- 技术交叉（Technology & Law）

进入任一二级板块后，左侧仅展示该板块的独立侧边栏。

### 三级目录示例

- 理论研究：数字法学词典、经典文献、专题研究
- 法律实践：法规体系、典型案例、监管动态
- 技术交叉：人工智能、数据治理技术、区块链与可信技术

## 技术栈

- Docusaurus 3
- React 19
- TypeScript 5

## 本地开发

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发环境

```bash
npm run start
```

默认会启动本地站点并开启热更新。

### 3) 类型检查

```bash
npm run typecheck
```

### 4) 生产构建

```bash
npm run build
```

构建产物位于 `build` 目录。

### 5) 本地预览构建结果

```bash
npm run serve
```

## 文章生成系统

为减少手工维护 YAML、目录和正文结构的成本，项目内置了 YAML 驱动的文章生成脚本。

同时提供前端可视化入口：`/article-builder`（导航“写作工具”）。

如需在页面中点击“提交写入项目”，先启动本地写入服务：

```bash
npm run article:server
```

### 1) 查看可用模板

```bash
npm run article:new -- --list-templates
```

### 2) 按模板生成配置文件

通用文章：

```bash
npm run article:new -- --init article.config.yaml --template article
```

经典理论（名词）Wiki：

```bash
npm run article:new -- --init term.config.yaml --template classic-term-wiki
```

法规解读：

```bash
npm run article:new -- --init regulation.config.yaml --template regulation
```

文章分享：

```bash
npm run article:new -- --init share.config.yaml --template article-share
```

### 3) 填写配置并生成文章

```bash
npm run article:new -- --config article.config.yaml
```

如需覆盖同名文件：

```bash
npm run article:new -- --config article.config.yaml --force
```

### 4) 配置字段说明（核心）

- `output`：输出 Markdown 路径（例如 `docs/theory/.../my-article.md`）
- `frontMatter`：生成文档头部 YAML（如 `slug`、`sidebar_position`）
- `title`：文章标题
- `meta`：文献信息（发表信息、作者、下载链接等）
- `abstract`：摘要
- `keywords`：关键词列表
- `toc`：目录条目列表
- `sections`：正文章节（`heading` + `body`）

模板文件位于：[article-templates/](article-templates/)。

## 权威动态月报（每月一次）

项目内置月报脚本，用于固定抓取流程并生成“权威动态月报”初稿。

### 固定抓取来源

- 国家网信办：https://www.cac.gov.cn/
- 最高人民法院：https://www.court.gov.cn/
- 中国社科网数字法学频道：https://www.cssn.cn/fx/szfx/
- 中国政府网政策入口：https://www.gov.cn/zhengce/index.htm

### 运行方式

自动生成“上一个自然月”月报初稿：

```bash
npm run report:monthly
```

指定月份生成（例如 2026-02）：

```bash
npm run report:monthly -- --month 2026-02
```

覆盖已存在月份（谨慎使用）：

```bash
npm run report:monthly -- --month 2026-02 --force
```

输出文件：`docs/authority/authority-brief-YYYY-MM.md`

说明：脚本会自动抓取中国社科网数字法学频道当月条目，监管/司法部分会保留待补充区，便于人工复核后发布。

## 目录说明

- `docs/`：知识库正文内容（按板块与主题组织）
- `src/pages/`：自定义页面（含首页）
- `src/components/`：可复用组件
- `src/css/`：全局样式
- `docusaurus.config.ts`：站点配置
- `sidebars.ts`：侧边栏结构定义

## 内容编写建议

为便于检索与复用，建议各类条目使用统一结构：

- 理论条目：研究问题、主要观点、代表文献、研究争议
- 实务条目：背景、核心法律问题、裁判或监管要点、实践意义
- 技术条目：技术原理、应用场景、法律风险、监管发展

## 部署

可部署至任意静态站点托管服务。若使用 GitHub Pages，可通过 Docusaurus 部署命令发布到 `gh-pages` 分支：

```bash
npm run deploy
```

如需自定义域名、CI 自动部署或版本化文档，可在 `docusaurus.config.ts` 与仓库工作流中继续扩展。

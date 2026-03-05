import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type SectionItem = {
  title: string;
  to: string;
  description: ReactNode;
};

const SectionList: SectionItem[] = [
  {
    title: '理论研究（Theory）',
    to: '/docs/theory/',
    description: (
      <>
        汇集数字治理理论、算法治理、数据权利、平台治理、数字主权等主题，帮助读者快速把握研究问题、核心观点与争议脉络。
      </>
    ),
  },
  {
    title: '法律实践（Practice）',
    to: '/docs/practice/',
    description: (
      <>
        梳理数据保护、人工智能监管、平台责任及典型司法案例，围绕背景、核心法律问题与实践意义提供结构化参考。
      </>
    ),
  },
  {
    title: '技术交叉（Technology & Law）',
    to: '/docs/technology/',
    description: (
      <>
        连接人工智能、推荐算法、区块链、隐私计算等技术与法律议题，解释技术原理、法律风险与监管趋势。
      </>
    ),
  },
];

function SectionCard({title, to, description}: SectionItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <div className="padding-horiz--md padding-vert--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
          <Link className="button button--primary button--sm" to={to}>
            查看板块
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <Heading as="h2">平台定位</Heading>
            <p>
              数字法治知识平台是面向中文用户的开放知识平台，致力于系统整理和连接数字社会中的法律问题，构建可检索、可引用、可持续增长的数字法治知识库。
            </p>
          </div>
          <div className="row">
            {SectionList.map((props, idx) => (
              <SectionCard key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.updates}>
        <div className="container">
          <Heading as="h2">最新内容与专题</Heading>
          <div className="row">
            <div className="col col--4">
              <div className={styles.card}>
                <div className="padding-horiz--md padding-vert--md">
                  <Heading as="h4">近期更新</Heading>
                  <p>查看最新发布的研究条目、案例整理与法规观察。</p>
                  <Link to="/docs/practice/regulation-updates/">查看监管动态</Link>
                </div>
              </div>
            </div>
            <div className="col col--4">
              <div className={styles.card}>
                <div className="padding-horiz--md padding-vert--md">
                  <Heading as="h4">专题导航</Heading>
                  <p>按“理论—制度—技术”主线快速定位研究入口。</p>
                  <Link to="/docs/intro#网站整体结构">查看平台结构</Link>
                </div>
              </div>
            </div>
            <div className="col col--4">
              <div className={styles.card}>
                <div className="padding-horiz--md padding-vert--md">
                  <Heading as="h4">知识网络</Heading>
                  <p>从概念到案例、从案例到法规、从法规到论文，逐步形成系统认知。</p>
                  <Link to="/docs/technology/ai/ai-and-law">查看示例条目</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { allArticles } from '../data/feedData';
import Chart from './charts';
import SpeedTimeline from './SpeedTimeline';
import { slugify, childrenToText } from '../utils/slug';

const CHART = '/chart/';
const isChart = (src) => typeof src === 'string' && src.startsWith(CHART);

// route ![](/chart/<id>) image links to live React chart components;
// unwrap their paragraph so the chart <div> isn't nested inside a <p>.
// give h2s anchor ids so the SpeedTimeline can observe each section.
const components = {
  img({ src, alt }) {
    return isChart(src) ? <Chart id={src.slice(CHART.length)} /> : <img src={src} alt={alt} />;
  },
  h2({ children }) {
    return <h2 id={slugify(childrenToText(children))}>{children}</h2>;
  },
  p({ node, children }) {
    const only = node?.children?.length === 1 ? node.children[0] : null;
    if (only?.tagName === 'img' && isChart(only.properties?.src)) return <>{children}</>;
    return <p>{children}</p>;
  },
};

export default function FeedArticlePage() {
  const { slug } = useParams();
  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <section className="feed-article">
        <h1 className="feed-article-heading">NOT FOUND</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '24px', fontFamily: 'var(--font-body)' }}>
          This article doesn&apos;t exist.{' '}
          <Link to="/feed" style={{ textDecoration: 'underline' }}>Back to Feed</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="feed-article">
      <span className="feed-article-meta">{article.tag} - {article.date}</span>
      <h1 className="feed-article-heading">{article.title}</h1>
      {article.timeline && <SpeedTimeline config={article.timeline} />}
      <div className="feed-article-body">
        <ReactMarkdown components={components}>{article.content}</ReactMarkdown>
      </div>
    </section>
  );
}

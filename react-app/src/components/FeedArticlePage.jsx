import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { feedArticles } from '../data/feedData';

export default function FeedArticlePage() {
  const { slug } = useParams();
  const article = feedArticles.find((a) => a.slug === slug);

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
      <span className="feed-article-meta">{article.tag} &mdash; {article.date}</span>
      <h1 className="feed-article-heading">{article.title}</h1>
      <div className="feed-article-body">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </section>
  );
}

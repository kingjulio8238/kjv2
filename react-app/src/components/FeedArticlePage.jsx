import { useParams, Link } from 'react-router-dom';
import { allArticles } from '../data/feedData';
import PaperArticle from './PaperArticle';

// Every feed entry renders in the paper template. The layout derives what it
// needs — contents, reading time, the closing note — from the markdown itself,
// so a new entry is a content file plus a feedData row and nothing else.
export default function FeedArticlePage() {
  const { slug } = useParams();
  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <article className="paper">
        <div className="paper-shell">
          <header className="paper-head">
            <div className="paper-kicker"><span>404</span></div>
            <h1 className="paper-title">Not found</h1>
          </header>
          <div className="paper-grid">
            <div className="paper-col">
              <div className="paper-body">
                <p>This article doesn&apos;t exist. <Link to="/feed">Back to the feed</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return <PaperArticle article={article} />;
}

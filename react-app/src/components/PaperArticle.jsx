import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { collectionOf } from '../data/feedData';
import { markdownComponents } from './articleMarkdown';
import { extractHeadings, splitClosingNote, readingMinutes } from '../utils/toc';
import ArticleToc from './ArticleToc';

// The article template: light, centred, one measured column with a sticky
// contents list in the left gutter. Everything it needs — headings, reading
// time, the closing note — is derived from the markdown, so a new entry needs
// no layout configuration at all.
export default function PaperArticle({ article }) {
  const { body, note } = useMemo(() => splitClosingNote(article.content), [article.content]);
  const headings = useMemo(() => extractHeadings(body), [body]);
  const minutes = useMemo(() => readingMinutes(body), [body]);
  const collection = collectionOf(article.slug);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="paper">
      <div className="paper-shell">
        <header className="paper-head">
          <div className="paper-kicker">
            <span>{article.date}</span>
            {collection ? (
              <Link to={`/feed/${collection.slug}`}>{collection.title}</Link>
            ) : (
              <Link to="/feed">{article.tag}</Link>
            )}
          </div>
          <h1 className="paper-title">{article.title}</h1>
        </header>

        <div className="paper-strip">
          <div className="paper-strip-left">
            <span>{article.tag}</span>
            <span className="paper-strip-sep" />
            <span>{minutes} min read</span>
            {article.categories?.length > 0 && (
              <>
                <span className="paper-strip-sep" />
                <span>{article.categories.join(' · ')}</span>
              </>
            )}
          </div>
          <button type="button" className="paper-share" onClick={share}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M9.5 14.5l5-5" />
              <path d="M12.5 6.5l1.6-1.6a3.5 3.5 0 015 5L16.5 12" />
              <path d="M11.5 17.5l-1.6 1.6a3.5 3.5 0 01-5-5L7.5 12" />
            </svg>
            {copied ? 'Link copied' : 'Share'}
          </button>
        </div>

        <div className="paper-grid">
          <div className="paper-toc-col">
            <ArticleToc headings={headings} />
          </div>
          <div className="paper-col">
            <div className="paper-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {body}
              </ReactMarkdown>
            </div>

            {note && (
              <div className="paper-note">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
              </div>
            )}

            <Link to={collection ? `/feed/${collection.slug}` : '/feed'} className="paper-back">
              &larr; {collection ? collection.title : 'The Feed'}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

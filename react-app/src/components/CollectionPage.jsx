import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collections } from '../data/feedData';

// A collection page: a feed-within-a-feed. Same row layout as the main feed,
// filtered to one collection's entries. Resolved from /feed/:collection.
// Collections are listed in the home page's Projects section and nowhere else,
// so the back link returns there.
export default function CollectionPage({ slug }) {
  const { meta, articles } = collections[slug] ?? {};
  const headingRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (listRef.current) observer.observe(listRef.current);

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
      if (listRef.current) observer.unobserve(listRef.current);
    };
  }, []);

  if (!meta) return null;

  return (
    <section className="feed-page">
      <Link to="/#projects" className="feed-page-back">&larr; Projects</Link>
      <h1 className="feed-page-heading reveal" ref={headingRef}>{meta.title}</h1>
      {meta.description && (
        <div className="feed-page-intro"><p>{meta.description}</p></div>
      )}
      <div className="feed-list reveal" ref={listRef}>
        {articles.map((article) => (
          <Link
            to={`/feed/${article.slug}`}
            className="feed-list-item"
            key={article.slug}
          >
            <span className="feed-list-title">{article.title}</span>
            <span className="feed-list-meta">
              <span className="feed-list-tag">{article.tag}</span>
              <span className="feed-list-date">{article.date}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

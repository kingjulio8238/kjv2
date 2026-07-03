import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { inferenceArticles, inferenceCollection } from '../data/feedData';

// The inferencemaxxing collection: a feed-within-a-feed. Same row layout as the
// main feed, filtered to the inference/kernel pieces.
export default function CollectionPage() {
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

  return (
    <section className="feed-page">
      <Link
        to="/feed"
        style={{ display: 'inline-block', marginBottom: 24, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
      >
        &larr; The Feed
      </Link>
      <h1 className="feed-page-heading reveal" ref={headingRef}>{inferenceCollection.title}</h1>
      <div className="feed-list reveal" ref={listRef}>
        {inferenceArticles.map((article) => (
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

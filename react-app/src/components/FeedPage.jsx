import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { feedArticles } from '../data/feedData';

export default function FeedPage() {
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
      <h1 className="feed-page-heading reveal" ref={headingRef}>THE FEED</h1>
      <div className="feed-list reveal" ref={listRef}>
        {feedArticles.map((article) => (
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

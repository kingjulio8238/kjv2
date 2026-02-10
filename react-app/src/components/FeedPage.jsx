import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { feedArticles } from '../data/feedData';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7,7 17,7 17,17" />
  </svg>
);

export default function FeedPage() {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

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
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="feed-page">
      <h1 className="feed-page-heading reveal" ref={headingRef}>THE FEED</h1>
      <div className="feed-page-grid">
        {feedArticles.map((article, i) => (
          <Link
            to={`/feed/${article.slug}`}
            className={`feed-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
            key={article.slug}
            ref={(el) => (cardRefs.current[i] = el)}
          >
            <img src={article.image} alt={article.imageAlt} />
            <span className="feed-card-tag">{article.tag}</span>
            <div className="feed-card-arrow"><ArrowIcon /></div>
            <div className="feed-card-title">{article.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

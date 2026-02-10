import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { feedArticles } from '../data/feedData';

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7,7 17,7 17,17" />
    </svg>
);

export default function Feed() {
    const titleRef = useRef(null);
    const viewAllRef = useRef(null);
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);

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

        const refs = [titleRef, viewAllRef, card1Ref, card2Ref, card3Ref];
        refs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            refs.forEach((ref) => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, []);

    const cardRefs = [card1Ref, card2Ref, card3Ref];

    return (
        <section className="feed" id="feed">
            <div className="feed-header">
                <h2 className="feed-title reveal" ref={titleRef}>
                    THE FEED
                </h2>
                <Link to="/feed" className="feed-view-all reveal reveal-delay-1" ref={viewAllRef}>
                    VIEW ALL
                </Link>
            </div>
            <div className="feed-grid">
                {feedArticles.map((article, i) => (
                    <Link
                        to={`/feed/${article.slug}`}
                        className={`feed-card ${i === 0 ? 'feed-card-large' : ''} reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
                        key={article.slug}
                        ref={cardRefs[i]}
                    >
                        <img src={article.image} alt={article.imageAlt} />
                        <span className="feed-card-tag">{article.tag}</span>
                        <div className="feed-card-arrow"><ArrowIcon /></div>
                        {article.title && <div className="feed-card-title">{article.title}</div>}
                    </Link>
                ))}
            </div>
        </section>
    );
}

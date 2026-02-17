import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { feedArticles } from '../data/feedData';

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
                {feedArticles.slice(0, 3).map((article, i) => (
                    <Link
                        to={`/feed/${article.slug}`}
                        className={`feed-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
                        key={article.slug}
                        ref={cardRefs[i]}
                    >
                        <div className="feed-card-image">
                            <img src={article.image} alt={article.imageAlt} />
                        </div>
                        <div className="feed-card-content">
                            <div className="feed-card-title">{article.title}</div>
                            <div className="feed-card-meta">
                                <span className="feed-card-tag">{article.tag}</span>
                                <span className="feed-card-date">{article.date}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

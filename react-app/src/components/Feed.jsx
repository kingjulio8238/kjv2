import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { feedArticles } from '../data/feedData';

export default function Feed() {
    const titleRef = useRef(null);
    const viewAllRef = useRef(null);
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

        [titleRef, viewAllRef, listRef].forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            [titleRef, viewAllRef, listRef].forEach((ref) => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, []);

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
            <div className="feed-list reveal reveal-delay-1" ref={listRef}>
                {feedArticles.slice(0, 3).map((article) => (
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

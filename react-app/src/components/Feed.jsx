import { useEffect, useRef } from 'react';

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

    return (
        <section className="feed" id="feed">
            <div className="feed-header">
                <h2 className="feed-title reveal" ref={titleRef}>
                    THE FEED
                </h2>
                <a href="#" className="feed-view-all reveal reveal-delay-1" ref={viewAllRef}>
                    VIEW ALL
                </a>
            </div>
            <div className="feed-grid">
                <div className="feed-card feed-card-large reveal" ref={card1Ref}>
                    <img
                        src="https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80&auto=format"
                        alt="Robotics manufacturing"
                    />
                    <span className="feed-card-tag">ARTICLES</span>
                    <div className="feed-card-arrow">
                        <ArrowIcon />
                    </div>
                </div>
                <div className="feed-card reveal reveal-delay-1" ref={card2Ref}>
                    <img
                        src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80&auto=format"
                        alt="Humanoid robots"
                    />
                    <span className="feed-card-tag">ARTICLES</span>
                    <div className="feed-card-arrow">
                        <ArrowIcon />
                    </div>
                    <div className="feed-card-title">Natural Humanoid Walk Using Reinforcement Learning</div>
                </div>
                <div className="feed-card reveal reveal-delay-2" ref={card3Ref}>
                    <img
                        src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&q=80&auto=format"
                        alt="Robot assembly"
                    />
                    <span className="feed-card-tag">ARTICLES</span>
                    <div className="feed-card-arrow">
                        <ArrowIcon />
                    </div>
                </div>
            </div>
        </section>
    );
}

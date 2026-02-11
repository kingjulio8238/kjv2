import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
    const location = useLocation();
    const headingRef = useRef(null);
    const linksRef = useRef(null);

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
        if (linksRef.current) observer.observe(linksRef.current);

        return () => {
            if (headingRef.current) observer.unobserve(headingRef.current);
            if (linksRef.current) observer.unobserve(linksRef.current);
        };
    }, []);

    return (
        <footer className="footer" id="footer">
            <div className="footer-top">
                <h2 className="footer-heading reveal" ref={headingRef}>
                    KEEP<br />UP
                </h2>
                <div className="footer-links reveal reveal-delay-1" ref={linksRef}>
                    <Link to="/bio">BIO</Link>
                    <Link to="/feed">FEED</Link>
                    <Link to="/contact">CONTACT</Link>
                    <a href="https://x.com/JulianSaks" target="_blank" rel="noopener noreferrer">
                        X
                    </a>
                    <a href="https://www.linkedin.com/in/juliansaks/" target="_blank" rel="noopener noreferrer">
                        LINKEDIN
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <Link
                    to="/"
                    onClick={(e) => {
                        if (location.pathname === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                >
                    <img src="/saks_fam_emblem.png" alt="Saks Family Emblem" className="footer-emblem" />
                </Link>
            </div>
        </footer>
    );
}

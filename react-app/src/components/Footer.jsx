import { useEffect, useRef } from 'react';

export default function Footer({ onShowContact, onNavigateToSection }) {
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
                    <a href="#bio-cta">BIO</a>
                    <a href="#feed">FEED</a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onShowContact();
                        }}
                    >
                        CONTACT
                    </a>
                    <a href="https://x.com/JulianSaks" target="_blank" rel="noopener noreferrer">
                        X
                    </a>
                    <a href="https://www.linkedin.com/in/juliansaks/" target="_blank" rel="noopener noreferrer">
                        LINKEDIN
                    </a>
                    <a href="https://www.instagram.com/juliansaks" target="_blank" rel="noopener noreferrer">
                        INSTAGRAM
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <img src="/saks_fam_emblem.png" alt="Saks Family Emblem" className="footer-emblem" />
            </div>
        </footer>
    );
}

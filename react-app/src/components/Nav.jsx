import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Nav() {
    const location = useLocation();
    const isMainPage = location.pathname === '/';
    // Transparent over the hero, solid everywhere else — the nav only needs a
    // ground once content is scrolling underneath it. Derived rather than
    // stored, so the effect never sets state synchronously on mount.
    const [heroVisible, setHeroVisible] = useState(true);
    const isScrolled = !isMainPage || !heroVisible;

    useEffect(() => {
        if (!isMainPage) return undefined;
        const hero = document.getElementById('hero');
        if (!hero) return undefined;
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => setHeroVisible(e.isIntersecting)),
            { threshold: 0.05 }
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, [isMainPage]);

    const navClasses = [
        'nav',
        isScrolled ? 'scrolled' : '',
        // on mobile the article pages let the nav scroll away rather than
        // spend fixed vertical space on it
        location.pathname.startsWith('/feed') ? 'nav-static' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav className={navClasses} id="nav">
            <Link to="/" className="nav-logo">
                <span className="full">JULIAN SAKS</span>
                <span className="abbr">JDS</span>
            </Link>
            <div className="nav-links">
                <Link to="/bio" className={location.pathname === '/bio' ? 'nav-active' : ''}>
                    BIO
                </Link>
                <Link to="/feed" className={location.pathname.startsWith('/feed') ? 'nav-active' : ''}>
                    FEED
                </Link>
                <Link to="/contact" className={location.pathname === '/contact' ? 'nav-active' : ''}>
                    CONTACT
                </Link>
            </div>
        </nav>
    );
}

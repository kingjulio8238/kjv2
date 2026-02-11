import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Nav() {
    const location = useLocation();
    const isMainPage = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(!isMainPage);
    const [isLightMode, setIsLightMode] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useEffect(() => {
        if (!isMainPage) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
        setIsLightMode(false);
        setIsFooterVisible(false);

        const heroSection = isMainPage ? document.getElementById('hero') : null;
        const footerSection = document.getElementById('footer');

        const heroObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsScrolled(!entry.isIntersecting);
                });
            },
            { threshold: 0.05 }
        );

        const footerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsLightMode(entry.isIntersecting);
                    setIsFooterVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.15 }
        );

        if (heroSection) heroObserver.observe(heroSection);
        if (footerSection) footerObserver.observe(footerSection);

        return () => {
            if (heroSection) heroObserver.unobserve(heroSection);
            if (footerSection) footerObserver.unobserve(footerSection);
        };
    }, [isMainPage]);

    const navClasses = [
        'nav',
        isScrolled ? 'scrolled' : '',
        isLightMode ? 'light-mode' : '',
        isFooterVisible ? 'footer-visible' : '',
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

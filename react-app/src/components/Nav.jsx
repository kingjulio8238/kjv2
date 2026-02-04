import { useEffect, useState } from 'react';

export default function Nav({ isContactPage, onShowContact, onShowMain, onNavigateToSection }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        if (isContactPage) return;

        const heroSection = document.getElementById('hero');
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
    }, [isContactPage]);

    const handleNavClick = (e, target) => {
        e.preventDefault();
        if (isContactPage) {
            onShowMain();
            setTimeout(() => {
                const el = document.querySelector(target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const navClasses = [
        'nav',
        isScrolled || isContactPage ? 'scrolled' : '',
        isLightMode && !isContactPage ? 'light-mode' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav className={navClasses} id="nav">
            <div className="nav-logo" onClick={isContactPage ? onShowMain : undefined}>
                <span className="full">JULIAN SAKS</span>
                <span className="abbr">JDS</span>
            </div>
            <div className="nav-links">
                <a href="#bio-cta" onClick={(e) => handleNavClick(e, '#bio-cta')}>
                    BIO
                </a>
                <a href="#feed" onClick={(e) => handleNavClick(e, '#feed')}>
                    FEED
                </a>
                <a
                    href="#"
                    className={isContactPage ? 'nav-active' : ''}
                    onClick={(e) => {
                        e.preventDefault();
                        onShowContact();
                    }}
                >
                    CONTACT
                </a>
            </div>
        </nav>
    );
}

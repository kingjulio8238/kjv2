import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function BioCta() {
    const buttonRef = useRef(null);

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

        if (buttonRef.current) observer.observe(buttonRef.current);

        return () => {
            if (buttonRef.current) observer.unobserve(buttonRef.current);
        };
    }, []);

    return (
        <section className="bio-cta" id="bio-cta">
            <Link to="/bio" className="bio-cta-button reveal" ref={buttonRef}>
                READ MY BIO
            </Link>
        </section>
    );
}

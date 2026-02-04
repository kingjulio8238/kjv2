import { useEffect, useRef } from 'react';

export default function Statement() {
    const headlineRef = useRef(null);
    const subtitleRef = useRef(null);

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

        if (headlineRef.current) observer.observe(headlineRef.current);
        if (subtitleRef.current) observer.observe(subtitleRef.current);

        return () => {
            if (headlineRef.current) observer.unobserve(headlineRef.current);
            if (subtitleRef.current) observer.unobserve(subtitleRef.current);
        };
    }, []);

    return (
        <section className="statement" id="statement">
            <h2 className="statement-headline reveal" ref={headlineRef}>
                I LIKE TO BUILD<br />IMPOSSIBLE THINGS.
            </h2>
            <p className="statement-subtitle reveal reveal-delay-1" ref={subtitleRef}>
                With extreme practicality,<br />I make crazy ideas real.
            </p>
        </section>
    );
}

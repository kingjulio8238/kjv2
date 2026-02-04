import { useEffect, useRef } from 'react';
import memaryImage from '../assets/memary.png';

export default function Projects() {
    const memaryCardRef = useRef(null);
    const coverCardRef = useRef(null);

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

        if (memaryCardRef.current) observer.observe(memaryCardRef.current);
        if (coverCardRef.current) observer.observe(coverCardRef.current);

        return () => {
            if (memaryCardRef.current) observer.unobserve(memaryCardRef.current);
            if (coverCardRef.current) observer.unobserve(coverCardRef.current);
        };
    }, []);

    return (
        <section className="projects" id="projects">
            {/* MEMARY card */}
            <a
                href="https://github.com/kingjulio8238/Memary"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card project-card-figure reveal"
                ref={memaryCardRef}
            >
                <img
                    className="project-card-image"
                    src={memaryImage}
                    alt="Memary - Memory for Agents"
                />
                <div className="project-card-content">
                    <p className="project-card-text">
                        Memory for Agents
                    </p>
                </div>
                <span className="project-card-label">MEMARY</span>
            </a>

            {/* COVER card */}
            <div className="project-card project-card-cover reveal reveal-delay-1" ref={coverCardRef}>
                <img
                    className="project-card-image"
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80&auto=format"
                    alt="Cover device"
                />
                <div className="project-card-content">
                    <svg className="project-card-icon" viewBox="0 0 36 36" fill="#444">
                        <rect x="2" y="2" width="32" height="32" rx="6" fill="none" stroke="#555" strokeWidth="2" />
                        <rect x="10" y="10" width="16" height="16" rx="3" fill="none" stroke="#555" strokeWidth="2" />
                    </svg>
                    <p className="project-card-text">
                        Invisible security force field<br />protecting schools from guns
                    </p>
                </div>
                <span className="project-card-label">COVER</span>
            </div>
        </section>
    );
}

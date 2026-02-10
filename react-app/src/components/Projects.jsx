import { useEffect, useRef } from 'react';
import memaryImage from '../assets/memary.png';

export default function Projects() {
    const memaryCardRef = useRef(null);
    const hyperionCardRef = useRef(null);

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
        if (hyperionCardRef.current) observer.observe(hyperionCardRef.current);

        return () => {
            if (memaryCardRef.current) observer.unobserve(memaryCardRef.current);
            if (hyperionCardRef.current) observer.unobserve(hyperionCardRef.current);
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

            {/* HYPERION card */}
            <a
                href="https://kingjulio8238.github.io/hyperion_report/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card project-card-cover reveal reveal-delay-1"
                ref={hyperionCardRef}
            >
                <div className="project-card-content">
                    <p className="project-card-text">
                        Continual Learning Infrastructure<br />for AI Robotics
                    </p>
                </div>
                <span className="project-card-label">HYPERION</span>
            </a>
        </section>
    );
}

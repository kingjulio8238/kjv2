import { useEffect, useRef } from 'react';

const projects = [
    {
        name: 'nanoG1',
        description: 'Train a G1 to walk in < 60s',
        url: 'https://g1-sub60-walk.vercel.app',
    },
    {
        name: 'Humanoid Atlas',
        description: 'The Atlas Built For Humanoid Enthusiasts',
        url: 'https://www.humanoids.fyi',
    },
    {
        name: 'Memary',
        description: 'Memory for Agents',
        url: 'https://github.com/kingjulio8238/Memary',
    },
];

export default function Projects() {
    const listRef = useRef(null);

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

        if (listRef.current) observer.observe(listRef.current);

        return () => {
            if (listRef.current) observer.unobserve(listRef.current);
        };
    }, []);

    return (
        <section className="projects" id="projects">
            <div className="projects-list reveal" ref={listRef}>
                {projects.map((project) => (
                    <a
                        href={project.url || undefined}
                        target={project.url ? '_blank' : undefined}
                        rel={project.url ? 'noopener noreferrer' : undefined}
                        className={`projects-list-item${project.url ? '' : ' projects-list-item--disabled'}`}
                        key={project.name}
                    >
                        <span className="projects-list-name">{project.name}</span>
                        <span className="projects-list-desc">{project.description}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}

import { useState, useRef } from 'react';

export default function Hero() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <section className="hero" id="hero">
            <div className="hero-video-wrap" id="videoWrap">
                <video ref={videoRef} autoPlay muted loop playsInline>
                    <source src="/refs/hero.mov" type="video/mp4" />
                </video>
            </div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="hero-headline">
                    20+ YEARS<br />OF CREATING<br />THE FUTURE
                </h1>
            </div>
            <div className="hero-controls">
                <button onClick={toggleMute} aria-label="Toggle mute" title="Toggle mute">
                    {isMuted ? (
                        <svg viewBox="0 0 24 24">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M19.07 4.93a10 10 0 010 14.14" />
                            <path d="M15.54 8.46a5 5 0 010 7.07" />
                        </svg>
                    )}
                </button>
                <button onClick={togglePlay} aria-label="Toggle play/pause" title="Toggle play/pause">
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                </button>
            </div>
        </section>
    );
}

import { useState, useEffect, useRef, useCallback } from 'react';

const SPEEDS = { status: 18, label: 25, body: 30, end: 35 };
const PAUSES = { status: 300, label: 250, body: 600, end: 0 };

const bioContent = [
  { type: 'status', text: 'ACCESSING PERSONNEL FILE . . . . . VERIFIED' },
  { type: 'status', text: 'CLEARANCE LEVEL — CONFIDENTIAL' },
  { type: 'label', text: '// BACKGROUND' },
  { type: 'body', text: 'Spawned in South Africa. Graduated from UT Austin. Building Continual Learning Infrastructure for AI Robotics in the Bay Area.' },
  { type: 'label', text: '// EXPERIENCE' },
  { type: 'body', text: 'Led many organizations throughout college, built Memary (2,600+ stars), and worked on world models to solve the Physical AI evaluation bottleneck.' },
  { type: 'label', text: '// INTERESTS' },
  { type: 'body', text: 'Continual learning, world models, space, fully autonomous organizations, nano drones, and more.' },
  { type: 'label', text: '// LESSON LEARNED' },
  { type: 'body', text: 'One is only bounded by their breadth and depth of their curiosity.' },
  { type: 'end', text: '[END OF FILE]' },
];

export default function BioPage() {
  const [completed, setCompleted] = useState([]);
  const [blockIdx, setBlockIdx] = useState(-1);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  // Start after brief delay
  useEffect(() => {
    timerRef.current = setTimeout(() => setBlockIdx(0), 500);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Typing engine
  useEffect(() => {
    if (blockIdx < 0 || blockIdx >= bioContent.length || done) return;

    const block = bioContent[blockIdx];
    let i = 0;

    const tick = () => {
      i++;
      if (i <= block.text.length) {
        setTyped(block.text.slice(0, i));
        const jitter = (Math.random() - 0.5) * SPEEDS[block.type] * 0.5;
        timerRef.current = setTimeout(tick, Math.max(4, SPEEDS[block.type] + jitter));
      } else {
        timerRef.current = setTimeout(() => {
          setCompleted(prev => [...prev, block]);
          setTyped('');
          if (blockIdx + 1 >= bioContent.length) {
            setDone(true);
          } else {
            setBlockIdx(prev => prev + 1);
          }
        }, PAUSES[block.type]);
      }
    };

    timerRef.current = setTimeout(tick, SPEEDS[block.type]);
    return () => clearTimeout(timerRef.current);
  }, [blockIdx, done]);

  // Auto-scroll to keep cursor in view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [typed, completed]);

  // Skip to end
  const skip = useCallback(() => {
    if (done) return;
    clearTimeout(timerRef.current);
    setCompleted(bioContent);
    setBlockIdx(bioContent.length);
    setTyped('');
    setDone(true);
  }, [done]);

  const current = bioContent[blockIdx];

  return (
    <section className="bio-terminal" onClick={skip}>
      <div className="bio-terminal-scanlines" />
      <div className="bio-terminal-vignette" />
      <div className="bio-terminal-inner">
        {completed.map((b, i) => (
          <div
            key={i}
            className={`bio-t-block bio-t-${b.type}${b.type === 'status' ? ' bio-t-dim' : ''}`}
          >
            {b.text}
          </div>
        ))}

        {current && !done && (
          <div className={`bio-t-block bio-t-${current.type}`}>
            {typed}
            <span className="bio-t-cursor" />
          </div>
        )}

        {done && (
          <div className="bio-t-after">
            <span className="bio-t-cursor" />
          </div>
        )}

        <div ref={scrollRef} style={{ height: 1 }} />
      </div>

      {!done && (
        <div className="bio-terminal-skip">CLICK TO SKIP</div>
      )}
    </section>
  );
}

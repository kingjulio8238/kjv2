import { useEffect, useState } from 'react';

// Sticky table of contents for the paper layout. Headings are passed in from
// the markdown (see utils/toc.js), so nothing here is hand-maintained.
// The active entry is the last heading whose top has crossed the read line —
// a heading is "reached" once its top crosses a fixed line below the nav.
const READ_LINE = 160;

// A contents list of one entry is noise, not navigation — a couple of the
// shorter feed pieces have a single heading or none at all.
const MIN_ENTRIES = 2;

export default function ArticleToc({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length < MIN_ENTRIES) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      let active = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= READ_LINE) active = h.id;
      }
      setActiveId(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length < MIN_ENTRIES) return null;

  return (
    <nav className="paper-toc" aria-label="On this page">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={[h.level === 3 ? 'is-sub' : '', h.id === activeId ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

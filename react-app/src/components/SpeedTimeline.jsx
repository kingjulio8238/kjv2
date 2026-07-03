import { useEffect, useRef, useState } from 'react';
import { slugify } from '../utils/slug';

// Always-visible progress timeline for inferencemaxxing articles. The metric is
// model-unique (config.metric/unit); stops are the build milestones. As the
// reader scrolls, the live readout ticks to the value reached at that step and
// the bar fills toward the fast end. config = { metric, unit, hint, stops:[{heading,value,mult}] }.
export default function SpeedTimeline({ config }) {
  const { stops, unit, metric, hint } = config;
  const [active, setActive] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const els = stops.map((s) => document.getElementById(slugify(s.heading)));
    const THRESH = 150; // px from viewport top — a heading above this line is "reached"

    const update = () => {
      rafRef.current = 0;
      let idx = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= THRESH) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stops]);

  const n = stops.length;
  const cur = stops[active];
  const posOf = (i) => (n > 1 ? (i / (n - 1)) * 100 : 0);

  return (
    <div className="spd">
      <div className="spd-top">
        <div className="spd-now">
          <span className="spd-now-label">{metric}</span>
          <span className="spd-now-value">{cur.value}<span className="spd-unit">{unit}</span></span>
        </div>
        <div className="spd-mult">
          {cur.mult}
          <span className="spd-mult-label">{active === 0 ? 'baseline' : 'faster'}</span>
        </div>
      </div>
      <div className="spd-track">
        <div className="spd-fill" style={{ width: posOf(active) + '%' }} />
        {stops.map((s, i) => (
          <button
            key={s.heading}
            type="button"
            className={`spd-dot${i <= active ? ' spd-dot--done' : ''}${i === active ? ' spd-dot--active' : ''}`}
            style={{ left: posOf(i) + '%' }}
            onClick={() => document.getElementById(slugify(s.heading))?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            aria-label={`${s.heading}: ${s.value}${unit}`}
          >
            <span className="spd-dot-val">{s.value}{unit}</span>
          </button>
        ))}
      </div>
      {hint && <div className="spd-hint">{hint}</div>}
    </div>
  );
}

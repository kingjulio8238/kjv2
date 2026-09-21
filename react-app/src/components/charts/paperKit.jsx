/* Chart primitives for the article template.
 *
 * These follow the blog template's chart language: no card chrome, figures sit
 * directly on the page; flat solid fills with square corners and a fixed bar
 * thickness; hard 1.5px black axes and no gridlines; labels in the body face at
 * 13px rather than big mono numerals.
 *
 * Import { Figure, VBars, HBars, Tiles, Rows, Matrix, Equation } from
 * './paperKit'. */

const AXIS = '1.5px solid #0d0d0d';
const BAR_W = 64;   // template bar thickness
const BAR_H = 28;   // its horizontal equivalent
const PLOT_H = 400;

/* template bar fills — flat, no gradient, no shadow */
const FILL = {
  gray: '#9e9e99',
  green: '#4a9f5c',
  win: '#2f7a40',
  fail: '#b4512c',
  alt: '#4c7ff0',
};
const fill = (tone) => FILL[tone] ?? FILL.gray;

/* ---------------------------------------------------------------------------
 * Figure wrapper: bold title above, optional legend, optional caption beneath.
 * ------------------------------------------------------------------------- */
export function Figure({ title, legend, caption, children }) {
  return (
    <figure className="paper-fig">
      {title && <div className="paper-fig-title">{title}</div>}
      {legend && (
        <div className="paper-fig-legend">
          {legend.map((l, i) => (
            <span key={i}>
              <span className="paper-fig-swatch" style={{ background: fill(l.tone) }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
      <div className="paper-fig-plot">{children}</div>
      {caption && (
        <figcaption className="paper-fig-caption">
          {caption.map((line, i) => <div key={i}>{line}</div>)}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------------------------------------------------------------------------
 * Vertical bars. Linear by default; pass log with vmin/vmax for a log axis
 * (the site's step-change data spans two decades, which a linear axis flattens
 * into nothing). Ticks are given explicitly so the axis reads in the units the
 * prose uses.
 * ------------------------------------------------------------------------- */
export function VBars({ bars, ticks, axisLabel, log = false, vmin, vmax, max, target, targetLabel, height = PLOT_H }) {
  const pct = log
    ? (v) => ((Math.log10(v) - Math.log10(vmin)) / (Math.log10(vmax) - Math.log10(vmin))) * 100
    : (v) => (v / max) * 100;

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {axisLabel && (
        <div style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 12.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d0d0d',
        }}>{axisLabel}</div>
      )}
      <div style={{ position: 'relative', width: 50, flex: 'none', height, fontSize: 12.5, color: '#0d0d0d' }}>
        {ticks.map((t, i) => (
          <span key={i} style={{
            position: 'absolute', right: 6, bottom: `${pct(t.value)}%`,
            transform: 'translateY(50%)', whiteSpace: 'nowrap',
          }}>{t.label}</span>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ position: 'relative', display: 'flex', height, borderLeft: AXIS, borderBottom: AXIS }}>
          {target != null && (
            <>
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: `${pct(target)}%`,
                borderTop: '1.5px dashed #0d0d0d', zIndex: 2,
              }} />
              <div style={{
                position: 'absolute', right: 4, bottom: `calc(${pct(target)}% + 6px)`,
                fontSize: 12.5, color: '#0d0d0d', zIndex: 3, whiteSpace: 'nowrap',
              }}>{targetLabel}</div>
            </>
          )}
          {bars.map((b, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 0, position: 'relative', padding: '0 5px',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}>
              <span style={{
                position: 'absolute', left: 0, right: 0, bottom: `calc(${pct(b.value)}% + 7px)`,
                textAlign: 'center', fontSize: 13, color: '#0d0d0d', whiteSpace: 'nowrap',
              }}>{b.text}</span>
              <div style={{
                width: '100%', maxWidth: BAR_W, height: `${pct(b.value)}%`,
                background: fill(b.tone),
                animation: 'ttw-grow 0.8s cubic-bezier(.2,.8,.2,1) both',
                animationDelay: `${i * 0.07}s`, transformOrigin: 'bottom',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: 14, fontSize: 13, lineHeight: 1.45, textAlign: 'center' }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, whiteSpace: 'pre-line', color: '#0d0d0d' }}>{b.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Horizontal bars, in the same language: flat fill, square corners, one hard
 * axis on the baseline. The template has no horizontal chart, so this is the
 * vertical one turned on its side rather than a different idea.
 * ------------------------------------------------------------------------- */
export function HBars({ bars, max, labelW = 150, target, targetLabel }) {
  const pct = (v) => (v / max) * 100;
  const GAP = 16;
  const X = labelW + GAP;

  return (
    <div style={{ position: 'relative', paddingTop: target != null ? 22 : 0 }}>
      {target != null && (
        <>
          <div style={{
            position: 'absolute', top: 16, bottom: 0,
            left: `calc((100% - ${X}px) * ${target / max} + ${X}px)`,
            width: 0, borderLeft: '1.5px dashed #0d0d0d', zIndex: 2,
          }} />
          <div style={{
            position: 'absolute', top: 0,
            left: `calc((100% - ${X}px) * ${target / max} + ${X}px)`,
            transform: 'translateX(-50%)', fontSize: 12.5, color: '#0d0d0d', whiteSpace: 'nowrap',
          }}>{targetLabel}</div>
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderLeft: AXIS, marginLeft: X }}>
        {bars.map((b, i) => {
          const w = Math.max(pct(b.value), 0.4);
          const inside = w > 74;   // no room left for an outboard label
          return (
            <div key={i} style={{ position: 'relative', height: BAR_H }}>
              <div style={{
                position: 'absolute', right: `calc(100% + ${GAP}px)`, top: 0, height: BAR_H,
                width: labelW, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                fontSize: 13, lineHeight: 1.3, color: '#0d0d0d', textAlign: 'right',
              }}>{b.label}</div>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${w}%`, background: fill(b.tone),
                transformOrigin: 'left', animation: 'ttw-growx 0.8s cubic-bezier(.2,.8,.2,1) both',
                animationDelay: `${i * 0.07}s`,
              }} />
              <div style={{
                position: 'absolute', top: 0, height: BAR_H,
                display: 'flex', alignItems: 'center', fontSize: 13, whiteSpace: 'nowrap',
                ...(inside
                  ? { right: `calc(${100 - w}% + 12px)`, color: '#fff' }
                  : { left: `calc(${w}% + 10px)`, color: '#0d0d0d' }),
              }}>{b.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Stat tiles — the template's operating-point cards.
 * ------------------------------------------------------------------------- */
export function Tiles({ items }) {
  return (
    <div className="paper-tiles">
      {items.map((it, i) => (
        <div className="paper-tile" key={i}>
          <div className="paper-tile-label">{it.label}</div>
          <div className="paper-tile-big">{it.big}</div>
          <div className="paper-tile-sub">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * An identity read left to right — two factors and their product. Used where
 * the arithmetic itself is the finding, not the individual numbers.
 * ------------------------------------------------------------------------- */
export function Equation({ items }) {
  return (
    <div className="paper-eq">
      {items.map((it, i) => (
        it.op
          ? <span className="paper-eq-op" key={i}>{it.op}</span>
          : (
            <div className="paper-eq-term" key={i}>
              <div className={`paper-eq-big${it.accent ? ' is-accent' : ''}`}>{it.big}</div>
              <div className="paper-eq-sub">{it.sub}</div>
            </div>
          )
      ))}
    </div>
  );
}

/* Rows of lever → outcome, in the tiles' surface language. */
export function Rows({ items }) {
  return (
    <div className="paper-rows">
      {items.map((r, i) => (
        <div className="paper-row" key={i}>
          <div className="paper-row-head">{r.head}</div>
          <div className="paper-row-body">{r.body}</div>
        </div>
      ))}
    </div>
  );
}

/* Capability matrix — a plain table in the template's table style. */
export function Matrix({ cols, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="paper-matrix">
        <thead>
          <tr>
            <th />
            {cols.map((c, i) => <th key={i}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <td>{r.label}</td>
              {r.cells.map((ok, ci) => (
                <td key={ci} style={{ color: ok ? '#0d0d0d' : '#c4c4bf' }}>{ok ? '●' : '○'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

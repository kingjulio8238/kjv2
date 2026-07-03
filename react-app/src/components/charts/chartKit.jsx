/* Shared feed-article chart primitives — extracted from the nanoG1 charts so
 * every future piece (inferencemaxxing and beyond) renders in the same house
 * style. Style tokens live in ./chartTokens; this file exports only components.
 * Import { Card, HBars, VBars, VLogBars, ACCENT } from './chartKit'. */

import { HEAD, MONO, valColor, vgrad, hgrad, shadow } from './chartTokens';

export const ACCENT = (t) => <span style={{ color: '#e3852f', fontWeight: 600 }}>{t}</span>;

export function Card({ sub, children }) {
  return (
    <div style={{
      width: '100%', boxSizing: 'border-box', margin: '40px 0',
      background: 'radial-gradient(120% 100% at 12% 0%, #1c1c1b 0%, #131312 60%, #0f0f0e 100%)',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18,
      padding: '32px 38px 30px', fontFamily: HEAD, color: '#f4f4f2',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {sub && <p style={{ margin: '0 0 26px', fontSize: 15.5, fontWeight: 500, color: '#9a9a95', letterSpacing: '-0.01em', lineHeight: 1.4 }}>{sub}</p>}
      {children}
    </div>
  );
}

/* vertical bars on a log axis */
export function VLogBars({ bars, gridlines, vmin, vmax, target, targetLabel }) {
  const lo = Math.log10(vmin), hi = Math.log10(vmax), span = hi - lo;
  const pct = (v) => ((Math.log10(v) - lo) / span) * 100;
  const H = 360;
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ position: 'relative', width: 62, flex: 'none', height: H }}>
        {gridlines.map((g, i) => (
          <div key={i} style={{ position: 'absolute', right: 0, bottom: pct(g.value) + '%', transform: 'translateY(50%)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#bdbdb8', letterSpacing: '-0.01em' }}>{g.label}</span>
            <span style={{ width: 8, height: 2, background: '#5a5a57', borderRadius: 2 }} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ position: 'relative', height: H, borderLeft: '2px solid #3a3a37' }}>
          {gridlines.map((g, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: pct(g.value) + '%', height: 1, background: 'rgba(255,255,255,0.05)' }} />
          ))}
          {target != null && (
            <>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: pct(target) + '%', height: 0, borderTop: '2px dashed #e3852f', zIndex: 3 }} />
              <div style={{ position: 'absolute', right: 6, bottom: `calc(${pct(target)}% + 6px)`, zIndex: 4 }}>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: '#e3852f', letterSpacing: '0.02em' }}>{targetLabel}</span>
              </div>
            </>
          )}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '0 14px' }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', bottom: `calc(${pct(b.value)}% + 12px)`, left: 0, right: 0, textAlign: 'center', opacity: 0, animation: 'ttw-fade 0.5s ease both', animationDelay: (0.35 + i * 0.09) + 's', zIndex: 2 }}>
                  <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: valColor(b.tone) }}>{b.text}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, width: '72%', maxWidth: 118, height: pct(b.value) + '%', borderRadius: '6px 6px 0 0', background: vgrad(b.tone), boxShadow: shadow(b.tone), transformOrigin: 'bottom', animation: 'ttw-grow 0.85s cubic-bezier(.2,.8,.2,1) both', animationDelay: (i * 0.09) + 's' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', padding: '12px 14px 0' }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 13.5, fontWeight: 500, lineHeight: 1.18, color: '#9a9a95', whiteSpace: 'pre-line', letterSpacing: '-0.01em' }}>{b.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* vertical bars on a linear axis with an optional limit line */
export function VBars({ bars, max, limit, limitLabel }) {
  const pct = (v) => (v / max) * 100;
  const H = 320;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ position: 'relative', height: H, borderLeft: '2px solid #3a3a37' }}>
        {limit != null && (
          <>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: pct(limit) + '%', height: 0, borderTop: '2px dashed #e3852f', zIndex: 3 }} />
            <div style={{ position: 'absolute', right: 6, bottom: `calc(${pct(limit)}% + 6px)`, zIndex: 4 }}>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: '#e3852f', letterSpacing: '0.02em' }}>{limitLabel}</span>
            </div>
          </>
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '0 14px' }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', bottom: `calc(${pct(b.value)}% + 10px)`, left: 0, right: 0, textAlign: 'center', opacity: 0, animation: 'ttw-fade 0.5s ease both', animationDelay: (0.35 + i * 0.08) + 's' }}>
                <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 600, color: valColor(b.tone) }}>{b.text}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, width: '64%', maxWidth: 96, height: pct(b.value) + '%', borderRadius: '6px 6px 0 0', background: vgrad(b.tone), boxShadow: shadow(b.tone), transformOrigin: 'bottom', animation: 'ttw-grow 0.8s cubic-bezier(.2,.8,.2,1) both', animationDelay: (i * 0.08) + 's' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', padding: '12px 14px 0' }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 13.5, fontWeight: 500, lineHeight: 1.18, color: '#9a9a95', whiteSpace: 'pre-line', letterSpacing: '-0.01em' }}>{b.label}</div>
        ))}
      </div>
    </div>
  );
}

/* horizontal bars, optional vertical target line over the track */
export function HBars({ bars, max, target, targetLabel, labelW = 150 }) {
  const LABELW = labelW, GAP = 16, X = LABELW + GAP;
  const pct = (v) => (v / max) * 100;
  return (
    <div style={{ position: 'relative' }}>
      {target != null && (
        <>
          <div style={{ position: 'absolute', top: -6, bottom: 22, left: `calc((100% - ${X}px) * ${target / max} + ${X}px)`, width: 0, borderLeft: '2px dashed #e3852f', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: -22, left: `calc((100% - ${X}px) * ${target / max} + ${X}px)`, transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 13, fontWeight: 600, color: '#e3852f', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{targetLabel}</div>
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: target != null ? 10 : 0 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: `${LABELW}px 1fr`, alignItems: 'center', gap: GAP }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#cfcfca', letterSpacing: '-0.01em', textAlign: 'right' }}>{b.label}</div>
            <div style={{ position: 'relative', height: 28 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: Math.max(pct(b.value), 0.4) + '%', borderRadius: 6, background: hgrad(b.tone), boxShadow: shadow(b.tone), transformOrigin: 'left', animation: 'ttw-growx 0.8s cubic-bezier(.2,.8,.2,1) both', animationDelay: (i * 0.09) + 's' }} />
              <div style={{ position: 'absolute', left: `calc(${Math.max(pct(b.value), 0)}% + 12px)`, top: 0, height: 28, display: 'flex', alignItems: 'center', opacity: 0, animation: 'ttw-fade 0.5s ease both', animationDelay: (0.3 + i * 0.09) + 's' }}>
                <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 600, color: valColor(b.tone), whiteSpace: 'nowrap' }}>{b.text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

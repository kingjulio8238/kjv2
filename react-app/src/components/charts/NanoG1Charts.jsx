/* nanoG1 feed-article charts — recreated from the Claude Design "Time to walk"
 * handoff (claude.ai/design). Dark radial card, Inter Tight + Roboto Mono,
 * gradient bars (gray -> sage -> bright "win" with glow), dashed orange target.
 * One <Chart id="..."/> per figure; data is baked in at the bottom. */

const HEAD = "'Inter Tight','Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'Roboto Mono','Space Mono',monospace";

const TONE = {
  gray:  ['#9c9c98', '#6b6b67'],
  green: ['#a9c99d', '#7ba36c'],
  win:   ['#c4e6b4', '#8fbe7d'],
  fail:  ['#d98a6b', '#b0563a'],
};
const GLOW = '0 0 26px rgba(143,190,125,0.30)';
const valColor = (t) => (t === 'win' ? '#d4efc6' : t === 'fail' ? '#f0c9b8' : '#f4f4f2');
const vgrad = (t) => `linear-gradient(180deg, ${TONE[t][0]} 0%, ${TONE[t][1]} 100%)`;
const hgrad = (t) => `linear-gradient(90deg, ${TONE[t][0]} 0%, ${TONE[t][1]} 100%)`;
const shadow = (t) => `inset 0 1px 0 rgba(255,255,255,0.18)${t === 'win' ? ', ' + GLOW : ''}`;

function Card({ sub, children }) {
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

/* vertical bars on a log axis: waterfall, samples */
function VLogBars({ bars, gridlines, vmin, vmax, target, targetLabel }) {
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

/* vertical bars on a linear axis with a single limit line: dead ends */
function VBars({ bars, max, limit, limitLabel }) {
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

/* horizontal bars, optional vertical target line over the track: throughput, gate, last second */
function HBars({ bars, max, target, targetLabel }) {
  const LABELW = 150, GAP = 16, X = LABELW + GAP;
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

/* before/after pairs: symmetry dual win */
function BeforeAfter({ panels }) {
  return (
    <div style={{ display: 'flex', gap: 28 }}>
      {panels.map((p, i) => {
        const H = 200, mx = Math.max(p.before, p.after) * 1.15;
        const h = (v) => (v / mx) * H;
        return (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#cfcfca', marginBottom: 14, letterSpacing: '-0.01em' }}>{p.title}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, height: H, borderBottom: '2px solid #3a3a37' }}>
              {[['before', 'gray', p.before, p.beforeText], ['after', 'win', p.after, p.afterText]].map(([lbl, tone, val, txt], j) => (
                <div key={j} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 600, color: valColor(tone), marginBottom: 8 }}>{txt}</span>
                  <div style={{ width: '70%', maxWidth: 90, height: h(val), borderRadius: '6px 6px 0 0', background: vgrad(tone), boxShadow: shadow(tone), transformOrigin: 'bottom', animation: 'ttw-grow 0.8s cubic-bezier(.2,.8,.2,1) both', animationDelay: (j * 0.12) + 's' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 8 }}>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 13.5, color: '#9a9a95' }}>before</div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 13.5, color: '#9a9a95' }}>after</div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: MONO, fontSize: 18, fontWeight: 600, color: '#a9c99d' }}>{p.drop}</div>
          </div>
        );
      })}
    </div>
  );
}

/* the 24x x 16x = 380x stat row */
function StatRow() {
  const Stat = ({ big, sub, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flex: 1 }}>
      <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', color, lineHeight: 1 }}>{big}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#8b8b86', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{sub}</span>
    </div>
  );
  const Op = ({ s }) => <span style={{ fontSize: 34, color: '#5a5a57', fontWeight: 400, alignSelf: 'flex-start', marginTop: 8 }}>{s}</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 0 4px' }}>
      <Stat big="24×" sub={'simulator speed\n54k → 1.3M steps/sec'} color="#a9c99d" />
      <Op s="×" />
      <Stat big="16×" sub={'learning efficiency\n1.2B → 75M practice steps'} color="#a9c99d" />
      <Op s="=" />
      <Stat big="~375×" sub={'6.1 hours → 58.9 seconds'} color="#e3852f" />
    </div>
  );
}

const ACCENT = (t) => <span style={{ color: '#e3852f', fontWeight: 600 }}>{t}</span>;

/* ---- the registry: one entry per figure used in the article ---- */
export default function Chart({ id }) {
  switch (id) {
    case 'waterfall':
      return (
        <Card sub={<>one graphics card &middot; pure reinforcement learning from scratch &middot; {ACCENT('~380× faster')} over six days</>}>
          <VLogBars
            vmin={30} vmax={43200} target={60} targetLabel="60 s target"
            gridlines={[{ label: '6 hr', value: 21600 }, { label: '1 hr', value: 3600 }, { label: '10 min', value: 600 }, { label: '1 min', value: 60 }]}
            bars={[
              { label: 'Start', value: 21600, text: '~6 hr', tone: 'gray' },
              { label: 'Faster\nsimulator', value: 804, text: '13.4 min', tone: 'gray' },
              { label: 'Tuned\nrecipe', value: 89.3, text: '89.3 s', tone: 'gray' },
              { label: 'Symmetry\npenalty', value: 67, text: '67 s', tone: 'green' },
              { label: '+ Wobble\npenalty', value: 58.9, text: '58.9 s', tone: 'win' },
            ]}
          />
        </Card>
      );
    case 'decomposition':
      return (
        <Card sub={<>training time = practice steps needed ÷ steps run per second</>}>
          <StatRow />
        </Card>
      );
    case 'throughput':
      return (
        <Card sub={<>physics steps per second &middot; Unitree G1 &middot; RTX PRO 6000 &middot; identical settings&nbsp;&nbsp;(*Genesis uses its own physics, not MuJoCo)</>}>
          <HBars max={8.0} bars={[
            { label: 'nanoG1', value: 7.25, text: '7.25M', tone: 'win' },
            { label: 'mujoco-warp', value: 4.0, text: '4.0M', tone: 'gray' },
            { label: 'Genesis*', value: 2.3, text: '2.3M', tone: 'gray' },
            { label: 'MJX', value: 1.1, text: '1.1M', tone: 'gray' },
          ]} />
        </Card>
      );
    case 'samples':
      return (
        <Card sub={<>practice steps needed to reach a walking policy &middot; {ACCENT('~16× fewer')}</>}>
          <VLogBars
            vmin={45} vmax={2200}
            gridlines={[{ label: '1B', value: 1000 }, { label: '100M', value: 100 }]}
            bars={[
              { label: 'Old\nrecipe', value: 1200, text: '1.2B', tone: 'gray' },
              { label: 'Tuned\nrecipe', value: 116, text: '116M', tone: 'gray' },
              { label: '+ Symmetry', value: 86, text: '86M', tone: 'green' },
              { label: '+ Wobble', value: 75, text: '75M', tone: 'win' },
            ]}
          />
        </Card>
      );
    case 'symmetry':
      return (
        <Card sub={<>the symmetry penalty cut practice steps {ACCENT('and')} smoothed the gait — both at once</>}>
          <BeforeAfter panels={[
            { title: 'Practice steps to walk', before: 116, after: 86, beforeText: '116M', afterText: '86M', drop: '−26%' },
            { title: 'Motion smoothness', before: 0.205, after: 0.142, beforeText: '0.205', afterText: '0.142', drop: '−31%' },
          ]} />
        </Card>
      );
    case 'lastsecond':
      return (
        <Card sub={<>a torso-wobble penalty — applied only once the robot is upright — reaches the bar sooner</>}>
          <HBars max={75} target={60} targetLabel="60 s" bars={[
            { label: 'Symmetry penalty', value: 67, text: '67.0 s', tone: 'green' },
            { label: '+ Wobble penalty', value: 58.9, text: '58.9 s', tone: 'win' },
          ]} />
        </Card>
      );
    case 'gate':
      return (
        <Card sub={<>the quality bar was fixed before the project — the 58.9-second policy clears all six checks (bar = score ÷ limit)</>}>
          <HBars max={1.2} target={1.0} targetLabel="limit" bars={[
            { label: 'falls', value: 0.0, text: '0 / 1', tone: 'win' },
            { label: 'speed tracking', value: 0.966, text: '0.93 / ≥0.90', tone: 'green' },
            { label: 'action smoothness', value: 0.924, text: '0.19 / 0.21', tone: 'green' },
            { label: 'torso wobble', value: 0.962, text: '0.20 / 0.21', tone: 'green' },
            { label: 'turn stability', value: 0.980, text: '0.196 / 0.20', tone: 'green' },
            { label: 'leg smoothness', value: 0.947, text: '1.16 / 1.22', tone: 'green' },
          ]} />
        </Card>
      );
    case 'deadends':
      return (
        <Card sub={<>every shortcut except symmetry made the walk jerkier (lower = smoother)</>}>
          <VBars max={0.32} limit={0.21} limitLabel="limit (0.21)" bars={[
            { label: 'reuse data\n2×', value: 0.27, text: '0.27', tone: 'fail' },
            { label: 'reuse data\n5×', value: 0.27, text: '0.27', tone: 'fail' },
            { label: 'easier\ncommands', value: 0.232, text: '0.23', tone: 'fail' },
            { label: 'penalize\njerk', value: 0.27, text: '0.27', tone: 'fail' },
            { label: 'Symmetry\npenalty', value: 0.142, text: '0.14', tone: 'win' },
          ]} />
        </Card>
      );
    default:
      return null;
  }
}

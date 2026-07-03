/* Charts for "Going Below the DSL" (inferencemaxxing #1, the VSA kernel).
 * Reuses the shared chartKit primitives + four bespoke cards. One <Chart
 * id="vsa-..."/> per figure; data is baked in from models/wan/LOG.md
 * (B200, H=40, S=39936, warm medians, honest scattered gather). */

import { Card, HBars, VLogBars } from './chartKit';
import { MONO, valColor } from './chartTokens';

/* capability ladder — what each layer can express (checks / crosses) */
function CapLadder({ rows, cols }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(${cols.length}, 1fr)`, gap: 0, minWidth: 460 }}>
        <div />
        {cols.map((c, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: i === cols.length - 1 ? '#c4e6b4' : '#cfcfca', paddingBottom: 14, letterSpacing: '-0.01em' }}>{c}</div>
        ))}
        {rows.map((r, ri) => (
          <div key={ri} style={{ display: 'contents' }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: '#9a9a95', padding: '13px 0', borderTop: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-0.01em' }}>{r.label}</div>
            {r.cells.map((ok, ci) => (
              <div key={ci} style={{ textAlign: 'center', padding: '13px 0', borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: MONO, fontSize: 17, fontWeight: 600, color: ok ? '#8fbe7d' : '#6b6b67' }}>
                {ok ? '✓' : '·'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* two big figures side by side (correct-but-slow vs fast-and-forked) */
function TwoStat({ items }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'stretch' }}>
      {items.map((it, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '22px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: `1px solid ${it.tone === 'win' ? 'rgba(143,190,125,0.28)' : 'rgba(255,255,255,0.06)'}` }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#9a9a95', letterSpacing: '0.01em', textTransform: 'uppercase' }}>{it.kicker}</span>
          <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 600, lineHeight: 1, color: valColor(it.tone) }}>{it.big}</span>
          <span style={{ fontSize: 14.5, fontWeight: 500, color: '#cfcfca', letterSpacing: '-0.01em' }}>{it.sub}</span>
          <span style={{ fontSize: 13.5, color: it.tone === 'win' ? '#a9c99d' : '#d98a6b', fontWeight: 500 }}>{it.verdict}</span>
        </div>
      ))}
    </div>
  );
}

/* parity gate — three stat tiles */
function ParityCard({ tiles, verdict }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 14 }}>
        {tiles.map((t, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '20px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600, color: t.win ? '#d4efc6' : '#f4f4f2' }}>{t.value}</div>
            <div style={{ fontSize: 13.5, color: '#9a9a95', marginTop: 8, letterSpacing: '-0.01em' }}>{t.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, textAlign: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 600, letterSpacing: '0.08em', color: '#8fbe7d' }}>{verdict}</div>
    </div>
  );
}

/* failure log — problem -> fix rows */
function FailLog({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#f0c9b8', letterSpacing: '-0.01em' }}>{r.problem}</span>
          <span style={{ fontFamily: MONO, fontSize: 18, color: '#5a5a57' }}>&rarr;</span>
          <span style={{ fontSize: 15, fontWeight: 500, color: '#a9c99d', letterSpacing: '-0.01em', textAlign: 'right' }}>{r.fix}</span>
        </div>
      ))}
    </div>
  );
}

/* findings that didn't pay off — lever + neutral outcome, muted ✗ */
function Findings({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'baseline', gap: 14, padding: '15px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: MONO, fontSize: 15, color: '#b0563a', fontWeight: 600 }}>&#10005;</span>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: '#cfcfca', letterSpacing: '-0.01em' }}>
            <b style={{ color: '#f4f4f2', fontWeight: 600 }}>{r.lever}</b> — {r.outcome}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Chart({ id }) {
  switch (id) {
    case 'vsa-e2e':
      return (
        <Card sub={<>end-to-end time to generate one 5-second 480p clip &middot; one B200 &middot; lower is faster</>}>
          <VLogBars
            vmin={3} vmax={420}
            gridlines={[{ label: '365 s', value: 365 }, { label: '60 s', value: 60 }, { label: '10 s', value: 10 }, { label: '4 s', value: 4 }]}
            bars={[
              { label: 'Dense\nbaseline', value: 365, text: '365 s', tone: 'gray' },
              { label: '+ VSA\nkernel', value: 215, text: '215 s', tone: 'gray' },
              { label: '+ 4-step\ndistill', value: 11.2, text: '11.2 s', tone: 'green' },
              { label: '+ compile', value: 6.9, text: '6.9 s', tone: 'green' },
              { label: '+ NVFP4', value: 5.1, text: '5.1 s', tone: 'green' },
              { label: '+ fuse\n& ship', value: 4.0, text: '4.0 s', tone: 'win' },
            ]}
          />
        </Card>
      );
    case 'vsa-steps':
      return (
        <Card sub={<>denoising steps per clip &middot; a distilled 4-step schedule replaces the 40-step loop</>}>
          <HBars max={40} labelW={168} bars={[
            { label: 'Dense loop', value: 40, text: '40 steps', tone: 'gray' },
            { label: 'Distilled', value: 4, text: '4 steps  ·  32.6×', tone: 'win' },
          ]} />
        </Card>
      );
    case 'vsa-fp4':
      return (
        <Card sub={<>NVFP4 (four-bit) on the projection matmuls &middot; the fight was tooling, not math</>}>
          <TwoStat items={[
            { kicker: 'bf16 → NVFP4', big: '2.46×', sub: 'on the projection GEMMs', verdict: '406 Linears quantized, no visible quality cost', tone: 'win' },
            { kicker: 'end-to-end', big: '5.1 s', sub: '71× over baseline', verdict: '−1.8 s vs the compiled run', tone: 'win' },
          ]} />
        </Card>
      );
    case 'vsa-budget':
      return (
        <Card sub={<>where the 4.0 s goes &middot; the whole gap to the ~2.5 s public best is the glue</>}>
          <HBars max={1.4} labelW={140} bars={[
            { label: 'VAE decode', value: 1.3, text: '1.3 s  ·  shared', tone: 'gray' },
            { label: 'DiT glue', value: 1.05, text: '1.05 s  ·  the gap', tone: 'fail' },
            { label: 'VSA kernel', value: 0.99, text: '0.99 s', tone: 'green' },
            { label: 'fp4 GEMM', value: 0.51, text: '0.51 s', tone: 'gray' },
            { label: 'fp4 quant', value: 0.16, text: '0.16 s', tone: 'gray' },
          ]} />
        </Card>
      );
    case 'vsa-honest':
      return (
        <Card sub={<>three good ideas, measured, and set down &mdash; the credibility</>}>
          <Findings rows={[
            { lever: 'Hand-fused norm kernels', outcome: 'beat eager 1.92×, but lose to torch.compile once compiled — Inductor fuses across more ops' },
            { lever: 'CUDA-graph the decoder', outcome: '1.02× — the VAE is compute-bound, not launch-bound, so there are no launches to hide' },
            { lever: 'Train the quality back', outcome: 'held-out flat (0.926 → 0.921) — at 14B the model already tolerates the sparsity' },
          ]} />
        </Card>
      );
    case 'vsa-ladder':
      return (
        <Card sub={<>attention kernel latency &middot; B200 &middot; 40 heads, seq&nbsp;39,936 &middot; lower is faster</>}>
          <HBars max={40} target={3.36} targetLabel="floor 3.36 ms" labelW={168} bars={[
            { label: 'Dense attention', value: 38.5, text: '38.5 ms', tone: 'gray' },
            { label: 'Triton (compiled)', value: 20.2, text: '20.2 ms', tone: 'gray' },
            { label: 'Ours (hand-CUDA)', value: 4.99, text: '4.99 ms', tone: 'win' },
          ]} />
        </Card>
      );
    case 'vsa-floor':
      return (
        <Card sub={<>how far each approach lands from the {'×'} hardware floor &middot; the floor is the number you can&apos;t beat</>}>
          <VLogBars
            vmin={1.0} vmax={100}
            gridlines={[{ label: '80×', value: 80 }, { label: '10×', value: 10 }, { label: '1× floor', value: 1.0 }]}
            target={1.0} targetLabel="floor"
            bars={[
              { label: 'From-scratch\nWMMA', value: 80, text: '80×', tone: 'fail' },
              { label: 'Triton\ncompiler', value: 6.0, text: '6.0×', tone: 'gray' },
              { label: 'Hand-CUDA\nfork', value: 1.49, text: '1.49×', tone: 'win' },
            ]}
          />
        </Card>
      );
    case 'vsa-ceiling':
      return (
        <Card sub={<>the optimizations that close the gap live below the DSL &mdash; the compiler makes these choices for you</>}>
          <CapLadder
            cols={['PyTorch', 'Triton', 'Hand-CUDA']}
            rows={[
              { label: 'Warp specialization', cells: [false, false, true] },
              { label: 'tcgen05 / TMEM path', cells: [false, false, true] },
              { label: 'TMA scattered gather', cells: [false, false, true] },
              { label: 'Count-based barriers', cells: [false, false, true] },
              { label: 'Block-sparse skip', cells: [false, true, true] },
            ]}
          />
        </Card>
      );
    case 'vsa-build':
      return (
        <Card sub={<>correct-but-slow proved the mechanism; fast-and-forked shipped it</>}>
          <TwoStat items={[
            { kicker: 'From scratch', big: '270 ms', sub: '80× off the floor', verdict: 'correct — but hopeless for speed', tone: 'fail' },
            { kicker: 'Forked FMHA', big: '4.99 ms', sub: '1.49× off the floor', verdict: 'inherits the full opt ladder', tone: 'win' },
          ]} />
        </Card>
      );
    case 'vsa-scatter':
      return (
        <Card sub={<>gathering scattered key blocks vs contiguous ones &middot; the whole point of sparsity, nearly free</>}>
          <HBars max={40} labelW={168} bars={[
            { label: 'Dense (all blocks)', value: 38.5, text: '38.5 ms', tone: 'gray' },
            { label: 'Sparse, contiguous', value: 4.91, text: '4.91 ms', tone: 'green' },
            { label: 'Sparse, scattered', value: 4.99, text: '4.99 ms  (1.02×)', tone: 'win' },
          ]} />
        </Card>
      );
    case 'vsa-parity':
      return (
        <Card sub={<>kernel vs a reference over the same selected blocks &middot; lossless, per attention head</>}>
          <ParityCard
            tiles={[
              { value: '1.00000', label: 'cosine similarity', win: true },
              { value: '2.4e-3', label: 'relative error', win: true },
              { value: 'per-head', label: 'exactness', win: false },
            ]}
            verdict="LOSSLESS — computes exactly what it claims"
          />
        </Card>
      );
    case 'vsa-deadends':
      return (
        <Card sub={<>going to the metal means you own the bugs the compiler used to hide</>}>
          <FailLog rows={[
            { problem: 'From-scratch kernel, 80× off floor', fix: 'fork a warp-specialized FMHA instead' },
            { problem: 'Only the load warp knew the block count → deadlock', fix: 'thread one shared count to every warp' },
            { problem: 'Varlen path deref’d null → GPU fault at 0x0', fix: 'one-line guard on the null pointer' },
          ]} />
        </Card>
      );
    default:
      return null;
  }
}

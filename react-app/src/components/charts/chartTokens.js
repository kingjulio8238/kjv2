/* Shared chart style tokens + helpers (no components — keeps fast-refresh happy).
 * Dark radial card, Inter Tight + Roboto Mono, gradient bars, sage "win" glow. */

export const HEAD = "'Inter Tight','Helvetica Neue',Helvetica,Arial,sans-serif";
export const MONO = "'Roboto Mono','Space Mono',monospace";

export const TONE = {
  gray:  ['#9c9c98', '#6b6b67'],
  green: ['#a9c99d', '#7ba36c'],
  win:   ['#c4e6b4', '#8fbe7d'],
  fail:  ['#d98a6b', '#b0563a'],
};
const GLOW = '0 0 26px rgba(143,190,125,0.30)';

export const valColor = (t) => (t === 'win' ? '#d4efc6' : t === 'fail' ? '#f0c9b8' : '#f4f4f2');
export const vgrad = (t) => `linear-gradient(180deg, ${TONE[t][0]} 0%, ${TONE[t][1]} 100%)`;
export const hgrad = (t) => `linear-gradient(90deg, ${TONE[t][0]} 0%, ${TONE[t][1]} 100%)`;
export const shadow = (t) => `inset 0 1px 0 rgba(255,255,255,0.18)${t === 'win' ? ', ' + GLOW : ''}`;

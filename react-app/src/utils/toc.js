// Derive an article's table of contents straight from its markdown, so a new
// entry gets a TOC for free — no hand-maintained list to drift out of sync.
// Ids come from the same slugify() the h2/h3 renderers use, which is what lets
// the scroll-spy and the anchors agree.
import { slugify } from './slug';

// Fenced code blocks can contain lines starting with "#", which are not
// headings. Strip them before scanning.
const stripFences = (md) => String(md).replace(/^```[\s\S]*?^```/gm, '');

export function extractHeadings(markdown) {
  const out = [];
  for (const line of stripFences(markdown).split('\n')) {
    const m = /^(##|###)\s+(.*\S)\s*$/.exec(line);
    if (!m) continue;
    // drop inline markdown emphasis/code/links from the label
    const text = m[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    out.push({ id: slugify(text), text, level: m[1].length });
  }
  return out;
}

// The trailing italic line every entry closes with — sources, or the bill.
// Split it off so the layout can set it as a footnote rather than body prose.
//
// Matched structurally rather than by one regex over the whole document: an
// earlier standalone italic paragraph mid-article (tokens-are-a-knob has one at
// line 11) would otherwise anchor a lazy match that swallows the entire body.
// Only the final rule, or failing that the final paragraph, is ever considered.
const isNote = (t) => /^\*[^*][\s\S]*\*$/.test(t) && !t.includes('\n\n');

export function splitClosingNote(markdown) {
  const md = String(markdown).replace(/\s+$/, '');

  // preferred shape: a `---` rule with an italic tail after it
  const rule = md.lastIndexOf('\n---\n');
  if (rule !== -1) {
    const tail = md.slice(rule + 5).trim();
    if (isNote(tail)) return { body: md.slice(0, rule), note: tail };
  }

  // otherwise the last paragraph, if it is wholly italic
  const para = md.lastIndexOf('\n\n');
  if (para !== -1) {
    const tail = md.slice(para + 2).trim();
    if (isNote(tail)) return { body: md.slice(0, para), note: tail };
  }

  return { body: md, note: null };
}

// ~230 wpm, charts and tables excluded — close enough to be useful, and it is
// derived rather than asserted.
export function readingMinutes(markdown) {
  const words = stripFences(markdown)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/^\|.*$/gm, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

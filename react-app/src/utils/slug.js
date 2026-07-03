// Slugify heading text into an anchor id. Used by both the article's h2
// renderer (to set ids) and the SpeedTimeline (to find sections to observe),
// so the two always agree.
export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Flatten ReactMarkdown heading children (string | array | elements) to text.
export function childrenToText(children) {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (typeof children === 'object' && children.props) return childrenToText(children.props.children);
  return String(children);
}

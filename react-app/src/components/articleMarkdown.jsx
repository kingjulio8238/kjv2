/* Shared ReactMarkdown renderer overrides, used by both article layouts.
 * - ![](/chart/<id>) becomes a live React chart, and its wrapping <p> is
 *   unwrapped so the chart <div> isn't nested inside a paragraph
 * - h2/h3 get anchor ids, which is what the contents list observes */
import Chart from './charts';
import { slugify, childrenToText } from '../utils/slug';

const CHART = '/chart/';
export const isChart = (src) => typeof src === 'string' && src.startsWith(CHART);

export const markdownComponents = {
  img({ src, alt }) {
    return isChart(src) ? <Chart id={src.slice(CHART.length)} /> : <img src={src} alt={alt} />;
  },
  h2({ children }) {
    return <h2 id={slugify(childrenToText(children))}>{children}</h2>;
  },
  h3({ children }) {
    return <h3 id={slugify(childrenToText(children))}>{children}</h3>;
  },
  p({ node, children }) {
    const only = node?.children?.length === 1 ? node.children[0] : null;
    if (only?.tagName === 'img' && isChart(only.properties?.src)) return <>{children}</>;
    return <p>{children}</p>;
  },
};

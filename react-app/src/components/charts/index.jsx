/* Chart dispatcher: route ![](/chart/<id>) ids to the right per-article chart
 * set. New pieces add a prefix + a component here. */
import NanoG1Chart from './NanoG1Charts';
import VsaChart from './VsaCharts';
import HelixChart from './HelixCharts';

export default function Chart({ id }) {
  if (id.startsWith('vsa-')) return <VsaChart id={id} />;
  if (id.startsWith('helix-')) return <HelixChart id={id} />;
  return <NanoG1Chart id={id} />;
}

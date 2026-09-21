/* Chart dispatcher: route ![](/chart/<id>) ids to the module that owns them.
 * Ids are unique across the feed, and every module draws with ./paperKit. */
import NanoG1Chart from './NanoG1Charts';
import VsaChart from './VsaCharts';
import RoboticsChart from './RoboticsCharts';

export default function Chart({ id }) {
  if (id.startsWith('helix-')) return <RoboticsChart id={id} />;
  if (id.startsWith('vsa-')) return <VsaChart id={id} />;
  return <NanoG1Chart id={id} />;
}

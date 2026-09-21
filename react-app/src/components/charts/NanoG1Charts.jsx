/* nanoG1 charts — a Unitree G1 learning to walk from scratch on
 * one graphics card, from ~6.1 hours down to 58.9 seconds.
 *
 * Drawn in the paper template's chart language (see ./paperKit). Data is baked
 * in from the training logs: RTX PRO 6000, pure RL from scratch, warm medians.
 * One <Chart id="..."/> per figure. */

import { Figure, VBars, HBars, Tiles, Equation } from './paperKit';

export default function Chart({ id }) {
  switch (id) {
    /* the descent: ~6 hours to 58.9 seconds across five builds */
    case 'waterfall':
      return (
        <Figure
          title="Time to train a walking policy from scratch"
          caption={[
            'SIX DAYS, FIVE BUILDS, ~375×',
            'One graphics card · pure reinforcement learning from scratch · lower is faster',
          ]}
        >
          <VBars
            log vmin={30} vmax={43200}
            axisLabel="Time to walk · log scale"
            target={60}
            targetLabel="60 s target"
            ticks={[
              { value: 21600, label: '6 hr' },
              { value: 3600, label: '1 hr' },
              { value: 600, label: '10 min' },
              { value: 60, label: '1 min' },
            ]}
            bars={[
              { label: 'Start', value: 21600, text: '~6 hr', tone: 'gray' },
              { label: 'Faster\nsimulator', value: 804, text: '13.4 min', tone: 'gray' },
              { label: 'Tuned\nrecipe', value: 89.3, text: '89.3 s', tone: 'gray' },
              { label: 'Symmetry\npenalty', value: 67, text: '67 s', tone: 'green' },
              { label: '+ Wobble\npenalty', value: 58.9, text: '58.9 s', tone: 'win' },
            ]}
          />
        </Figure>
      );

    /* the speedup factors into two independent wins */
    case 'decomposition':
      return (
        <Figure
          title="Training time is practice steps needed, divided by steps run per second"
          caption={[
            'TWO INDEPENDENT WINS, MULTIPLIED',
            'Neither factor alone gets there — the simulator got faster and the recipe needed less practice.',
          ]}
        >
          <Equation items={[
            { big: '24×', sub: 'simulator speed\n54k → 1.3M steps/sec' },
            { op: '×' },
            { big: '16×', sub: 'learning efficiency\n1.2B → 75M practice steps' },
            { op: '=' },
            { big: '~375×', sub: '6.1 hours → 58.9 seconds', accent: true },
          ]} />
        </Figure>
      );

    case 'throughput':
      return (
        <Figure
          title="Physics steps per second, on identical settings"
          caption={[
            'SIMULATOR THROUGHPUT',
            'Unitree G1 · RTX PRO 6000 · identical settings. Genesis uses its own physics, not MuJoCo.',
          ]}
        >
          <HBars max={8.0} labelW={150} bars={[
            { label: 'nanoG1', value: 7.25, text: '7.25M', tone: 'win' },
            { label: 'mujoco-warp', value: 4.0, text: '4.0M', tone: 'gray' },
            { label: 'Genesis*', value: 2.3, text: '2.3M', tone: 'gray' },
            { label: 'MJX', value: 1.1, text: '1.1M', tone: 'gray' },
          ]} />
        </Figure>
      );

    case 'samples':
      return (
        <Figure
          title="Practice steps needed to reach a walking policy"
          caption={[
            '~16× FEWER',
            'The recipe, not the hardware — the same policy learned from a sixteenth of the experience.',
          ]}
        >
          <VBars
            log vmin={45} vmax={2200}
            axisLabel="Practice steps · log scale"
            ticks={[
              { value: 1000, label: '1B' },
              { value: 100, label: '100M' },
            ]}
            bars={[
              { label: 'Old\nrecipe', value: 1200, text: '1.2B', tone: 'gray' },
              { label: 'Tuned\nrecipe', value: 116, text: '116M', tone: 'gray' },
              { label: '+ Symmetry', value: 86, text: '86M', tone: 'green' },
              { label: '+ Wobble', value: 75, text: '75M', tone: 'win' },
            ]}
          />
        </Figure>
      );

    /* the symmetry penalty paid twice — fewer steps AND a smoother gait */
    case 'symmetry':
      return (
        <Figure
          title="The symmetry penalty cut practice steps and smoothed the gait, both at once"
          caption={[
            'ONE CHANGE, TWO WINS',
            'Usually these trade against each other — buying smoothness costs sample efficiency. Here it did not.',
          ]}
        >
          <Tiles items={[
            { label: 'Practice steps to walk', big: '−26%', sub: '116M → 86M steps' },
            { label: 'Motion smoothness', big: '−31%', sub: '0.205 → 0.142 · lower is smoother' },
          ]} />
        </Figure>
      );

    case 'lastsecond':
      return (
        <Figure
          title="A torso-wobble penalty, applied only once the robot is upright"
          caption={[
            'THE LAST EIGHT SECONDS',
            'Gating the penalty on being upright is what makes it help — applied from the start it fights the robot standing up.',
          ]}
        >
          <HBars max={75} target={60} targetLabel="60 s" labelW={168} bars={[
            { label: 'Symmetry penalty', value: 67, text: '67.0 s', tone: 'green' },
            { label: '+ Wobble penalty', value: 58.9, text: '58.9 s', tone: 'win' },
          ]} />
        </Figure>
      );

    case 'gate':
      return (
        <Figure
          title="The 58.9-second policy clears all six quality checks"
          caption={[
            'SCORE ÷ LIMIT — THE BAR WAS FIXED BEFORE THE PROJECT',
            'Bars reaching the dashed line would be at the limit. Speed tracking is a floor, the rest are ceilings.',
          ]}
        >
          <HBars max={1.2} target={1.0} targetLabel="limit" labelW={168} bars={[
            { label: 'falls', value: 0.0, text: '0 / 1', tone: 'win' },
            { label: 'speed tracking', value: 0.966, text: '0.93 / ≥0.90', tone: 'green' },
            { label: 'action smoothness', value: 0.924, text: '0.19 / 0.21', tone: 'green' },
            { label: 'torso wobble', value: 0.962, text: '0.20 / 0.21', tone: 'green' },
            { label: 'turn stability', value: 0.980, text: '0.196 / 0.20', tone: 'green' },
            { label: 'leg smoothness', value: 0.947, text: '1.16 / 1.22', tone: 'green' },
          ]} />
        </Figure>
      );

    case 'deadends':
      return (
        <Figure
          title="Every shortcut except symmetry made the walk jerkier"
          caption={[
            'DEAD ENDS',
            'Action smoothness against the 0.21 limit · lower is smoother. Four good ideas, measured, and set down.',
          ]}
        >
          <VBars
            max={0.32}
            axisLabel="Action smoothness · lower is better"
            target={0.21}
            targetLabel="limit · 0.21"
            ticks={[
              { value: 0, label: '0' },
              { value: 0.1, label: '0.10' },
              { value: 0.2, label: '0.20' },
              { value: 0.3, label: '0.30' },
            ]}
            bars={[
              { label: 'reuse data\n2×', value: 0.27, text: '0.27', tone: 'fail' },
              { label: 'reuse data\n5×', value: 0.27, text: '0.27', tone: 'fail' },
              { label: 'easier\ncommands', value: 0.232, text: '0.23', tone: 'fail' },
              { label: 'penalize\njerk', value: 0.27, text: '0.27', tone: 'fail' },
              { label: 'Symmetry\npenalty', value: 0.142, text: '0.14', tone: 'win' },
            ]}
          />
        </Figure>
      );

    default:
      return null;
  }
}

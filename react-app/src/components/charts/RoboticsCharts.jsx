/* Charts for every entry in the Robotics collection, drawn in the paper
 * template's chart language (see ./paperKit).
 *
 * The collection runs predicted-then-measured, and the figures are split the
 * same way. The first three come from the decode arithmetic in notes/b1.py:
 * H100, 989 TFLOP/s BF16 at 40% MFU, 64 tokens per input frame at 256² with a
 * Wan-VAE-class tokenizer, decode taken from NVIDIA's PyNvVideoCodec 1080p
 * H.264 figures. The rest are measured on one H100 against real egocentric
 * video. Where a prediction was later falsified the caption says so, because
 * the gap between the two is the point of the collection.
 *
 * One <Chart id="helix-..."/> per figure. */

import { Figure, VBars, HBars } from './paperKit';

export default function RoboticsChart({ id }) {
  /* Frames/s one H100 can TRAIN, by model size, against what it can DECODE.
   * Bars above the dashed line are starved for frames; below it the decoder
   * keeps up and the tensor cores are the constraint. */
  if (id === 'helix-crossover') {
    return (
      <Figure
        title="What one H100 can train, against what it can decode"
        caption={[
          'THE CROSSOVER — PREDICTED',
          'Frames per second by model size, against the ~2,500 fps its 7 NVDEC engines supply at 1080p H.264. Measured later at 2.4B, not 412M.',
        ]}
      >
        <VBars
          log vmin={50} vmax={6000}
          axisLabel="Frames per second · log scale"
          target={2500}
          targetLabel="decode ceiling · 2,500 fps"
          ticks={[
            { value: 100, label: '100' },
            { value: 1000, label: '1k' },
            { value: 5000, label: '5k' },
          ]}
          bars={[
            { value: 3434, text: '3,434', label: '300M\nablation', tone: 'fail' },
            { value: 2498, text: '2,498', label: '412M\nN_crit', tone: 'gray' },
            { value: 1030, text: '1,030', label: '1B', tone: 'green' },
            { value: 147, text: '147', label: '7B', tone: 'green' },
            { value: 74, text: '74', label: '14B\nworld model', tone: 'green' },
          ]}
        />
      </Figure>
    );
  }

  /* N_crit swept over source capture format, training fixed at 256². Bars above
   * the 300M line mean a 300M ablation is starved; below it, compute-bound. */
  if (id === 'helix-format-sweep') {
    return (
      <Figure
        title="The crossover moves 15× on a capture decision made before any training code runs"
        caption={[
          'SWEPT OVER SOURCE FORMAT',
          'Training fixed at 256². A 300M ablation is compute-bound from a 720p source and five times inside the decode-bound region from 4K.',
        ]}
      >
        <VBars
          log vmin={60} vmax={2600}
          axisLabel="Crossover parameter count · log scale"
          target={300}
          targetLabel="300M ablation"
          ticks={[
            { value: 100, label: '100M' },
            { value: 1000, label: '1B' },
          ]}
          bars={[
            { value: 1592, text: '1,592M', label: '4K\nsource', tone: 'fail' },
            { value: 407, text: '407M', label: '1080p\nsource', tone: 'gray' },
            { value: 193, text: '193M', label: '720p\nsource', tone: 'green' },
            { value: 103, text: '103M', label: '480p\nsource', tone: 'green' },
          ]}
        />
      </Figure>
    );
  }

  /* One hour of Index, three ways to keep it. Latents are SMALLER than the
   * compressed source they came from — you discard resolution you'd never
   * train on. */
  if (id === 'helix-storage') {
    return (
      <Figure
        title="Encoding to latents up front shrinks the bill 4.1×"
        caption={[
          'ONE HOUR OF INDEX VIDEO, STORED THREE WAYS',
          'Latents come out smaller than the compressed source, because they throw away resolution that was never going to reach the model.',
        ]}
      >
        <HBars
          max={26} labelW={168}
          bars={[
            { value: 22.5, text: '22.5 GB/h · 414 PB/yr', label: '4K30 source', tone: 'fail' },
            { value: 3.6, text: '3.6 GB/h · 66 PB/yr', label: '1080p30 source', tone: 'gray' },
            { value: 0.88, text: '0.88 GB/h · 16 PB/yr', label: 'latents, 256²', tone: 'win' },
          ]}
        />
      </Figure>
    );
  }

  /* ---- measured: the loader (loader-gate-fails) -------------------------- */

  /* 8.2× from decoding whole clips instead of seeking to random windows */
  if (id === 'helix-loader-8x') {
    return (
      <Figure
        title="Milliseconds per training step, at 150M parameters"
        caption={[
          'THE 8.2×',
          'The dashed line is the ceiling — the same model fed pre-made tensors, with no data path at all. Lower is better.',
        ]}
      >
        <VBars
          log vmin={60} vmax={3000}
          axisLabel="Milliseconds per step · log scale"
          target={93}
          targetLabel="ceiling · 93 ms"
          ticks={[
            { value: 100, label: '100ms' },
            { value: 1000, label: '1s' },
          ]}
          bars={[
            { value: 2296, text: '2,296', label: 'naive\nseek per sample', tone: 'fail' },
            { value: 280, text: '280', label: 'whole clip\nserial', tone: 'win' },
            { value: 273, text: '273', label: 'whole clip\n+ overlap', tone: 'win' },
          ]}
        />
      </Figure>
    );
  }

  /* the gate: efficiency climbs with model size and still misses 0.80 */
  if (id === 'helix-gate-gc') {
    return (
      <Figure
        title="Data-path efficiency climbs with model size, and still misses the gate"
        caption={[
          'STEP TIME ON REAL VIDEO ÷ STEP TIME ON PRE-MADE TENSORS',
          '1.0 would mean the loader is free. Every size measured misses the 0.80 bar; extrapolating puts the crossing near 3B. Only measured points are plotted.',
        ]}
      >
        <VBars
          max={1.0}
          axisLabel="Data-path efficiency"
          target={0.8}
          targetLabel="gate · 0.80"
          ticks={[
            { value: 0, label: '0' },
            { value: 0.25, label: '0.25' },
            { value: 0.5, label: '0.50' },
            { value: 0.75, label: '0.75' },
            { value: 1.0, label: '1.00' },
          ]}
          bars={[
            { value: 0.206, text: '0.206', label: '150M', tone: 'fail' },
            { value: 0.532, text: '0.532', label: '450M', tone: 'gray' },
            { value: 0.595, text: '0.595', label: '900M', tone: 'gray' },
            { value: 0.685, text: '0.685', label: '1.8B', tone: 'green' },
          ]}
        />
      </Figure>
    );
  }

  /* ---- measured: the decode floor (decode-measured) ---------------------- */

  /* the concurrency curve finds the 7-engine ceiling unaided */
  if (id === 'helix-nvdec-scaling') {
    return (
      <Figure
        title="The scaling curve finds the seven NVDEC engines without being told"
        caption={[
          'DECODE THROUGHPUT BY CONCURRENT DECODER INSTANCES',
          'Real egocentric video at 1920×1456. One to seven workers buys 5.14×; seven to fourteen buys 1.09×. The H100 has exactly seven NVDEC engines.',
        ]}
      >
        <VBars
          log vmin={200} vmax={2000}
          axisLabel="Frames per second · log scale"
          target={1352}
          targetLabel="7 NVDEC engines"
          ticks={[
            { value: 250, label: '250' },
            { value: 500, label: '500' },
            { value: 1000, label: '1k' },
          ]}
          bars={[
            { value: 263, text: '263', label: '1\nworker', tone: 'fail' },
            { value: 552, text: '552', label: '2', tone: 'gray' },
            { value: 744, text: '744', label: '4', tone: 'gray' },
            { value: 1352, text: '1,352', label: '7', tone: 'win' },
            { value: 1470, text: '1,470', label: '14', tone: 'green' },
          ]}
        />
      </Figure>
    );
  }

  /* how you sample is worth 9.8× in fleet size, at identical supervision */
  if (id === 'helix-sampling-policy') {
    return (
      <Figure
        title="A sampling choice no VLA paper states, worth 9.8× in fleet size"
        caption={[
          'GPUS OF PURE DECODE NEEDED TO KEEP PACE WITH INDEX',
          'At 2,100× realtime, stereo. Identical supervision either way — the difference is entirely how you sample.',
        ]}
      >
        <HBars
          max={2500} labelW={214}
          bars={[
            { value: 147, text: '147 GPUs', label: 'whole clip · 7 workers', tone: 'win' },
            { value: 479, text: '479 GPUs', label: 'whole clip · 1 worker', tone: 'gray' },
            { value: 1443, text: '1,443 GPUs', label: '16-frame windows · 7 workers', tone: 'fail' },
            { value: 2295, text: '2,295 GPUs', label: '16-frame windows · 1 worker', tone: 'fail' },
          ]}
        />
      </Figure>
    );
  }

  /* the prediction I got backwards */
  if (id === 'helix-gop-falsified') {
    return (
      <Figure
        title="I predicted longer GOP would be slower. It is the other way round."
        caption={[
          'RANDOM 16-FRAME WINDOWS, BY KEYFRAME INTERVAL',
          'The prediction was more frames to decode forward from the preceding keyframe. Measured, the longer intervals decode faster.',
        ]}
      >
        <HBars
          max={52} labelW={190}
          bars={[
            { value: 24.4, text: '24.4 fps', label: 'GOP 15 (predicted best)', tone: 'fail' },
            { value: 41.7, text: '41.7 fps', label: 'GOP 170 (native)', tone: 'gray' },
            { value: 47.2, text: '47.2 fps', label: 'GOP 250 (predicted worst)', tone: 'win' },
          ]}
        />
      </Figure>
    );
  }

  /* ---- the metric that misleads (tokens-are-a-knob) ---------------------- */

  if (id === 'helix-tokenizers') {
    return (
      <Figure
        title="The same video gives an 8× spread in token count"
        caption={[
          'TOKENS PER INPUT FRAME AT 256², THREE MAINSTREAM TOKENIZERS',
          'A design choice, not a property of the data — which is why a scaling law stated in tokens does not transfer between labs.',
        ]}
      >
        <HBars
          max={72} labelW={196}
          bars={[
            { value: 64, text: '64 tokens/frame', label: 'Wan-VAE · 8×8×4', tone: 'fail' },
            { value: 32, text: '32 tokens/frame', label: 'Cosmos continuous · 8×8×8', tone: 'gray' },
            { value: 8, text: '8 tokens/frame', label: 'Cosmos discrete · 8×16×16', tone: 'green' },
          ]}
        />
      </Figure>
    );
  }

  return null;
}

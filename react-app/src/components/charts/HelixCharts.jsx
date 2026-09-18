/* Charts for the Robotics collection — the Index / video-pretraining pieces.
 * Data is baked in from the decode arithmetic (notes/b1.py): H100, 989 TFLOP/s
 * BF16 at 40% MFU, 64 tokens per input frame at 256^2 with a Wan-VAE-class
 * tokenizer, decode measured against NVIDIA's PyNvVideoCodec 1080p H.264
 * figures. One <Chart id="helix-..."/> per figure. */

import { Card, HBars, VBars, VLogBars } from './chartKit';

export default function HelixChart({ id }) {
  /* frames/s a single H100 can TRAIN, by model size, against what it can DECODE.
   * Bars above the dashed line are starved for frames; below it, the decoder is
   * keeping up and the tensor cores are the constraint. */
  if (id === 'helix-crossover') {
    return (
      <Card sub="Frames per second one H100 can train, by model size — against the ~2,500 fps its 7 NVDEC engines supply at 1080p H.264. The crossover sits at 412M parameters.">
        <VLogBars
          vmin={50}
          vmax={6000}
          gridlines={[
            { value: 100, label: '100' },
            { value: 1000, label: '1k' },
            { value: 5000, label: '5k' },
          ]}
          target={2500}
          targetLabel="decode ceiling · 2,500 fps"
          bars={[
            { value: 3434, text: '3,434', label: '300M\nablation', tone: 'fail' },
            { value: 2498, text: '2,498', label: '412M\nN_crit', tone: 'gray' },
            { value: 1030, text: '1,030', label: '1B', tone: 'green' },
            { value: 147, text: '147', label: '7B', tone: 'green' },
            { value: 74, text: '74', label: '14B\nworld model', tone: 'green' },
          ]}
        />
      </Card>
    );
  }

  /* N_crit swept over source capture format, training fixed at 256^2. Bars above
   * the 300M line mean a 300M ablation is starved; below it, it is compute-bound.
   * A 15x range from one capture decision. */
  if (id === 'helix-format-sweep') {
    return (
      <Card sub="The crossover, swept over capture format, with training fixed at 256². A 300M ablation is compute-bound from a 720p source and five times inside the decode-bound region from 4K — from one decision made before any training code runs.">
        <VLogBars
          vmin={60}
          vmax={2600}
          gridlines={[
            { value: 100, label: '100M' },
            { value: 1000, label: '1B' },
          ]}
          target={300}
          targetLabel="300M ablation"
          bars={[
            { value: 1592, text: '1,592M', label: '4K\nsource', tone: 'fail' },
            { value: 407, text: '407M', label: '1080p\nsource', tone: 'gray' },
            { value: 193, text: '193M', label: '720p\nsource', tone: 'green' },
            { value: 103, text: '103M', label: '480p\nsource', tone: 'green' },
          ]}
        />
      </Card>
    );
  }

  /* the loader result: 8.2x from decoding whole clips instead of seeking */
  if (id === 'helix-loader-8x') {
    return (
      <Card sub="Milliseconds per training step at 150M parameters. The dashed line is the ceiling — the same model fed pre-made tensors, with no data path at all. Lower is better.">
        <VLogBars
          vmin={60}
          vmax={3000}
          gridlines={[
            { value: 100, label: '100ms' },
            { value: 1000, label: '1s' },
          ]}
          target={93}
          targetLabel="ceiling · 93 ms"
          bars={[
            { value: 2296, text: '2,296', label: 'naive\nseek per sample', tone: 'fail' },
            { value: 280, text: '280', label: 'whole clip\nserial', tone: 'win' },
            { value: 273, text: '273', label: 'whole clip\n+ overlap', tone: 'win' },
          ]}
        />
      </Card>
    );
  }

  /* gate GC: efficiency climbs with model size and still misses 0.80 */
  if (id === 'helix-gate-gc') {
    return (
      <Card sub="Data-path efficiency — step time fed by real video, divided by step time fed by pre-made tensors. 1.0 means the loader is free. The dashed line is the 80% bar; every size measured misses it, and the extrapolation puts the crossing near 3B. Only measured points are plotted.">
        <VBars
          max={1.0}
          limit={0.8}
          limitLabel="gate · 0.80"
          bars={[
            { value: 0.206, text: '0.206', label: '150M', tone: 'fail' },
            { value: 0.532, text: '0.532', label: '450M', tone: 'gray' },
            { value: 0.595, text: '0.595', label: '900M', tone: 'gray' },
            { value: 0.685, text: '0.685', label: '1.8B', tone: 'green' },
          ]}
        />
      </Card>
    );
  }

  /* NVDEC concurrency: the scaling curve finds the 7-engine ceiling unaided */
  if (id === 'helix-nvdec-scaling') {
    return (
      <Card sub="Decode throughput against concurrent decoder instances, real egocentric video at 1920×1456. Going from 1 to 7 workers buys 5.14×; going from 7 to 14 buys 1.09×. The H100 has exactly 7 NVDEC engines, and the curve finds them without being told.">
        <VLogBars
          vmin={200}
          vmax={2000}
          gridlines={[
            { value: 250, label: '250' },
            { value: 500, label: '500' },
            { value: 1000, label: '1k' },
          ]}
          target={1352}
          targetLabel="7 NVDEC engines"
          bars={[
            { value: 263, text: '263', label: '1\nworker', tone: 'fail' },
            { value: 552, text: '552', label: '2', tone: 'gray' },
            { value: 744, text: '744', label: '4', tone: 'gray' },
            { value: 1352, text: '1,352', label: '7', tone: 'win' },
            { value: 1470, text: '1,470', label: '14', tone: 'green' },
          ]}
        />
      </Card>
    );
  }

  /* the sampling policy result: concurrency rescues whole clips, not random windows */
  if (id === 'helix-sampling-policy') {
    return (
      <Card sub="GPUs of pure decode needed to keep pace with Index at 2,100× realtime, stereo. Identical supervision either way — the difference is entirely how you sample.">
        <HBars
          max={3100}
          labelW={214}
          bars={[
            { value: 147, text: '147 GPUs', label: 'whole clip · 7 workers', tone: 'win' },
            { value: 479, text: '479 GPUs', label: 'whole clip · 1 worker', tone: 'gray' },
            { value: 1443, text: '1,443 GPUs', label: '16-frame windows · 7 workers', tone: 'fail' },
            { value: 2295, text: '2,295 GPUs', label: '16-frame windows · 1 worker', tone: 'fail' },
          ]}
        />
      </Card>
    );
  }

  /* the falsified prediction */
  if (id === 'helix-gop-falsified') {
    return (
      <Card sub="Random 16-frame windows, by keyframe interval. I predicted longer GOP would be slower — more frames to decode forward from the preceding keyframe. Measured, it is the other way round.">
        <HBars
          max={62}
          labelW={190}
          bars={[
            { value: 24.4, text: '24.4 fps', label: 'GOP 15 (predicted best)', tone: 'fail' },
            { value: 41.7, text: '41.7 fps', label: 'GOP 170 (native)', tone: 'gray' },
            { value: 47.2, text: '47.2 fps', label: 'GOP 250 (predicted worst)', tone: 'win' },
          ]}
        />
      </Card>
    );
  }

  /* one hour of Index, three ways to keep it. Latents are SMALLER than the
   * compressed source they came from — you discard resolution you'd never train on. */
  if (id === 'helix-storage') {
    return (
      <Card sub="One hour of Index video, stored three ways. Encoding to latents up front removes the decode bottleneck and shrinks the bill 4.1× — because it throws away resolution that was never going to reach the model.">
        <HBars
          max={31}
          labelW={168}
          bars={[
            { value: 22.5, text: '22.5 GB/h · 414 PB/yr', label: '4K30 source', tone: 'fail' },
            { value: 3.6, text: '3.6 GB/h · 66 PB/yr', label: '1080p30 source', tone: 'gray' },
            { value: 0.88, text: '0.88 GB/h · 16 PB/yr', label: 'latents, 256²', tone: 'win' },
          ]}
        />
      </Card>
    );
  }

  /* the same video, three mainstream tokenizers, an 8x spread in "tokens" */
  if (id === 'helix-tokenizers') {
    return (
      <Card sub="Tokens per input frame at 256², identical video, three mainstream tokenizers. An 8× spread from a design choice — which is why a scaling law stated in tokens does not transfer between labs.">
        <HBars
          max={100}
          labelW={196}
          bars={[
            { value: 64, text: '64 tokens/frame', label: 'Wan-VAE · 8×8×4', tone: 'fail' },
            { value: 32, text: '32 tokens/frame', label: 'Cosmos continuous · 8×8×8', tone: 'gray' },
            { value: 8, text: '8 tokens/frame', label: 'Cosmos discrete · 8×16×16', tone: 'green' },
          ]}
        />
      </Card>
    );
  }

  return null;
}

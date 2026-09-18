/* Charts for the Robotics collection — the Index / video-pretraining pieces.
 * Data is baked in from the decode arithmetic (notes/b1.py): H100, 989 TFLOP/s
 * BF16 at 40% MFU, 64 tokens per input frame at 256^2 with a Wan-VAE-class
 * tokenizer, decode measured against NVIDIA's PyNvVideoCodec 1080p H.264
 * figures. One <Chart id="helix-..."/> per figure. */

import { Card, HBars, VLogBars } from './chartKit';

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

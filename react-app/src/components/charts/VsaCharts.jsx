/* Charts for "Making Wan Video Gen 89× Faster" (inferencemaxxing #1, the VSA
 * kernel). Drawn in the paper template's chart language — see ./paperKit.
 * Data is baked in from models/wan/LOG.md (B200, H=40, S=39936, warm medians,
 * honest scattered gather). One <Chart id="vsa-..."/> per figure. */

import { Figure, VBars, HBars, Tiles, Rows, Matrix } from './paperKit';

export default function Chart({ id }) {
  switch (id) {
    /* the descent: 365 s to 4.0 s, log axis because the change spans two decades */
    case 'vsa-e2e':
      return (
        <Figure
          title="End-to-end time to generate one 5-second 480p clip"
          caption={['SIX CHANGES, ONE CLOCK', 'Wan2.2-T2V-A14B · 832×480 · 81 frames · one B200 · warm median · lower is faster']}
        >
          <VBars
            log vmin={3} vmax={420}
            axisLabel="Seconds per clip · log scale"
            ticks={[
              { value: 365, label: '365 s' },
              { value: 60, label: '60 s' },
              { value: 10, label: '10 s' },
              { value: 4, label: '4 s' },
            ]}
            bars={[
              { label: 'Dense\nbaseline', value: 365, text: '365 s', tone: 'gray' },
              { label: '+ VSA\nkernel', value: 215, text: '215 s', tone: 'gray' },
              { label: '+ 4-step\ndistill', value: 11.2, text: '11.2 s', tone: 'green' },
              { label: '+ compile', value: 6.9, text: '6.9 s', tone: 'green' },
              { label: '+ NVFP4', value: 5.1, text: '5.1 s', tone: 'green' },
              { label: '+ fuse\n& ship', value: 4.0, text: '4.0 s', tone: 'win' },
            ]}
          />
        </Figure>
      );

    case 'vsa-ladder':
      return (
        <Figure
          title="Attention kernel latency against the hardware floor"
          caption={['THE KERNEL LADDER', 'B200 · 40 heads · sequence length 39,936 · warm median · lower is faster']}
        >
          <HBars
            max={42} target={3.36} targetLabel="floor · 3.36 ms" labelW={168}
            bars={[
              { label: 'Dense attention', value: 38.5, text: '38.5 ms', tone: 'gray' },
              { label: 'Triton (compiled)', value: 20.2, text: '20.2 ms', tone: 'gray' },
              { label: 'Ours (hand-CUDA)', value: 4.99, text: '4.99 ms', tone: 'win' },
            ]}
          />
        </Figure>
      );

    case 'vsa-steps':
      return (
        <Figure
          title="A distilled 4-step schedule replaces the 40-step denoising loop"
          caption={['FORTY STEPS BECOME FOUR', 'One small LoRA per expert · 32.6× end-to-end, in a single change']}
        >
          <HBars
            max={44} labelW={168}
            bars={[
              { label: 'Dense loop', value: 40, text: '40 steps', tone: 'gray' },
              { label: 'Distilled', value: 4, text: '4 steps · 32.6×', tone: 'win' },
            ]}
          />
        </Figure>
      );

    case 'vsa-fp4':
      return (
        <Figure
          title="Four-bit math on the projection matmuls"
          caption={['NVFP4', 'The fight was the toolchain, not the math — the win appeared once the prebuilt kernel library and CUDA version lined up']}
        >
          <Tiles items={[
            { label: 'bf16 → NVFP4 on the projection GEMMs', big: '2.46×', sub: '406 Linears quantized, no visible quality cost' },
            { label: 'End-to-end after quantizing', big: '5.1 s', sub: '71× over baseline · 1.8 s off the compiled run' },
          ]} />
        </Figure>
      );

    case 'vsa-budget':
      return (
        <Figure
          title="Where the 4.0 seconds goes"
          caption={['THE REMAINING GAP', 'The whole distance to the ~2.5 s public best is the glue — tensors re-streamed through memory around the opaque kernels']}
        >
          <HBars
            max={1.5} labelW={140}
            bars={[
              { label: 'VAE decode', value: 1.3, text: '1.3 s · shared', tone: 'gray' },
              { label: 'DiT glue', value: 1.05, text: '1.05 s · the gap', tone: 'fail' },
              { label: 'VSA kernel', value: 0.99, text: '0.99 s', tone: 'green' },
              { label: 'fp4 GEMM', value: 0.51, text: '0.51 s', tone: 'gray' },
              { label: 'fp4 quant', value: 0.16, text: '0.16 s', tone: 'gray' },
            ]}
          />
        </Figure>
      );

    case 'vsa-honest':
      return (
        <Figure
          title="Three good ideas, measured, and set down"
          caption={['WHAT DIDN’T WORK', 'The failures are the credibility — each was built, measured against the same clock, and dropped']}
        >
          <Rows items={[
            { head: 'Hand-fused norm kernels', body: 'Beat eager PyTorch 1.92×, then lost to torch.compile once compiled — Inductor fuses across more operations than a standalone kernel can.' },
            { head: 'CUDA-graph the decoder', body: '1.02×. The VAE is compute-bound, not launch-bound, so there were no launches to hide.' },
            { head: 'Train the quality back', body: 'Held-out flat, 0.926 → 0.921. At 14B the model already tolerates the sparsity; this rescued a smaller one.' },
          ]} />
        </Figure>
      );

    case 'vsa-floor':
      return (
        <Figure
          title="How far each approach lands from the hardware floor"
          caption={['THE FLOOR IS THE NUMBER YOU CANNOT BEAT', 'Multiples of the theoretical minimum · B200 · lower is better']}
        >
          <VBars
            log vmin={1.0} vmax={100}
            axisLabel="× off the floor · log scale"
            ticks={[
              { value: 80, label: '80×' },
              { value: 10, label: '10×' },
              { value: 1.0, label: '1× floor' },
            ]}
            bars={[
              { label: 'From-scratch\nWMMA', value: 80, text: '80×', tone: 'fail' },
              { label: 'Triton\ncompiler', value: 6.0, text: '6.0×', tone: 'gray' },
              { label: 'Hand-CUDA\nfork', value: 1.49, text: '1.49×', tone: 'win' },
            ]}
          />
        </Figure>
      );

    case 'vsa-ceiling':
      return (
        <Figure
          title="The optimizations that close the gap live below the DSL"
          caption={['WHAT EACH LAYER CAN EXPRESS', 'Above this line the compiler makes the choice for you']}
        >
          <Matrix
            cols={['PyTorch', 'Triton', 'Hand-CUDA']}
            rows={[
              { label: 'Warp specialization', cells: [false, false, true] },
              { label: 'tcgen05 / TMEM path', cells: [false, false, true] },
              { label: 'TMA scattered gather', cells: [false, false, true] },
              { label: 'Count-based barriers', cells: [false, false, true] },
              { label: 'Block-sparse skip', cells: [false, true, true] },
            ]}
          />
        </Figure>
      );

    case 'vsa-build':
      return (
        <Figure
          title="Correct-but-slow proved the mechanism; fast-and-forked shipped it"
          caption={['TWO KERNELS', 'B200 · 40 heads · sequence length 39,936']}
        >
          <Tiles items={[
            { label: 'From scratch', big: '270 ms', sub: '80× off the floor — correct, but hopeless for speed' },
            { label: 'Forked FMHA', big: '4.99 ms', sub: '1.49× off the floor — inherits the full optimization ladder' },
          ]} />
        </Figure>
      );

    case 'vsa-scatter':
      return (
        <Figure
          title="Gathering scattered key blocks costs almost nothing"
          caption={['THE WHOLE POINT OF SPARSITY', 'B200 · scattered gather against contiguous · lower is faster']}
        >
          <HBars
            max={42} labelW={168}
            bars={[
              { label: 'Dense (all blocks)', value: 38.5, text: '38.5 ms', tone: 'gray' },
              { label: 'Sparse, contiguous', value: 4.91, text: '4.91 ms', tone: 'green' },
              { label: 'Sparse, scattered', value: 4.99, text: '4.99 ms · 1.02×', tone: 'win' },
            ]}
          />
        </Figure>
      );

    case 'vsa-parity':
      return (
        <Figure
          title="The kernel computes exactly what it claims"
          caption={['LOSSLESS', 'Against a reference over the same selected blocks · per attention head']}
        >
          <Tiles items={[
            { label: 'Cosine similarity', big: '1.00000', sub: 'Against the reference, per head' },
            { label: 'Relative error', big: '2.4e-3', sub: 'Within bf16 accumulation noise' },
            { label: 'Exactness', big: 'Per-head', sub: 'Not averaged across the batch' },
          ]} />
        </Figure>
      );

    case 'vsa-deadends':
      return (
        <Figure
          title="Going to the metal means you own the bugs the compiler used to hide"
          caption={['DEAD ENDS', 'Each cost a day; each has a one-line fix in hindsight']}
        >
          <Rows items={[
            { head: 'From-scratch kernel, 80× off floor', body: 'Fork a warp-specialized FMHA instead of building the ladder again.' },
            { head: 'Only the load warp knew the block count', body: 'Deadlock. Thread one shared count to every warp.' },
            { head: 'Varlen path dereferenced null', body: 'GPU fault at 0x0. One-line guard on the null pointer.' },
          ]} />
        </Figure>
      );

    default:
      return null;
  }
}

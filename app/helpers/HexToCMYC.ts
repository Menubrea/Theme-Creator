import chroma from 'chroma-js';

function hexToCMYK(hex: string) {
  const rgbColor = chroma(hex).rgb();

  const r = rgbColor[0] / 255;
  const g = rgbColor[1] / 255;
  const b = rgbColor[2] / 255;

  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return { c, m, y, k };
}

export default hexToCMYK;

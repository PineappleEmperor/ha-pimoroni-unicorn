export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function floodFill(
  px: Uint8ClampedArray, w: number, h: number, x: number, y: number,
  rgb: [number, number, number],
): void {
  const at = (cx: number, cy: number) => (cy * w + cx) * 3;
  const start = at(x, y);
  const tr = px[start], tg = px[start + 1], tb = px[start + 2];
  const [nr, ng, nb] = rgb;
  if (tr === nr && tg === ng && tb === nb) return;
  const stack: Array<[number, number]> = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
    const i = at(cx, cy);
    if (px[i] !== tr || px[i + 1] !== tg || px[i + 2] !== tb) continue;
    px[i] = nr; px[i + 1] = ng; px[i + 2] = nb;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

export function sampleSource(
  src: Uint8ClampedArray, sw: number, sh: number,
  offX: number, offY: number, scale: number, w: number, h: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(w * h * 3);
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      const sx = Math.floor(offX + gx * scale);
      const sy = Math.floor(offY + gy * scale);
      const o = (gy * w + gx) * 3;
      if (sx < 0 || sy < 0 || sx >= sw || sy >= sh) continue; // stays (0,0,0)
      const s = (sy * sw + sx) * 4;
      out[o] = src[s]; out[o + 1] = src[s + 1]; out[o + 2] = src[s + 2];
    }
  }
  return out;
}

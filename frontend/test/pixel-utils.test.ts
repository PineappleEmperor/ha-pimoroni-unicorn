import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex, floodFill, sampleSource, contentBounds, cropRegion } from "../src/pixel-utils";

describe("hex", () => {
  it("round-trips", () => {
    expect(hexToRgb("#ff3355")).toEqual([255, 51, 85]);
    expect(rgbToHex(255, 51, 85)).toBe("#ff3355");
  });
  it("tolerates no-hash", () => {
    expect(hexToRgb("00ff00")).toEqual([0, 255, 0]);
  });
});

describe("floodFill", () => {
  it("fills a contiguous same-colour region only", () => {
    const px = new Uint8ClampedArray([0, 0, 0, 0, 0, 0, 255, 255, 255]);
    floodFill(px, 3, 1, 0, 0, [255, 0, 0]);
    expect(Array.from(px)).toEqual([255, 0, 0, 255, 0, 0, 255, 255, 255]);
  });
  it("no-ops when target already equals fill colour", () => {
    const px = new Uint8ClampedArray([255, 0, 0]);
    floodFill(px, 1, 1, 0, 0, [255, 0, 0]);
    expect(Array.from(px)).toEqual([255, 0, 0]);
  });
});

describe("sampleSource", () => {
  it("maps a 2x2 RGBA source 1:1 into a 2x2 grid", () => {
    const src = new Uint8ClampedArray([
      255, 0, 0, 255, 0, 255, 0, 255,
      0, 0, 255, 255, 255, 255, 255, 255,
    ]);
    const out = sampleSource(src, 2, 2, 0, 0, 1, 2, 2);
    expect(Array.from(out)).toEqual([255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255]);
  });
  it("returns black for cells outside the source", () => {
    const src = new Uint8ClampedArray([255, 255, 255, 255]);
    const out = sampleSource(src, 1, 1, 0, 0, 1, 2, 1);
    expect(Array.from(out)).toEqual([255, 255, 255, 0, 0, 0]);
  });
});

describe("contentBounds", () => {
  it("returns null when every pixel is black", () => {
    expect(contentBounds(new Uint8ClampedArray(3 * 3 * 3), 3, 3)).toBeNull();
  });
  it("bounds a single lit pixel to a 1x1 box", () => {
    const px = new Uint8ClampedArray(3 * 3 * 3);
    const i = (1 * 3 + 1) * 3; px[i] = 255;
    expect(contentBounds(px, 3, 3)).toEqual({ x0: 1, y0: 1, x1: 1, y1: 1 });
  });
  it("spans the tightest box across scattered lit pixels", () => {
    const px = new Uint8ClampedArray(4 * 4 * 3);
    const lit = (x: number, y: number) => { px[(y * 4 + x) * 3 + 1] = 200; };
    lit(1, 0); lit(3, 2);
    expect(contentBounds(px, 4, 4)).toEqual({ x0: 1, y0: 0, x1: 3, y1: 2 });
  });
});

describe("cropRegion", () => {
  it("extracts a sub-rectangle preserving pixels", () => {
    const px = new Uint8ClampedArray(3 * 3 * 3);
    const i = (1 * 3 + 2) * 3; px[i] = 10; px[i + 1] = 20; px[i + 2] = 30;
    const out = cropRegion(px, 3, 2, 1, 1, 1);
    expect(Array.from(out)).toEqual([10, 20, 30]);
  });
});

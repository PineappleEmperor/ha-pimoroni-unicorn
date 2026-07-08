import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex, floodFill, sampleSource } from "../src/pixel-utils";

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

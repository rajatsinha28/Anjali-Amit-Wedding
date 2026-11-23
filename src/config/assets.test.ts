import { describe, expect, it } from "vitest";
import { assets } from "./assets";

describe("Phase 1 asset manifest", () => {
  it.each([
    ["ganesh-idol", 1600, 2000],
    ["diya", 600, 600],
    ["door-left", 1080, 2400],
    ["door-right", 1080, 2400],
    ["corner-tl", 1200, 1200],
    ["arch-frame", 1200, 1800],
    ["toran", 1800, 600],
    ["petal", 480, 320],
  ] as const)("provides exact canonical dimensions for %s", (id, width, height) => {
    expect(assets[id]).toMatchObject({ width, height });
    expect(assets[id]?.avif.length).toBeGreaterThan(0);
    expect(assets[id]?.webp.length).toBeGreaterThan(0);
  });
});

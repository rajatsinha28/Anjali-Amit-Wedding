import { describe, expect, it } from "vitest";
import { classifyDevice, demoteTier } from "./device";

describe("device tier classification", () => {
  it("treats reduced motion and data saver as low tier", () => {
    expect(classifyDevice({ reducedMotion: true, deviceMemory: 16, hardwareConcurrency: 16 })).toBe(
      "low",
    );
    expect(classifyDevice({ saveData: true })).toBe("low");
  });

  it("uses conservative hardware thresholds", () => {
    expect(classifyDevice({ deviceMemory: 4, hardwareConcurrency: 12 })).toBe("low");
    expect(classifyDevice({ deviceMemory: 12, hardwareConcurrency: 4 })).toBe("low");
    expect(classifyDevice({ deviceMemory: 8, hardwareConcurrency: 8 })).toBe("high");
    expect(classifyDevice({ deviceMemory: 6, hardwareConcurrency: 6 })).toBe("mid");
    expect(classifyDevice({})).toBe("mid");
  });

  it("demotes quality one tier at a time", () => {
    expect(demoteTier("high")).toBe("mid");
    expect(demoteTier("mid")).toBe("low");
    expect(demoteTier("low")).toBe("low");
  });
});

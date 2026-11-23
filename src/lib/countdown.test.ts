import { describe, expect, it } from "vitest";
import { getCountdown } from "./countdown";

const target = "2026-12-10T21:00:00+05:30";

describe("baraat countdown", () => {
  it("handles the final second and the exact instant", () => {
    expect(getCountdown(target, Date.parse(target) - 1000)).toMatchObject({
      seconds: 1,
      complete: false,
    });
    expect(getCountdown(target, Date.parse(target))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      complete: true,
    });
  });

  it("never becomes negative and handles day boundaries", () => {
    expect(getCountdown(target, Date.parse(target) + 60_000).complete).toBe(true);
    expect(getCountdown(target, Date.parse(target) - 90_061_000)).toMatchObject({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  });
});

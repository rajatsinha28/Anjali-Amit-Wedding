import { describe, expect, it } from "vitest";
import { acquireScrollLock, getScrollLockCount } from "./scrollLock";

describe("reference-counted scroll lock", () => {
  it("restores the previous overflow only after the last release", () => {
    document.body.style.overflow = "auto";
    const releaseFirst = acquireScrollLock();
    const releaseSecond = acquireScrollLock();
    expect(getScrollLockCount()).toBe(2);
    expect(document.body.style.overflow).toBe("hidden");
    releaseFirst();
    releaseFirst();
    expect(getScrollLockCount()).toBe(1);
    expect(document.body.style.overflow).toBe("hidden");
    releaseSecond();
    expect(getScrollLockCount()).toBe(0);
    expect(document.body.style.overflow).toBe("auto");
  });
});

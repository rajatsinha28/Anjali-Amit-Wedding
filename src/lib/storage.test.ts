import { describe, expect, it } from "vitest";
import { createSafeStorage } from "./storage";

describe("safe storage", () => {
  it("reads and writes browser storage", () => {
    const safe = createSafeStorage(window.localStorage);
    safe.set("test-key", "value");
    expect(safe.get("test-key")).toBe("value");
    safe.remove("test-key");
    expect(safe.get("test-key")).toBeNull();
  });

  it("falls back to memory when browser storage throws", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
      clear: () => {
        throw new Error("blocked");
      },
      key: () => null,
      length: 0,
    } satisfies Storage;
    const safe = createSafeStorage(broken);
    safe.set("key", "memory");
    expect(safe.get("key")).toBe("memory");
    safe.clear();
    expect(safe.get("key")).toBeNull();
  });
});

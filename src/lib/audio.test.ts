import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createInvitationAudio } from "./audio";

class MockAudio extends EventTarget {
  static latest: MockAudio;

  readonly src: string;
  currentTime = 0;
  duration = 89.6;
  loop = false;
  paused = true;
  preload = "none";
  readyState = 1;
  volume = 1;
  play = vi.fn(async () => {
    this.paused = false;
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  load = vi.fn();
  removeAttribute = vi.fn();

  constructor(src: string) {
    super();
    this.src = src;
    MockAudio.latest = this;
  }
}

describe("invitation audio", () => {
  beforeEach(() => {
    vi.stubGlobal("Audio", MockAudio);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const createAudio = () =>
    createInvitationAudio("/music.mp3", 0.35, {
      initialStartSeconds: 19,
      loopStartSeconds: 0,
    });

  it("prepares the supplied track and begins its first playback at 19 seconds", async () => {
    const invitationAudio = createAudio();
    const media = MockAudio.latest;

    expect(media.preload).toBe("auto");
    expect(media.loop).toBe(true);
    expect(media.currentTime).toBe(19);
    await expect(invitationAudio.play()).resolves.toBe(true);
    expect(media.play).toHaveBeenCalledTimes(1);
  });

  it("resumes from the paused position without applying the initial offset again", async () => {
    const invitationAudio = createAudio();
    const media = MockAudio.latest;
    await invitationAudio.play();
    invitationAudio.pause();
    media.currentTime = 42;

    await expect(invitationAudio.toggle()).resolves.toBe(true);
    expect(media.currentTime).toBe(42);
  });

  it("reports blocked playback without losing the prepared 19-second position", async () => {
    const invitationAudio = createAudio();
    const media = MockAudio.latest;
    media.play.mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"));

    await expect(invitationAudio.play()).resolves.toBe(false);
    expect(media.currentTime).toBe(19);
    await expect(invitationAudio.play()).resolves.toBe(true);
  });

  it("cleans up playback and its source", () => {
    const invitationAudio = createAudio();
    const media = MockAudio.latest;

    invitationAudio.destroy();
    expect(media.pause).toHaveBeenCalledTimes(1);
    expect(media.removeAttribute).toHaveBeenCalledWith("src");
    expect(media.load).toHaveBeenCalledTimes(2);
  });
});

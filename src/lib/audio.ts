export interface InvitationAudio {
  readonly available: boolean;
  play: () => Promise<boolean>;
  pause: () => void;
  toggle: () => Promise<boolean>;
  destroy: () => void;
}

export interface InvitationAudioOptions {
  readonly initialStartSeconds: number;
  readonly loopStartSeconds: number;
}

export function createInvitationAudio(
  src: string | null,
  targetVolume: number,
  { initialStartSeconds, loopStartSeconds }: InvitationAudioOptions,
): InvitationAudio {
  if (!src) {
    return {
      available: false,
      play: async () => false,
      pause: () => undefined,
      toggle: async () => false,
      destroy: () => undefined,
    };
  }

  const audio = new Audio(src);
  audio.loop = loopStartSeconds === 0;
  audio.preload = "auto";
  audio.volume = 0;
  let fadeFrame = 0;
  let destroyed = false;
  let initialPositionPending = initialStartSeconds > 0;

  const cancelFade = () => {
    cancelAnimationFrame(fadeFrame);
    fadeFrame = 0;
  };

  const safePosition = (seconds: number) => {
    const position = Math.max(0, seconds);
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return position;
    return Math.min(position, Math.max(0, audio.duration - 0.05));
  };

  const applyInitialPosition = () => {
    if (!initialPositionPending) return true;
    if (audio.readyState < 1) return false;
    audio.currentTime = safePosition(initialStartSeconds);
    initialPositionPending = false;
    return true;
  };

  const waitForInitialPosition = () =>
    new Promise<boolean>((resolve) => {
      if (applyInitialPosition()) {
        resolve(true);
        return;
      }

      const finish = (ready: boolean) => {
        audio.removeEventListener("loadedmetadata", onMetadata);
        audio.removeEventListener("error", onError);
        resolve(ready);
      };
      const onMetadata = () => finish(applyInitialPosition());
      const onError = () => finish(false);
      audio.addEventListener("loadedmetadata", onMetadata, { once: true });
      audio.addEventListener("error", onError, { once: true });
    });

  const fadeIn = () => {
    cancelFade();
    const startedAt = performance.now();
    const step = (now: number) => {
      if (destroyed || audio.paused) return;
      const progress = Math.min(1, (now - startedAt) / 1200);
      audio.volume = targetVolume * progress;
      if (progress < 1) fadeFrame = requestAnimationFrame(step);
    };
    fadeFrame = requestAnimationFrame(step);
  };

  const play = async () => {
    if (destroyed) return false;
    if (!audio.paused) return true;

    cancelFade();
    audio.volume = 0;
    const positionReady = applyInitialPosition();

    try {
      await audio.play();
      if (!positionReady && !(await waitForInitialPosition())) {
        audio.pause();
        return false;
      }
      if (destroyed) return false;
      fadeIn();
      return true;
    } catch {
      return false;
    }
  };

  const restartFromLoopPosition = () => {
    if (destroyed || audio.loop) return;
    audio.currentTime = safePosition(loopStartSeconds);
    audio.volume = targetVolume;
    void audio.play().catch(() => undefined);
  };

  audio.addEventListener("loadedmetadata", applyInitialPosition);
  audio.addEventListener("ended", restartFromLoopPosition);
  audio.load();
  applyInitialPosition();

  return {
    available: true,
    play,
    pause: () => {
      cancelFade();
      audio.pause();
    },
    toggle: async () => {
      if (audio.paused) return play();
      cancelFade();
      audio.pause();
      return false;
    },
    destroy: () => {
      destroyed = true;
      cancelFade();
      audio.removeEventListener("loadedmetadata", applyInitialPosition);
      audio.removeEventListener("ended", restartFromLoopPosition);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
  };
}

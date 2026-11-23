export type DeviceTier = "low" | "mid" | "high";

export interface DeviceSignals {
  readonly deviceMemory?: number;
  readonly hardwareConcurrency?: number;
  readonly saveData?: boolean;
  readonly reducedMotion?: boolean;
}

let forcedTier: DeviceTier | null = null;
let adaptiveTier: DeviceTier | null = null;

export function classifyDevice(signals: DeviceSignals): DeviceTier {
  if (signals.reducedMotion || signals.saveData) return "low";
  if (
    (signals.deviceMemory !== undefined && signals.deviceMemory <= 4) ||
    (signals.hardwareConcurrency !== undefined && signals.hardwareConcurrency <= 4)
  ) {
    return "low";
  }
  if (
    signals.deviceMemory !== undefined &&
    signals.deviceMemory >= 8 &&
    signals.hardwareConcurrency !== undefined &&
    signals.hardwareConcurrency >= 8
  ) {
    return "high";
  }
  return "mid";
}

export function readDeviceSignals(): DeviceSignals {
  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    deviceMemory: navigatorWithMemory.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    saveData: navigatorWithMemory.connection?.saveData,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

export function getDeviceTier(): DeviceTier {
  return forcedTier ?? adaptiveTier ?? classifyDevice(readDeviceSignals());
}

export function forceDeviceTier(tier: DeviceTier | null): void {
  forcedTier = tier;
  document.documentElement.dataset.deviceTier = getDeviceTier();
  window.dispatchEvent(new CustomEvent("device-tier-change", { detail: getDeviceTier() }));
}

export function demoteTier(tier: DeviceTier): DeviceTier {
  if (tier === "high") return "mid";
  return "low";
}

export function startAdaptiveQualityMonitor(): () => void {
  document.documentElement.dataset.deviceTier = getDeviceTier();
  let frame = 0;
  let frames = 0;
  let sampleStarted = performance.now();
  let slowSamples = 0;
  let stopped = false;

  const sample = (now: number) => {
    if (stopped) return;
    frames += 1;
    const elapsed = now - sampleStarted;
    if (elapsed >= 1000) {
      const fps = (frames * 1000) / elapsed;
      slowSamples = document.hidden || fps >= 40 ? 0 : slowSamples + 1;
      if (slowSamples >= 2 && !forcedTier) {
        adaptiveTier = demoteTier(getDeviceTier());
        document.documentElement.dataset.deviceTier = getDeviceTier();
        window.dispatchEvent(new CustomEvent("device-tier-change", { detail: getDeviceTier() }));
        slowSamples = 0;
      }
      frames = 0;
      sampleStarted = now;
    }
    frame = requestAnimationFrame(sample);
  };

  frame = requestAnimationFrame(sample);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
  };
}

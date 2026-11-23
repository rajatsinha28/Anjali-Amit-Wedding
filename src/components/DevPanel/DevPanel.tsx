import { useEffect, useRef, useState } from "react";
import { forceDeviceTier, getDeviceTier, type DeviceTier } from "../../lib/device";
import { setMotionTimeScale } from "../../lib/motion";
import { safeLocalStorage, safeSessionStorage } from "../../lib/storage";
import styles from "./DevPanel.module.css";

const viewports = ["auto", "360", "390", "430", "768"] as const;
const speeds = [0.25, 0.5, 1, 2] as const;

export default function DevPanel() {
  const [fps, setFps] = useState(0);
  const [tier, setTier] = useState<DeviceTier | "auto">("auto");
  const frameCount = useRef(0);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const sample = (now: number) => {
      frameCount.current += 1;
      if (now - last >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - last)));
        frameCount.current = 0;
        last = now;
      }
      frame = requestAnimationFrame(sample);
    };
    frame = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(frame);
  }, []);

  const setDatasetFlag = (name: string, enabled: boolean) => {
    document.documentElement.dataset[name] = String(enabled);
  };
  const jumpTargets = [
    ["Hero", "hero-handoff"],
    ["Welcome", "welcome-letter"],
    ["Date", "date-reveal"],
    ["Album", "little-moments"],
    ["Ceremonies", "ceremonies"],
    ["Closing", "closing-portrait"],
  ] as const;

  return (
    <aside className={styles.panel} aria-label="Development controls">
      <h2>Invitation dev panel · {fps} FPS</h2>
      <div className={styles.grid}>
        <label className={`${styles.toggle} ${styles.wide}`}>
          <input
            type="checkbox"
            onChange={(event) => setDatasetFlag("reducedMotion", event.target.checked)}
          />
          Simulate reduced motion
        </label>
        <label className={`${styles.toggle} ${styles.wide}`}>
          <input
            type="checkbox"
            onChange={(event) => setDatasetFlag("showPending", event.target.checked)}
          />
          Show pending assets
        </label>
        <label className={`${styles.toggle} ${styles.wide}`}>
          <input
            type="checkbox"
            onChange={(event) => setDatasetFlag("outlineLayers", event.target.checked)}
          />
          Outline layers
        </label>
        <label>
          Speed
          <select
            defaultValue="1"
            onChange={(event) => void setMotionTimeScale(Number(event.target.value))}
          >
            {speeds.map((speed) => (
              <option key={speed} value={speed}>
                {speed}×
              </option>
            ))}
          </select>
        </label>
        <label>
          Device tier
          <select
            value={tier}
            onChange={(event) => {
              const value = event.target.value as DeviceTier | "auto";
              setTier(value);
              forceDeviceTier(value === "auto" ? null : value);
            }}
          >
            <option value="auto">Auto ({getDeviceTier()})</option>
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className={styles.wide}>
          Viewport preview
          <select
            onChange={(event) => {
              const value = event.target.value;
              document.documentElement.style.setProperty(
                "--dev-viewport-width",
                value === "auto" ? "100%" : `${value}px`,
              );
            }}
          >
            {viewports.map((viewport) => (
              <option key={viewport} value={viewport}>
                {viewport === "auto" ? "Auto" : `${viewport}px`}
              </option>
            ))}
          </select>
        </label>
        <button
          className={styles.wide}
          type="button"
          onClick={() => {
            safeLocalStorage.clear();
            safeSessionStorage.clear();
          }}
        >
          Reset invitation storage
        </button>
        <div className={styles.wide}>
          {jumpTargets.map(([label, testId]) => (
            <button
              key={testId}
              type="button"
              onClick={() =>
                document
                  .querySelector(`[data-testid="${testId}"]`)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

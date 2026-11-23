import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/motion";
import styles from "./DateReveal.module.css";

export function CelebrationCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = box.width * ratio;
    canvas.height = box.height * ratio;
    context.scale(ratio, ratio);
    const count = innerWidth < 768 ? 50 : 80;
    const particles = Array.from({ length: count }, () => ({
      x: box.width / 2,
      y: box.height * 0.45,
      vx: (Math.random() - 0.5) * 180,
      vy: -70 - Math.random() * 120,
      size: 2 + Math.random() * 4,
      color: Math.random() > 0.45 ? "#e8c66c" : "#fff1c4",
    }));
    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      context.clearRect(0, 0, box.width, box.height);
      for (const p of particles) {
        const x = p.x + p.vx * elapsed;
        const y = p.y + p.vy * elapsed + 95 * elapsed * elapsed;
        context.globalAlpha = Math.max(0, 1 - elapsed / 2.1);
        context.fillStyle = p.color;
        context.fillRect(x, y, p.size, p.size * 0.55);
      }
      if (elapsed < 2.2) frame = requestAnimationFrame(draw);
      else context.clearRect(0, 0, box.width, box.height);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} className={styles.celebration} aria-hidden="true" />;
}

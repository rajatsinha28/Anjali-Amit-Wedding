import { useEffect, useRef } from "react";
import { getDeviceTier } from "../../lib/device";
import { prefersReducedMotion } from "../../lib/motion";
import styles from "./DustCanvas.module.css";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  phase: number;
}

export function DustCanvas({ active }: { readonly active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frame = 0;
    let visible = !document.hidden;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const baseCount = width >= 768 ? 30 : 18;
      const count = getDeviceTier() === "low" ? Math.ceil(baseCount / 2) : baseCount;
      particles = Array.from({ length: count }, (_, index) => ({
        x: ((index * 73.17) % 100) * (width / 100),
        y: ((index * 41.83) % 100) * (height / 100),
        radius: 1 + (index % 3),
        speed: 5 + (index % 7) * 1.6,
        opacity: 0.12 + (index % 4) * 0.05,
        phase: index * 0.7,
      }));
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (visible) {
        for (const particle of particles) {
          particle.y -= particle.speed / 60;
          if (particle.y < -8) particle.y = height + 8;
          const drift = Math.sin(time / 1800 + particle.phase) * 8;
          context.beginPath();
          context.fillStyle = `rgb(235 217 168 / ${particle.opacity})`;
          context.arc(particle.x + drift, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        }
      }
      frame = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      visible = !document.hidden;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(frame);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

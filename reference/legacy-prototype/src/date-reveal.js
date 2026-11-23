import "./date-reveal.css";
import { createRoyalElephant } from "./royal-elephant.js";

export function initDateReveal(config) {
  const section = document.querySelector("#wedding-date");
  if (!section) return;

  const elephantElements = [...section.querySelectorAll(".royal-elephant")];
  elephantElements.forEach((elephant, index) => {
    elephant.innerHTML = createRoyalElephant(index === 0 ? "left" : "right");
  });

  const eyebrow = section.querySelector(".date-eyebrow");
  const lotus = section.querySelector(".date-lotus");
  const dateDisplay = section.querySelector(".date-display");
  const dateValues = [...section.querySelectorAll(".date-value")];
  const placeholders = [...section.querySelectorAll(".date-placeholder")];
  const button = section.querySelector(".date-reveal-button");
  const buttonLabel = section.querySelector(".date-reveal-button__label");
  const particleLayer = section.querySelector(".blessing-particles");
  const blessingNote = section.querySelector(".date-blessing-note");
  const announcement = section.querySelector(".date-announcement");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let entranceStage = 0;
  let revealState = "concealed";

  const animate = (element, keyframes, options = {}) => element.animate(keyframes, {
    fill: "forwards",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    ...options,
  });

  function applyConfiguredDate() {
    [config.day, config.month, config.year].forEach((part, index) => {
      dateValues[index].textContent = part;
    });
    buttonLabel.textContent = config.revealLabel;
  }

  function showImmediately(elements) {
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.filter = "none";
      element.style.transform = "none";
    });
  }

  function playStageOne() {
    if (entranceStage >= 1) return;
    entranceStage = 1;

    if (reducedMotion.matches) {
      showImmediately([eyebrow, lotus]);
      return;
    }

    animate(eyebrow, [
      { opacity: 0, transform: "translate3d(0,-8px,0)" },
      { opacity: 1, transform: "translate3d(0,0,0)" },
    ], { duration: 650 });

    animate(lotus, [
      { opacity: 0, filter: "blur(5px)", transform: "scale(.92)" },
      { opacity: 1, filter: "blur(0) drop-shadow(0 0 14px rgb(223 196 119 / 30%))", transform: "scale(1.02)", offset: 0.82 },
      { opacity: 1, filter: "blur(0) drop-shadow(0 0 7px rgb(223 196 119 / 18%))", transform: "scale(1)" },
    ], { duration: config.entrance.lotusDuration * 1000, delay: 120 });
  }

  function playStageTwo() {
    if (entranceStage >= 2) return;
    playStageOne();
    entranceStage = 2;

    if (reducedMotion.matches) {
      showImmediately(elephantElements);
      section.classList.add("is-arrived");
      return;
    }

    const animations = elephantElements.map((elephant, index) => animate(elephant, [
      {
        opacity: 0,
        filter: "blur(3px)",
        transform: `translate3d(${index === 0 ? "-72%" : "72%"},0,0)`,
      },
      {
        opacity: 1,
        filter: "blur(0)",
        transform: `translate3d(${index === 0 ? "3px" : "-3px"},-1px,0)`,
        offset: 0.86,
      },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
    ], {
      duration: (config.entrance.elephantDuration + config.entrance.settleDuration) * 1000,
      delay: index * 45,
    }));

    Promise.all(animations.map((animation) => animation.finished)).then(() => {
      section.classList.add("is-arrived");
    });
  }

  function playStageThree() {
    if (entranceStage >= 3) return;
    playStageTwo();
    entranceStage = 3;

    if (reducedMotion.matches) {
      showImmediately([dateDisplay, blessingNote, button]);
      return;
    }

    animate(dateDisplay, [
      { opacity: 0, filter: "blur(4px)", transform: "translate3d(0,12px,0) scale(.97)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0) scale(1)" },
    ], { duration: 760, delay: 260 });

    animate(blessingNote, [
      { opacity: 0, filter: "blur(8px)", transform: "translate3d(0,12px,0)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
    ], { duration: 1200, delay: 520 });

    animate(button, [
      { opacity: 0, filter: "blur(3px)", transform: "translate3d(0,12px,0)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
    ], { duration: 700, delay: 980 });
  }

  const numberPattern = /-?\d*\.?\d+/g;

  function buildPathInterpolator(restPath, raisedPath) {
    const restValues = [...restPath.matchAll(numberPattern)].map((match) => Number(match[0]));
    const raisedValues = [...raisedPath.matchAll(numberPattern)].map((match) => Number(match[0]));
    return (progress) => {
      let valueIndex = 0;
      return restPath.replace(numberPattern, () => {
        const value = restValues[valueIndex] + (raisedValues[valueIndex] - restValues[valueIndex]) * progress;
        valueIndex += 1;
        return value.toFixed(2);
      });
    };
  }

  function morphTrunk(elephant, delay) {
    const trunk = elephant.querySelector(".trunk-morph");
    const restDetails = [...elephant.querySelectorAll(".trunk-detail--rest")];
    const raisedDetails = [...elephant.querySelectorAll(".trunk-detail--raised")];
    const marker = elephant.querySelector(".trunk-tip-marker");
    const nostril = elephant.querySelector(".trunk-nostril");
    const interpolatePath = buildPathInterpolator(trunk.dataset.rest, trunk.dataset.raised);
    const duration = config.reveal.trunkDuration * 1000;

    window.setTimeout(() => {
      const startedAt = performance.now();
      function frame(now) {
        const linear = Math.min(1, (now - startedAt) / duration);
        const progress = 1 - Math.pow(1 - linear, 3);
        trunk.setAttribute("d", interpolatePath(progress));
        restDetails.forEach((detail) => { detail.style.opacity = String(1 - progress); });
        raisedDetails.forEach((detail) => { detail.style.opacity = String(progress); });

        const tipX = 238 + (181 - 238) * progress;
        const tipY = 237 + (54 - 237) * progress;
        marker.setAttribute("cx", tipX.toFixed(2));
        marker.setAttribute("cy", tipY.toFixed(2));
        nostril.setAttribute("cx", tipX.toFixed(2));
        nostril.setAttribute("cy", (tipY + 1.5).toFixed(2));

        if (linear < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, delay);
  }

  function animateTrunks() {
    elephantElements.forEach((elephant, index) => morphTrunk(elephant, index * 45));
  }

  function drawStar(context, x, y, radius, rotation, color, alpha) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = radius * 2.2;
    context.beginPath();
    for (let point = 0; point < 8; point += 1) {
      const angle = (Math.PI / 4) * point - Math.PI / 2;
      const distance = point % 2 === 0 ? radius : radius * 0.23;
      context.lineTo(Math.cos(angle) * distance, Math.sin(angle) * distance);
    }
    context.closePath();
    context.fill();
    context.restore();
  }

  function createCelebrationParticles() {
    const canvas = document.createElement("canvas");
    canvas.className = "blessing-canvas";
    particleLayer.replaceChildren(canvas);

    const bounds = particleLayer.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;

    const context = canvas.getContext("2d");
    context.scale(ratio, ratio);

    const emitters = elephantElements.map((elephant) => {
      const marker = elephant.querySelector(".trunk-tip-marker").getBoundingClientRect();
      return {
        x: marker.left + marker.width / 2 - bounds.left,
        y: marker.top + marker.height / 2 - bounds.top,
      };
    });

    const palette = ["#fff0a6", "#f4d675", "#dfb94f", "#c79631"];
    const particles = emitters.flatMap((origin, side) => Array.from({ length: config.particlesPerSide }, (_, index) => {
      const progress = index / config.particlesPerSide;
      const inward = side === 0 ? 1 : -1;
      const type = index % 7 === 0 ? "star" : index % 4 === 0 ? "streak" : "glow";
      return {
        x: origin.x + (Math.random() - 0.5) * 8,
        y: origin.y + (Math.random() - 0.5) * 7,
        vx: inward * (48 + Math.random() * 64) + (0.5 - progress) * 18,
        vy: -(54 + Math.random() * 92),
        gravity: 35 + Math.random() * 30,
        drag: 0.975 + Math.random() * 0.014,
        size: type === "star" ? 5 + Math.random() * 4 : 2.5 + Math.random() * 4.5,
        delay: Math.random() * 0.36,
        life: 1.15 + Math.random() * 0.72,
        color: palette[index % palette.length],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 3.2,
        type,
      };
    }));

    const startedAt = performance.now();
    const totalDuration = config.reveal.celebrationDuration * 1000;

    function render(now) {
      const elapsed = (now - startedAt) / 1000;
      context.clearRect(0, 0, bounds.width, bounds.height);

      particles.forEach((particle) => {
        const age = elapsed - particle.delay;
        if (age < 0 || age > particle.life) return;

        const t = age / particle.life;
        const fade = Math.sin(Math.PI * Math.min(1, t)) * (1 - Math.max(0, t - 0.72) / 0.28);
        const drag = Math.pow(particle.drag, age * 60);
        const x = particle.x + particle.vx * age * drag;
        const y = particle.y + particle.vy * age + 0.5 * particle.gravity * age * age;
        const rotation = particle.rotation + particle.spin * age;

        if (particle.type === "star") {
          drawStar(context, x, y, particle.size, rotation, particle.color, Math.min(1, fade * 1.15));
          return;
        }

        context.save();
        context.globalAlpha = Math.min(1, fade * 1.08);
        context.strokeStyle = particle.color;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = particle.size * 2.6;
        if (particle.type === "streak") {
          context.lineWidth = Math.max(1, particle.size * 0.36);
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x - particle.vx * 0.075, y - particle.vy * 0.045);
          context.stroke();
        } else {
          context.beginPath();
          context.arc(x, y, particle.size * (1 - t * 0.42), 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      });

      if (now - startedAt < totalDuration) {
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }

    requestAnimationFrame(render);
  }

  function showDatePart(value, placeholder) {
    value.setAttribute("aria-hidden", "false");
    animate(placeholder, [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(.72)" },
    ], { duration: 300, easing: "ease-out" });
    animate(value, [
      { opacity: 0, filter: "blur(6px)", transform: "translate3d(0,12px,0) scale(.94)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,-1px,0) scale(1.025)", offset: 0.82 },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0) scale(1)" },
    ], { duration: 650 });
  }

  function finishReveal() {
    revealState = "revealed";
    dateDisplay.classList.remove("is-glowing");
    dateDisplay.classList.add("is-revealed");
    dateDisplay.setAttribute("aria-label", config.announcement);
    buttonLabel.textContent = config.revealedLabel;
    button.classList.add("is-revealed");
    button.setAttribute("aria-expanded", "true");
    announcement.textContent = config.announcement;
  }

  function revealReducedMotion() {
    elephantElements.forEach((elephant) => {
      const trunk = elephant.querySelector(".trunk-morph");
      trunk.setAttribute("d", trunk.dataset.raised);
      elephant.querySelectorAll(".trunk-detail--rest").forEach((detail) => { detail.style.opacity = "0"; });
      elephant.querySelectorAll(".trunk-detail--raised").forEach((detail) => { detail.style.opacity = "1"; });
      const marker = elephant.querySelector(".trunk-tip-marker");
      const nostril = elephant.querySelector(".trunk-nostril");
      marker.setAttribute("cx", "181");
      marker.setAttribute("cy", "54");
      nostril.setAttribute("cx", "181");
      nostril.setAttribute("cy", "55.5");
    });
    placeholders.forEach((placeholder) => { placeholder.style.opacity = "0"; });
    dateValues.forEach((value) => {
      value.style.opacity = "1";
      value.style.filter = "none";
      value.style.transform = "none";
      value.setAttribute("aria-hidden", "false");
    });
    finishReveal();
  }

  function revealDate() {
    if (revealState !== "concealed") return;
    revealState = "revealing";
    button.disabled = true;

    animate(button, [
      { transform: "scale(1)" },
      { transform: "scale(.965)", offset: 0.45 },
      { transform: "scale(1)" },
    ], { duration: 300, easing: "ease-out" });

    if (reducedMotion.matches) {
      revealReducedMotion();
      return;
    }

    animateTrunks();
    window.setTimeout(() => {
      createCelebrationParticles();
      dateDisplay.classList.add("is-glowing");
    }, config.reveal.particleStart * 1000);

    const revealStarts = [config.reveal.dayStart, config.reveal.monthStart, config.reveal.yearStart];
    dateValues.forEach((value, index) => {
      window.setTimeout(() => showDatePart(value, placeholders[index]), revealStarts[index] * 1000);
    });

    window.setTimeout(() => dateDisplay.classList.add("is-bursting"), config.reveal.yearStart * 1000);
    window.setTimeout(() => dateDisplay.classList.remove("is-bursting"), (config.reveal.yearStart + 0.7) * 1000);
    window.setTimeout(finishReveal, config.reveal.complete * 1000);
  }

  applyConfiguredDate();
  button.addEventListener("click", revealDate);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const ratio = entries[0]?.intersectionRatio ?? 0;
      if (ratio >= config.entrance.introThreshold) playStageOne();
      if (ratio >= config.entrance.elephantThreshold) playStageTwo();
      if (ratio >= config.entrance.actionThreshold) {
        playStageThree();
        observer.disconnect();
      }
    }, {
      threshold: [
        config.entrance.introThreshold,
        config.entrance.elephantThreshold,
        config.entrance.actionThreshold,
      ],
    });
    observer.observe(section);
  } else {
    playStageThree();
  }
}

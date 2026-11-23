import "./styles.css";
import { initDateReveal } from "./date-reveal.js";
import { DATE_REVEAL_CONFIG, HERO_CONFIG, TIMINGS } from "./config.js";

const stage = document.querySelector("#hero");
const coverScreen = document.querySelector("#coverScreen");
const coverTop = document.querySelector(".cover-panel--top");
const coverBottom = document.querySelector(".cover-panel--bottom");
const coverControls = [
  document.querySelector("#ganeshButton"),
  document.querySelector("#openButton"),
];
const replayButton = document.querySelector("#replayButton");
const soundButton = document.querySelector("#soundButton");
const audio = document.querySelector("#weddingAudio");
const petalField = document.querySelector("#petalField");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let state = "sealed";
let timelineAnimations = [];
let particleAnimations = [];
let timelineTimers = [];
let audioReady = false;

const ms = (seconds) => (seconds * 1000) / HERO_CONFIG.speed;

function applyConfiguration() {
  const root = document.documentElement;
  Object.entries(HERO_CONFIG.theme).forEach(([name, value]) => {
    root.style.setProperty(`--${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
  });

  document.querySelectorAll("[data-copy]").forEach((element) => {
    element.textContent = HERO_CONFIG[element.dataset.copy];
  });

  document.querySelectorAll("[data-copy-list]").forEach((container) => {
    const values = HERO_CONFIG[container.dataset.copyList];
    container.replaceChildren(
      ...values.map((value, index) => {
        const line = document.createElement("span");
        line.className = `detail-line detail-line--${index === 0 ? "relationship" : "parents"}`;
        line.textContent = value;
        return line;
      }),
    );
  });
}

function setupAudio() {
  if (!HERO_CONFIG.audioSrc) {
    soundButton.hidden = true;
    return;
  }

  audio.src = HERO_CONFIG.audioSrc;
  audio.loop = true;
  audio.addEventListener("canplay", () => {
    audioReady = true;
    soundButton.hidden = false;
  });
  audio.addEventListener("error", () => {
    audioReady = false;
    soundButton.hidden = true;
  });
  audio.load();
}

function createPetals() {
  const colors = [HERO_CONFIG.theme.emerald, HERO_CONFIG.theme.saffron, HERO_CONFIG.theme.blush];
  const tiers = [
    { size: [5, 8], blur: 1.6, opacity: 0.24, duration: [15, 19] },
    { size: [8, 13], blur: 0.7, opacity: 0.44, duration: [11, 15] },
    { size: [13, 19], blur: 0, opacity: 0.68, duration: [8, 12] },
  ];

  const seeded = (index, salt = 0) => {
    const value = Math.sin(index * 91.731 + salt * 17.113) * 43758.5453;
    return value - Math.floor(value);
  };

  petalField.replaceChildren();
  for (let index = 0; index < HERO_CONFIG.particleCount; index += 1) {
    const tier = tiers[index % tiers.length];
    const size = tier.size[0] + seeded(index, 1) * (tier.size[1] - tier.size[0]);
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${seeded(index, 2) * 96 + 2}%`;
    petal.style.setProperty("--petal-size", `${size.toFixed(1)}px`);
    petal.style.setProperty("--petal-blur", `${tier.blur}px`);
    petal.style.setProperty("--petal-color", colors[index % colors.length]);
    petal.dataset.index = String(index);
    petal.dataset.tier = String(index % tiers.length);
    petal.dataset.opacity = String(tier.opacity);
    petal.dataset.duration = String(tier.duration[0] + seeded(index, 3) * (tier.duration[1] - tier.duration[0]));
    petal.dataset.sway = String(20 + seeded(index, 4) * 54);
    petal.dataset.phase = String(seeded(index, 5) * 360);
    petalField.append(petal);
  }
}

function animateAt(element, keyframes, options) {
  if (!element) return null;
  const animation = element.animate(keyframes, {
    duration: ms(options.duration),
    delay: ms(options.start ?? 0),
    easing: options.easing ?? "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: options.fill ?? "both",
    iterations: options.iterations ?? 1,
  });
  timelineAnimations.push(animation);
  return animation;
}

function schedule(callback, seconds) {
  const timer = window.setTimeout(callback, ms(seconds));
  timelineTimers.push(timer);
}

function animateCover() {
  const stageHeight = stage.getBoundingClientRect().height;

  animateAt(
    coverTop,
    [
      { transform: "perspective(1100px) rotateX(0deg) translate3d(0,0,0)", filter: "drop-shadow(0 0 0 transparent)", offset: 0 },
      { transform: "perspective(1100px) rotateX(-8deg) translate3d(0,-5px,28px) scaleX(1.018)", filter: "drop-shadow(0 18px 18px rgb(7 59 46 / 24%))", offset: 0.27 },
      { transform: `perspective(1100px) rotateX(-3deg) translate3d(0,-${stageHeight * 0.76}px,0) scaleX(.985)`, filter: "drop-shadow(0 26px 22px rgb(7 59 46 / 17%))", offset: 1 },
    ],
    { ...TIMINGS.cover },
  );

  animateAt(
    coverBottom,
    [
      { transform: "perspective(1100px) rotateX(0deg) translate3d(0,0,0)", filter: "drop-shadow(0 0 0 transparent)", offset: 0 },
      { transform: "perspective(1100px) rotateX(8deg) translate3d(0,5px,28px) scaleX(1.018)", filter: "drop-shadow(0 -18px 18px rgb(7 59 46 / 24%))", offset: 0.27 },
      { transform: `perspective(1100px) rotateX(3deg) translate3d(0,${stageHeight * 0.58}px,0) scaleX(.985)`, filter: "drop-shadow(0 -26px 22px rgb(7 59 46 / 17%))", offset: 1 },
    ],
    { ...TIMINGS.cover },
  );

  coverControls.forEach((control) => {
    animateAt(control, [{ opacity: 1 }, { opacity: 0, transform: "translate3d(0,8px,0)" }], {
      start: 0,
      duration: 0.45,
      easing: "ease-out",
    });
  });
}

function animateArtwork() {
  const blobTimings = [
    [".ink-blob--bottom", 0],
    [".ink-blob--left", 0.18],
    [".ink-blob--right", 0.32],
    [".ink-blob--centre", 0.47],
  ];

  blobTimings.forEach(([selector, offset]) => {
    animateAt(
      document.querySelector(selector),
      [
        { opacity: 0, transform: "scale(.04)" },
        { opacity: 1, transform: "scale(.72)", offset: 0.55 },
        { opacity: 1, transform: "scale(1.62)" },
      ],
      { start: TIMINGS.artwork.start + offset, duration: TIMINGS.artwork.duration - offset * 0.35 },
    );
  });

  animateAt(
    document.querySelector(".scene-ken-burns"),
    [
      { opacity: 0.6, filter: "grayscale(1) saturate(.5)", transform: "scale(1.06)" },
      { opacity: 0.82, filter: "grayscale(.55) saturate(.72)", transform: "scale(1.035)", offset: 0.5 },
      { opacity: 1, filter: "grayscale(0) saturate(1)", transform: "scale(1)" },
    ],
    { ...TIMINGS.artwork },
  );

  document.querySelectorAll(".corner-floral, .chandelier").forEach((ornament, index) => {
    animateAt(
      ornament,
      [
        { opacity: 0, filter: "blur(5px)", transform: "translate3d(0,-14px,0) scale(.97)" },
        { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0) scale(1)" },
      ],
      { start: TIMINGS.ornaments.start + index * 0.11, duration: TIMINGS.ornaments.duration },
    );
  });

  animateAt(
    document.querySelector(".floral-toran"),
    [
      { opacity: 0, filter: "blur(5px)", transform: "translate3d(0,-10px,0) scaleX(.88)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0) scaleX(1)" },
    ],
    { ...TIMINGS.toran },
  );
}

function animateCopy() {
  animateAt(
    document.querySelector('[data-reveal="welcome"]'),
    [
      { opacity: 0, filter: "blur(6px)", transform: "translate3d(0,16px,0)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
    ],
    { ...TIMINGS.welcome },
  );

  const brideName = document.querySelector('[data-reveal="bride"] .couple-name');
  const groomName = document.querySelector('[data-reveal="groom"] .couple-name');
  animateAt(
    brideName,
    [
      { opacity: 0, filter: "blur(7px)", transform: "translate3d(-72px,18px,0)" },
      { opacity: 1, filter: "blur(1px)", transform: "translate3d(3px,-1px,0)", offset: 0.86 },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
    ],
    { ...TIMINGS.bride },
  );
  animateAt(
    groomName,
    [
      { opacity: 0, filter: "blur(7px)", transform: "translate3d(72px,18px,0)" },
      { opacity: 1, filter: "blur(1px)", transform: "translate3d(-3px,-1px,0)", offset: 0.86 },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
    ],
    { ...TIMINGS.groom },
  );

  document.querySelectorAll('[data-copy-list="groomDetails"] .detail-line').forEach((line, index) => {
    animateAt(
      line,
      [
        { opacity: 0, filter: "blur(5px)", transform: "translate3d(0,18px,0)" },
        { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
      ],
      { start: TIMINGS.groomDetails.start + index * TIMINGS.groomDetails.stagger, duration: TIMINGS.groomDetails.duration },
    );
  });

  animateAt(
    document.querySelector('[data-reveal="ampersand"]'),
    [
      { opacity: 0, filter: "blur(5px)", transform: "scale(.8)" },
      { opacity: 1, filter: "blur(0)", transform: "scale(1.06)", offset: 0.72 },
      { opacity: 1, filter: "blur(0)", transform: "scale(1)" },
    ],
    { ...TIMINGS.ampersand },
  );

  document.querySelectorAll('[data-copy-list="brideDetails"] .detail-line').forEach((line, index) => {
    animateAt(
      line,
      [
        { opacity: 0, filter: "blur(5px)", transform: "translate3d(0,-18px,0)" },
        { opacity: 1, filter: "blur(0)", transform: "translate3d(0,0,0)" },
      ],
      { start: TIMINGS.brideDetails.start + index * TIMINGS.brideDetails.stagger, duration: TIMINGS.brideDetails.duration },
    );
  });

  const scrollCue = document.querySelector('[data-reveal="scroll"]');
  animateAt(
    scrollCue,
    [
      { opacity: 0, filter: "blur(3px)", transform: "translate3d(-50%,12px,0)" },
      { opacity: 1, filter: "blur(0)", transform: "translate3d(-50%,0,0)" },
    ],
    { ...TIMINGS.scroll },
  );
  schedule(() => scrollCue.classList.add("is-looping"), TIMINGS.scroll.start + TIMINGS.scroll.duration);

  animateAt(
    replayButton,
    [
      { opacity: 0, transform: "translate3d(0,-8px,0)" },
      { opacity: 1, transform: "translate3d(0,0,0)" },
    ],
    { start: 1.55, duration: 0.55 },
  );
  if (!soundButton.hidden) {
    animateAt(
      soundButton,
      [
        { opacity: 0, transform: "translate3d(0,-8px,0)" },
        { opacity: 1, transform: "translate3d(0,0,0)" },
      ],
      { start: 1.55, duration: 0.55 },
    );
  }
}

function animatePetals() {
  const height = stage.getBoundingClientRect().height;
  document.querySelectorAll(".petal").forEach((petal, index) => {
    const sway = Number(petal.dataset.sway);
    const phase = Number(petal.dataset.phase);
    const opacity = Number(petal.dataset.opacity);
    const duration = Number(petal.dataset.duration);
    const rotation = 210 + (index % 7) * 47;
    const x = (step) => Math.sin((phase + step * 72) * (Math.PI / 180)) * sway;

    const animation = petal.animate(
      [
        { opacity: 0, transform: `translate3d(${x(0)}px,-40px,0) rotate3d(1,.4,.2,0deg)` },
        { opacity, transform: `translate3d(${x(1)}px,${height * 0.16}px,0) rotate3d(.7,1,.2,${rotation * 0.2}deg)`, offset: 0.16 },
        { opacity, transform: `translate3d(${x(2)}px,${height * 0.38}px,0) rotate3d(1,.5,.8,${rotation * 0.42}deg)`, offset: 0.38 },
        { opacity, transform: `translate3d(${x(3)}px,${height * 0.62}px,0) rotate3d(.4,1,.6,${rotation * 0.66}deg)`, offset: 0.62 },
        { opacity: opacity * 0.86, transform: `translate3d(${x(4)}px,${height * 0.88}px,0) rotate3d(1,.7,.2,${rotation * 0.88}deg)`, offset: 0.88 },
        { opacity: 0, transform: `translate3d(${x(5)}px,${height * 1.14}px,0) rotate3d(.8,1,.5,${rotation}deg)` },
      ],
      {
        duration: ms(duration),
        delay: ms(TIMINGS.particles.start + index * 0.13),
        easing: "linear",
        iterations: Infinity,
        fill: "both",
      },
    );
    particleAnimations.push(animation);
  });
}

async function tryStartAudio() {
  if (!audioReady || !audio.paused) return;
  try {
    await audio.play();
    soundButton.setAttribute("aria-label", "Pause music");
    soundButton.classList.add("is-playing");
  } catch {
    // The button remains available for a subsequent explicit user gesture.
  }
}

function playReducedMotionVersion() {
  state = "opening";
  coverControls.forEach((control) => {
    if ("disabled" in control) control.disabled = true;
  });
  stage.classList.add("is-final");
  replayButton.style.opacity = "1";
  replayButton.style.transform = "none";
  const fade = coverScreen.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 450,
    easing: "ease-out",
    fill: "forwards",
  });
  timelineAnimations.push(fade);
  fade.finished.then(() => {
    coverScreen.hidden = true;
    coverScreen.setAttribute("aria-hidden", "true");
    state = "revealed";
  });
}

export function playHeroTimeline() {
  animateCover();
  animateArtwork();
  animateCopy();
  animatePetals();

  schedule(() => {
    coverScreen.setAttribute("aria-hidden", "true");
    coverScreen.style.pointerEvents = "none";
    coverScreen.hidden = true;
  }, TIMINGS.cover.start + TIMINGS.cover.duration);

  schedule(() => {
    state = "revealed";
    stage.classList.add("is-idle");
  }, TIMINGS.complete);
}

export async function openInvitation() {
  if (state !== "sealed") return;
  state = "opening";
  coverControls.forEach((control) => {
    if ("disabled" in control) control.disabled = true;
  });
  await tryStartAudio();

  if (reducedMotion.matches) {
    playReducedMotionVersion();
    return;
  }
  playHeroTimeline();
}

function clearTimeline() {
  timelineAnimations.forEach((animation) => animation.cancel());
  particleAnimations.forEach((animation) => animation.cancel());
  timelineTimers.forEach((timer) => window.clearTimeout(timer));
  timelineAnimations = [];
  particleAnimations = [];
  timelineTimers = [];
}

function resetToSealed() {
  clearTimeline();
  state = "sealed";
  stage.classList.remove("is-idle", "is-final");
  document.querySelector('[data-reveal="scroll"]').classList.remove("is-looping");
  coverScreen.hidden = false;
  coverScreen.removeAttribute("style");
  coverScreen.setAttribute("aria-hidden", "false");
  coverScreen.style.pointerEvents = "auto";
  coverControls.forEach((control) => {
    control.removeAttribute("style");
    if ("disabled" in control) control.disabled = false;
  });
}

export function replayInvitation() {
  if (state === "opening") return;
  state = "replaying";
  resetToSealed();
  const timer = window.setTimeout(() => openInvitation(), 180);
  timelineTimers.push(timer);
}

async function toggleAudio() {
  if (!audioReady) return;
  if (audio.paused) {
    await tryStartAudio();
  } else {
    audio.pause();
    soundButton.setAttribute("aria-label", "Play music");
    soundButton.classList.remove("is-playing");
  }
}

applyConfiguration();
setupAudio();
createPetals();

document.querySelector("#ganeshButton").addEventListener("click", openInvitation);
document.querySelector("#openButton").addEventListener("click", openInvitation);
replayButton.addEventListener("click", replayInvitation);
soundButton.addEventListener("click", toggleAudio);

reducedMotion.addEventListener("change", () => {
  if (state === "opening") {
    resetToSealed();
  }
});

initDateReveal(DATE_REVEAL_CONFIG);

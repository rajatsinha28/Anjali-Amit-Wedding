export const HERO_CONFIG = {
  // Increase to speed everything up; decrease for a slower, more ceremonial pace.
  speed: 1,

  groomName: "Amit",
  brideName: "Anjali",
  welcomeLine: "We are honored to welcome you to the wedding ceremony of…",

  groomDetails: ["Son of", "Mr. Rajendra Prasad and Mrs. Rajpati Devi"],
  brideDetails: ["Daughter of", "Mr. Neeraj and Mrs. Roli Srivastava"],

  audioSrc: "",
  showLanguagePill: false,
  particleCount: 22,

  theme: {
    ivory: "#f7f0df",
    emerald: "#0d4b3a",
    deepEmerald: "#073b2e",
    gold: "#ba8a2e",
    saffron: "#cb7b3e",
    blush: "#d9a18d",
  },
};

// All values are seconds on the single compressed nine-second master timeline.
export const TIMINGS = {
  cover: { start: 0, duration: 2.4 },
  artwork: { start: 0.85, duration: 2.55 },
  particles: { start: 2.0 },
  ornaments: { start: 2.55, duration: 0.9 },
  toran: { start: 3.35, duration: 0.85 },
  welcome: { start: 3.75, duration: 0.8 },
  bride: { start: 4.45, duration: 1.1 },
  brideDetails: { start: 5.25, stagger: 0.18, duration: 0.75 },
  ampersand: { start: 5.9, duration: 0.55 },
  groom: { start: 6.35, duration: 1.1 },
  groomDetails: { start: 7.15, stagger: 0.18, duration: 0.85 },
  scroll: { start: 8.55, duration: 0.7 },
  complete: 9.4,
};

export const DATE_REVEAL_CONFIG = {
  day: "10",
  month: "DECEMBER",
  year: "2026",
  revealLabel: "REVEAL THE DATE",
  revealedLabel: "DATE REVEALED",
  announcement: "Wedding date: 10 December 2026",
  particlesPerSide: 30,
  entrance: {
    introThreshold: 0.12,
    elephantThreshold: 0.28,
    actionThreshold: 0.45,
    lotusDuration: 0.82,
    elephantDuration: 1.45,
    settleDuration: 0.28,
  },
  reveal: {
    trunkDuration: 0.95,
    particleStart: 0.82,
    celebrationDuration: 2.05,
    dayStart: 1.05,
    monthStart: 1.38,
    yearStart: 1.71,
    complete: 2.7,
  },
};

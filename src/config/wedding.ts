import { copy } from "./copy";
import { features, type FeatureFlags } from "./features";

export interface Venue {
  readonly name: string | null;
  readonly address: string | null;
  readonly mapsUrl: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
}

export interface WeddingEvent {
  readonly id: "haldi" | "mehendi-sangeet" | "wedding";
  readonly title: string;
  readonly dateDisplay: string;
  readonly timeDisplay: string;
  readonly startISO: string;
  readonly description: string;
  readonly venue: Venue | null;
  readonly durationMinutes: number;
}

export interface WeddingConfig {
  readonly timezone: "Asia/Kolkata";
  readonly couple: {
    readonly bride: { readonly name: string; readonly relation: string; readonly parents: string };
    readonly groom: { readonly name: string; readonly relation: string; readonly parents: string };
  };
  readonly weddingDate: { readonly display: string; readonly iso: string };
  readonly baraat: {
    readonly title: "Baraat";
    readonly startISO: string;
    readonly dateDisplay: string;
    readonly timeDisplay: string;
  };
  readonly events: readonly WeddingEvent[];
  readonly venue: Venue;
  readonly rsvp: { readonly whatsappNumber: string | null; readonly deadlineText: string | null };
  readonly music: {
    readonly src: string | null;
    readonly volume: number;
    readonly initialStartSeconds: number;
    readonly loopStartSeconds: number;
  };
  readonly heroPortrait: {
    readonly assetId: "hero-portrait";
    readonly alt: string;
    readonly focalPosition: { readonly x: number; readonly y: number };
  };
  readonly closingPortrait: {
    readonly assetId: string;
    readonly alt: string;
    readonly focalPosition: { readonly x: number; readonly y: number };
  } | null;
  readonly features: FeatureFlags;
}

const chancellorClub: Venue = {
  name: "Chancellor Club",
  address: "K-1, Ashiyana Colony, Lucknow, Uttar Pradesh 226012",
  mapsUrl: "https://maps.app.goo.gl/W2WcjwtsU7tR4kS16?g_st=aw",
  lat: null,
  lng: null,
};

export const wedding: WeddingConfig = {
  timezone: "Asia/Kolkata",
  couple: {
    bride: {
      name: "Anjali",
      relation: "Daughter of",
      parents: "Mr. Neeraj Srivastava and Mrs. Roli Srivastava",
    },
    groom: {
      name: "Amit",
      relation: "Son of",
      parents: "Mr. Rajendra Prasad and Mrs. Rajpati Devi",
    },
  },
  weddingDate: { display: "10 DECEMBER 2026", iso: "2026-12-10" },
  baraat: {
    title: "Baraat",
    startISO: "2026-12-10T21:00:00+05:30",
    dateDisplay: "10 DECEMBER 2026",
    timeDisplay: "9:00 PM",
  },
  events: [
    {
      id: "haldi",
      title: "HALDI CEREMONY",
      dateDisplay: "9 DECEMBER 2026",
      timeDisplay: "11:00 AM",
      startISO: "2026-12-09T11:00:00+05:30",
      description: copy.eventDescriptions.haldi,
      venue: chancellorClub,
      durationMinutes: 120,
    },
    {
      id: "mehendi-sangeet",
      title: "MEHENDI & SANGEET",
      dateDisplay: "9 DECEMBER 2026",
      timeDisplay: "7:00 PM",
      startISO: "2026-12-09T19:00:00+05:30",
      description: copy.eventDescriptions.mehendiSangeet,
      venue: chancellorClub,
      durationMinutes: 180,
    },
    {
      id: "wedding",
      title: "THE WEDDING CEREMONY",
      dateDisplay: "10 DECEMBER 2026",
      timeDisplay: "8:00 PM",
      startISO: "2026-12-10T20:00:00+05:30",
      description: copy.eventDescriptions.wedding,
      venue: chancellorClub,
      durationMinutes: 240,
    },
  ],
  venue: chancellorClub,
  rsvp: { whatsappNumber: null, deadlineText: null },
  music: {
    src: "/assets/audio/krishna-mahabharata-full.mp3",
    volume: 0.35,
    initialStartSeconds: 0,
    loopStartSeconds: 0,
  },
  heroPortrait: {
    assetId: "hero-portrait",
    alt: "Anjali and Amit standing together",
    focalPosition: { x: 60, y: 43 },
  },
  closingPortrait: {
    assetId: "album-moment-01",
    alt: "Anjali and Amit standing together in dark traditional outfits",
    focalPosition: { x: 50, y: 35 },
  },
  features,
} as const;

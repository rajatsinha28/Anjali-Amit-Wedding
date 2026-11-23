export interface FeatureFlags {
  readonly music: boolean;
  readonly countdown: boolean;
  readonly addToCalendar: boolean;
  readonly rsvpWhatsApp: boolean;
  readonly share: boolean;
  readonly guestPersonalisation: boolean;
  readonly languageToggle: boolean;
  readonly mapEmbed: boolean;
  readonly liveStreamLink: boolean;
  readonly devPanel: "dev-only";
  readonly sfx: boolean;
}

export const features: FeatureFlags = {
  music: true,
  countdown: true,
  addToCalendar: true,
  rsvpWhatsApp: true,
  share: true,
  guestPersonalisation: true,
  languageToggle: false,
  mapEmbed: false,
  liveStreamLink: false,
  devPanel: "dev-only",
  sfx: false,
} as const;

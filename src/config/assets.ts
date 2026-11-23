import generatedManifest from "../generated/assets-manifest.json";

export interface AssetSource {
  readonly src: string;
  readonly width: number;
}

export interface AssetSpec {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly avif: readonly AssetSource[];
  readonly webp: readonly AssetSource[];
  readonly fallback: string;
}

interface GeneratedAsset {
  width: number;
  height: number;
  avif: AssetSource[];
  webp: AssetSource[];
  fallback: string;
}

const generatedAssets = generatedManifest.assets as Record<string, GeneratedAsset>;

export const assets: Readonly<Record<string, AssetSpec>> = Object.fromEntries(
  Object.entries(generatedAssets).map(([id, asset]) => [id, { id, ...asset }]),
);

export const requiredAssetIds = [
  "ganesh-idol",
  "diya",
  "door-left",
  "door-right",
  "corner-tl",
  "arch-frame",
  "toran",
  "petal",
  "hero-portrait",
  "album-moment-01",
  "album-moment-02",
  "album-moment-03",
  "album-moment-04",
  "album-moment-05",
  "album-final-mountain",
  "album-final-evening",
  "album-final-cake",
  "album-final-celebration",
  "album-final-dance",
  "album-final-formal",
  "portrait-jharokha",
  "hero-side-string",
  "ceremony-haldi",
  "ceremony-mehendi-sangeet",
  "ceremony-wedding-mandap",
  "royal-scroll-roller",
  "royal-farman-border",
  "seal",
  "elephant-left",
  "elephant-right",
] as const;

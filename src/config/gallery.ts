export interface AlbumPhoto {
  readonly id: string;
  readonly assetId: string;
  readonly alt: string;
  readonly focalPosition: { readonly x: number; readonly y: number };
  readonly rotation: number;
}

export const gallery: readonly AlbumPhoto[] = [
  {
    id: "album-slot-01",
    assetId: "album-final-celebration",
    alt: "Anjali and Amit celebrating together beneath wedding lights",
    focalPosition: { x: 54, y: 48 },
    rotation: -0.8,
  },
  {
    id: "album-slot-02",
    assetId: "album-final-mountain",
    alt: "Anjali and Amit smiling at each other outdoors",
    focalPosition: { x: 50, y: 40 },
    rotation: 0.7,
  },
  {
    id: "album-slot-03",
    assetId: "album-final-evening",
    alt: "Anjali and Amit smiling together during an evening out",
    focalPosition: { x: 50, y: 35 },
    rotation: 0.9,
  },
  {
    id: "album-slot-04",
    assetId: "album-final-dance",
    alt: "Anjali and Amit dancing together on their wedding stage",
    focalPosition: { x: 50, y: 38 },
    rotation: -0.6,
  },
  {
    id: "album-slot-05",
    assetId: "album-final-cake",
    alt: "Anjali and Amit sharing cake at a celebration",
    focalPosition: { x: 73, y: 58 },
    rotation: -0.9,
  },
  {
    id: "album-slot-06",
    assetId: "album-moment-01",
    alt: "Anjali and Amit together at their wedding celebration",
    focalPosition: { x: 55, y: 78 },
    rotation: 0.6,
  },
  {
    id: "album-slot-07",
    assetId: "album-final-formal",
    alt: "Anjali and Amit looking at each other in formal attire",
    focalPosition: { x: 50, y: 39 },
    rotation: -0.7,
  },
  {
    id: "album-slot-08",
    assetId: "album-moment-02",
    alt: "Anjali and Amit sitting together and smiling at home",
    focalPosition: { x: 50, y: 58 },
    rotation: 0.8,
  },
] as const;

export const albumSpreads = [
  { id: "album-spread-01", left: gallery[0]!, right: gallery[1]! },
  { id: "album-spread-02", left: gallery[2]!, right: gallery[3]! },
  { id: "album-spread-03", left: gallery[4]!, right: gallery[5]! },
  { id: "album-spread-04", left: gallery[6]!, right: gallery[7]! },
] as const;

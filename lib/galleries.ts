export const GALLERIES = [
  'coast',
  'landscape',
  'wildlife',
  'birds',
  'insects',
  'river',
] as const;

export type Gallery = (typeof GALLERIES)[number];

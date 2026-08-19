export const XP_PER_LEVEL = 200;

export const LEVEL_TIERS = [
  { level: 1, minimumXp: 0, title: "New Explorer" },
  { level: 2, minimumXp: 200, title: "Campus Wanderer" },
  { level: 3, minimumXp: 400, title: "Community Connector" },
  { level: 4, minimumXp: 600, title: "Cultural Navigator" },
  { level: 5, minimumXp: 800, title: "Third Space Champion" },
  { level: 6, minimumXp: 1000, title: "OnSite Ambassador" },
] as const;

export function levelName(level: number) {
  const normalizedLevel = Math.max(1, Math.floor(level));

  return (
    [...LEVEL_TIERS]
      .reverse()
      .find((tier) => normalizedLevel >= tier.level)?.title ??
    LEVEL_TIERS[0].title
  );
}

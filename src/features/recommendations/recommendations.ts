import type { Space } from "@/features/spaces/spaces";

export type SpaceRecommendation = {
  distance_km: number | null;
  reason: string;
  score: number;
  space: Space;
};

export type RecommendationHistoryItem = {
  created_at: string;
  id: number;
  input_context: Record<string, unknown>;
  reason: string;
  score: number;
  space_id: number;
  user_id: number;
};

import type { Space } from "@/lib/spaces";

export type SpaceRecommendation = {
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

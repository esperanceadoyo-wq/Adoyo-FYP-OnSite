import { cookies } from "next/headers";
import { getBackendUrl } from "@/shared/lib/backend";
import type { UserProfile } from "@/features/dashboard/dashboard-data";
import type { Space } from "@/features/spaces/spaces";

export type ReflectionHistoryItem = {
  comfort_rating: number;
  created_at: string;
  id: number;
  learning_value_rating: number | null;
  mood_after: string | null;
  mood_before: string | null;
  reflection_text: string | null;
  social_rating: number | null;
  space: Space;
  space_id: number;
  visit_id: number | null;
  would_return: boolean | null;
};

export type ReflectionHistoryResult = {
  error: string | null;
  reflections: ReflectionHistoryItem[];
};

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const cookieHeader = (await cookies()).toString();

  try {
    const response = await fetch(`${getBackendUrl()}/api/profile`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { profile?: UserProfile };
    return data.profile ?? null;
  } catch {
    return null;
  }
}

export async function getReflectionHistory(
  limit = 6,
): Promise<ReflectionHistoryResult> {
  const cookieHeader = (await cookies()).toString();

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/reflections?limit=${limit}`,
      {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      },
    );
    if (!response.ok) {
      return {
        error: "Your reflection history is temporarily unavailable.",
        reflections: [],
      };
    }

    const data = (await response.json()) as {
      reflections?: ReflectionHistoryItem[];
    };
    return { error: null, reflections: data.reflections ?? [] };
  } catch {
    return {
      error: "Your reflection history is temporarily unavailable.",
      reflections: [],
    };
  }
}

export async function getVisitedSpaceIds(): Promise<number[]> {
  const cookieHeader = (await cookies()).toString();

  try {
    const response = await fetch(`${getBackendUrl()}/api/visits?limit=100`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as {
      visits?: Array<{ space_id: number }>;
    };
    return (data.visits ?? []).map((visit) => visit.space_id);
  } catch {
    return [];
  }
}

export function selectStretchSpace({
  profile,
  reflections,
  spaces,
  visitedSpaceIds = [],
}: {
  profile: UserProfile | null;
  reflections: ReflectionHistoryItem[];
  spaces: Space[];
  visitedSpaceIds?: number[];
}) {
  const exploredSpaceIds = new Set(
    [
      ...visitedSpaceIds,
      ...reflections.map((reflection) => reflection.space_id),
    ],
  );
  const preferredTypes = new Set(
    (profile?.preferred_space_types ?? []).map((type) => type.toLowerCase()),
  );
  const preferredIntensity = profile?.preferred_social_intensity;
  const unvisitedSpaces = spaces.filter(
    (space) => space.is_active && !exploredSpaceIds.has(space.id),
  );

  return (
    unvisitedSpaces
      .map((space) => {
        const categoryStretch =
          preferredTypes.size > 0 &&
          !preferredTypes.has(space.category.toLowerCase())
            ? 4
            : 0;
        const intensityStretch =
          preferredIntensity === null || preferredIntensity === undefined
            ? space.social_intensity
            : Math.abs(space.social_intensity - preferredIntensity) * 2;
        return {
          score: categoryStretch + intensityStretch + (space.rating ?? 0) / 10,
          space,
        };
      })
      .sort((left, right) => right.score - left.score)[0]?.space ?? null
  );
}

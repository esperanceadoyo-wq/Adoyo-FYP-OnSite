import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend";

export type UserProfile = {
  comfort_level: string | null;
  current_mood: string | null;
  home_campus: string | null;
  interests: string[];
  learning_goals: string[];
  location_consent: boolean;
  noise_tolerance: string | null;
  preferred_amenities: string[];
  preferred_social_intensity: number | null;
  preferred_space_types: string[];
};

export type UserProgress = {
  achievements: Array<{
    achievement?: {
      name: string;
      points: number;
    } | null;
  }>;
  current_level_xp: number;
  level: number;
  next_level_xp: number;
  reflections: number;
  visits: number;
  xp: number;
};

export async function getDashboardData() {
  const cookieHeader = (await cookies()).toString();

  const [profile, progress] = await Promise.all([
    fetchBackend<{ profile: UserProfile }>("/api/profile", cookieHeader),
    fetchBackend<{ progress: UserProgress }>("/api/progress", cookieHeader),
  ]);

  return {
    profile: profile?.profile ?? null,
    progress: progress?.progress ?? null,
  };
}

async function fetchBackend<T>(path: string, cookieHeader: string) {
  try {
    const response = await fetch(`${getBackendUrl()}${path}`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

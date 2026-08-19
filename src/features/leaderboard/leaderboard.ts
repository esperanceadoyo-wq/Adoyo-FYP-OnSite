import { cookies } from "next/headers";
import { getBackendUrl } from "@/shared/lib/backend";

export type LeaderboardEntry = {
  is_current_user: boolean;
  level: number;
  name: string;
  rank: number;
  reflections: number;
  title: string;
  user_id: number;
  visits: number;
  xp: number;
};

export type LeaderboardResult = {
  currentUserVisible: boolean;
  entries: LeaderboardEntry[];
  error: string | null;
  totalVisibleUsers: number;
};

export async function getLeaderboard(limit = 100): Promise<LeaderboardResult> {
  try {
    const cookieHeader = (await cookies()).toString();
    const response = await fetch(
      `${getBackendUrl()}/api/leaderboard?limit=${limit}`,
      {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      },
    );
    const data = (await response.json()) as {
      current_user_visible?: boolean;
      entries?: LeaderboardEntry[];
      error?: string;
      total_visible_users?: number;
    };

    if (!response.ok) {
      return {
        currentUserVisible: false,
        entries: [],
        error: data.error || "Leaderboard rankings are temporarily unavailable.",
        totalVisibleUsers: 0,
      };
    }

    return {
      currentUserVisible: data.current_user_visible ?? false,
      entries: data.entries ?? [],
      error: null,
      totalVisibleUsers: data.total_visible_users ?? 0,
    };
  } catch {
    return {
      currentUserVisible: false,
      entries: [],
      error: "Leaderboard rankings are temporarily unavailable.",
      totalVisibleUsers: 0,
    };
  }
}

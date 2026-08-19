import { cookies } from "next/headers";
import { getBackendUrl } from "@/shared/lib/backend";
import type { Space } from "@/features/spaces/spaces";

export type AdminLocation = {
  reflections: number;
  space: Space;
  visits: number;
};

export type AdminReflection = {
  comfort_rating: number;
  created_at: string;
  id: number;
  learning_value_rating: number | null;
  reflection_text: string | null;
  social_rating: number | null;
  space: { id: number; name: string; slug: string };
  user: { id: number; name: string };
};

export type AdminOverview = {
  locations: AdminLocation[];
  recent_reflections: AdminReflection[];
  stats: {
    active_locations: number;
    total_locations: number;
    total_reflections: number;
    total_visits: number;
  };
};

export async function getAdminOverview(): Promise<{
  error: string | null;
  overview: AdminOverview | null;
}> {
  try {
    const cookieHeader = (await cookies()).toString();
    const response = await fetch(`${getBackendUrl()}/api/admin/overview`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });
    const data = (await response.json()) as AdminOverview & { error?: string };

    if (!response.ok) {
      return {
        error: data.error || "Admin data is temporarily unavailable.",
        overview: null,
      };
    }

    return { error: null, overview: data };
  } catch {
    return { error: "Admin data is temporarily unavailable.", overview: null };
  }
}

import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend";
import type { Space } from "@/lib/spaces";

export type SavedSpace = {
  created_at: string;
  id: number;
  space: Space;
  space_id: number;
  user_id: number;
};

export async function getSavedSpaces(): Promise<{
  error: string | null;
  savedSpaces: SavedSpace[];
}> {
  try {
    const cookieHeader = (await cookies()).toString();
    const response = await fetch(`${getBackendUrl()}/api/saved-spaces`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });
    const data = (await response.json()) as {
      error?: string;
      saved_spaces?: SavedSpace[];
    };

    if (!response.ok) {
      return {
        error: data.error || "Saved spaces are temporarily unavailable.",
        savedSpaces: [],
      };
    }

    return { error: null, savedSpaces: data.saved_spaces ?? [] };
  } catch {
    return {
      error: "Saved spaces are temporarily unavailable.",
      savedSpaces: [],
    };
  }
}

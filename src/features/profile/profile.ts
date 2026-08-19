import { cookies } from "next/headers";
import { getBackendUrl } from "@/shared/lib/backend";
import type { UserProfile } from "@/features/dashboard/dashboard-data";

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

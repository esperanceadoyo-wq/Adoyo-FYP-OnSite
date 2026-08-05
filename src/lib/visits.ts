import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend";

export type Visit = {
  id: number;
  space_id: number;
  user_id: number;
  verification_method: string;
  visited_at: string;
};

export async function getVisit(visitId: number): Promise<Visit | null> {
  const cookieHeader = (await cookies()).toString();

  try {
    const response = await fetch(`${getBackendUrl()}/api/visits/${visitId}`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { visit?: Visit };
    return data.visit ?? null;
  } catch {
    return null;
  }
}

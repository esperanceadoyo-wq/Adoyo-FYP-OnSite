import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBackendUrl } from "@/lib/backend";
import type { AuthResponse, AuthUser } from "@/lib/auth";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieHeader = (await cookies()).toString();

  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/auth/me`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AuthResponse;
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function requireAuth(nextPath: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export async function requireAdmin(nextPath: string) {
  const user = await requireAuth(nextPath);

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

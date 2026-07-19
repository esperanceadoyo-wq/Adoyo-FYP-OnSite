import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyBackendRequest("/api/auth/me", { method: "GET" }, request);
}

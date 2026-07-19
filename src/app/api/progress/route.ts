import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyBackendRequest("/api/progress", { method: "GET" }, request);
}

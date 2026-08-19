import { proxyBackendRequest } from "@/shared/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const query = new URL(request.url).search;
  return proxyBackendRequest(`/api/admin/feedback${query}`, { method: "GET" }, request);
}

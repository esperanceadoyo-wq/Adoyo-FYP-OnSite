import { proxyBackendRequest } from "@/shared/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyBackendRequest(
    "/api/recommendations/history",
    { method: "GET" },
    request,
  );
}

import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyBackendRequest("/api/saved-spaces", { method: "GET" }, request);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return proxyBackendRequest(
    "/api/saved-spaces",
    { body: JSON.stringify(payload), method: "POST" },
    request,
  );
}

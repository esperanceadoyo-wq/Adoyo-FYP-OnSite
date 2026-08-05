import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const query = new URL(request.url).search;
  return proxyBackendRequest(`/api/visits${query}`, { method: "GET" }, request);
}

export async function POST(request: Request) {
  return proxyBackendRequest(
    "/api/visits",
    {
      body: await request.text(),
      method: "POST",
    },
    request,
  );
}

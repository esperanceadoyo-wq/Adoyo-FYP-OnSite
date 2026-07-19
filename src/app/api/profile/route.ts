import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyBackendRequest("/api/profile", { method: "GET" }, request);
}

export async function PUT(request: Request) {
  const payload = await request.json();

  return proxyBackendRequest(
    "/api/profile",
    {
      body: JSON.stringify(payload),
      method: "PUT",
    },
    request,
  );
}

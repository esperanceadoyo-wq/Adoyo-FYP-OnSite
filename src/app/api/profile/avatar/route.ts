import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyBackendRequest(
    "/api/profile/avatar",
    { method: "GET" },
    request,
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  const headers = new Headers();
  if (contentType) headers.set("content-type", contentType);

  return proxyBackendRequest(
    "/api/profile/avatar",
    {
      body: await request.arrayBuffer(),
      headers,
      method: "POST",
    },
    request,
  );
}

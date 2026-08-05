import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

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

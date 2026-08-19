import { proxyBackendRequest } from "@/shared/lib/backend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return proxyBackendRequest(
    "/api/chat",
    {
      body: await request.text(),
      method: "POST",
    },
    request,
  );
}

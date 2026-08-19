import { proxyBackendRequest } from "@/shared/lib/backend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json();

  return proxyBackendRequest(
    "/api/auth/login",
    {
      body: JSON.stringify(payload),
      method: "POST",
    },
    request,
  );
}

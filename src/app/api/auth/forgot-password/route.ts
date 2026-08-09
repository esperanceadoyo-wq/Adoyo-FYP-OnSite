import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json();

  return proxyBackendRequest(
    "/api/auth/forgot-password",
    {
      body: JSON.stringify(payload),
      method: "POST",
    },
    request,
  );
}

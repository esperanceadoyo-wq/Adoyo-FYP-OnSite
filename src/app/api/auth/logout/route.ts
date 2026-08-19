import { proxyBackendRequest } from "@/shared/lib/backend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return proxyBackendRequest(
    "/api/auth/logout",
    {
      method: "POST",
    },
    request,
  );
}

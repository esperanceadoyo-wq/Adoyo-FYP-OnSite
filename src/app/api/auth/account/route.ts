import { proxyBackendRequest } from "@/shared/lib/backend";

export async function PATCH(request: Request) {
  const payload = await request.json();

  return proxyBackendRequest(
    "/api/auth/account",
    {
      body: JSON.stringify(payload),
      method: "PATCH",
    },
    request,
  );
}

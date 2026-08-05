import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  const { spaceId } = await params;
  return proxyBackendRequest(
    `/api/spaces/${encodeURIComponent(spaceId)}`,
    { method: "GET" },
    request,
  );
}

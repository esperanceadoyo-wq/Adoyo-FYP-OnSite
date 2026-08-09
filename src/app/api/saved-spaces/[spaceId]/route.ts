import { proxyBackendRequest } from "@/lib/backend";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  const { spaceId } = await params;
  return proxyBackendRequest(
    `/api/saved-spaces/${encodeURIComponent(spaceId)}`,
    { method: "DELETE" },
    request,
  );
}

import { proxyBackendRequest } from "@/shared/lib/backend";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  const { spaceId } = await params;
  const payload = await request.json();
  return proxyBackendRequest(
    `/api/spaces/${encodeURIComponent(spaceId)}`,
    { body: JSON.stringify(payload), method: "PATCH" },
    request,
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  const { spaceId } = await params;
  return proxyBackendRequest(
    `/api/spaces/${encodeURIComponent(spaceId)}`,
    { method: "DELETE" },
    request,
  );
}

import { proxyBackendRequest } from "@/shared/lib/backend";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ visitId: string }> },
) {
  const { visitId } = await params;
  return proxyBackendRequest(
    `/api/visits/${encodeURIComponent(visitId)}`,
    { method: "GET" },
    request,
  );
}

import type { Metadata } from "next";
import { ReflectionForm } from "@/components/ReflectionForm";
import { catalogSpacePath } from "@/lib/space-flow";
import { requireAuth } from "@/lib/server-auth";
import { requireSpace } from "@/lib/server-spaces";
import { getSpaceDetails } from "@/lib/spaces";

type SpaceRouteProps = { params: Promise<{ spaceId: string }> };

export async function generateMetadata({
  params,
}: SpaceRouteProps): Promise<Metadata> {
  const { spaceId } = await params;
  const result = await getSpaceDetails(spaceId);
  return {
    title:
      result.status === "ok"
        ? `Post-Visit Reflection | ${result.space.name}`
        : "Post-Visit Reflection",
  };
}

export default async function PostVisitReflectionPage({
  params,
}: SpaceRouteProps) {
  const { spaceId } = await params;
  await requireAuth(catalogSpacePath(spaceId, "/reflection"));
  const space = await requireSpace(spaceId);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1120] p-4 text-white">
      <div className="relative flex h-auto w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0B1120] p-10 shadow-2xl lg:max-w-4xl">
        <ReflectionForm spaceName={space.name} />
      </div>
    </main>
  );
}

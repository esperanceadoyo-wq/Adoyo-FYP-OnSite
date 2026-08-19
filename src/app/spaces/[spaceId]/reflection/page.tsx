import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReflectionForm } from "@/features/spaces/components/ReflectionForm";
import { getCurrentProfile } from "@/features/profile/profile";
import { catalogSpacePath } from "@/features/spaces/space-flow";
import { requireAuth } from "@/features/auth/server-auth";
import { requireSpace } from "@/features/spaces/server-spaces";
import { getSpaceDetails } from "@/features/spaces/spaces";
import { getVisit } from "@/features/spaces/visits";

type SpaceRouteProps = {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
  searchParams,
}: SpaceRouteProps) {
  const { spaceId } = await params;
  const query = await searchParams;
  const visitId = parsePositiveInteger(firstValue(query.visitId));
  const reflectionPath = catalogSpacePath(spaceId, "/reflection");
  await requireAuth(
    visitId ? `${reflectionPath}?visitId=${visitId}` : reflectionPath,
  );
  const space = await requireSpace(spaceId);
  const [visit, profile] = await Promise.all([
    visitId ? getVisit(visitId) : null,
    getCurrentProfile(),
  ]);

  if (
    !visit ||
    visit.space_id !== space.id ||
    visit.verification_method !== "location"
  ) {
    redirect(catalogSpacePath(space.slug, "/location"));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-on-background">
      <div className="relative flex h-auto w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface p-10 shadow-2xl lg:max-w-4xl">
        <ReflectionForm
          moodBefore={profile?.current_mood ?? null}
          spaceId={space.id}
          visitId={visit.id}
        />
      </div>
    </main>
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInteger(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

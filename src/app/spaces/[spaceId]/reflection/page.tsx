import type { Metadata } from "next";
import Link from "next/link";
import { ReflectionForm } from "@/components/ReflectionForm";
import { getCurrentProfile } from "@/lib/profile";
import { catalogSpacePath } from "@/lib/space-flow";
import { requireAuth } from "@/lib/server-auth";
import { requireSpace } from "@/lib/server-spaces";
import { getSpaceDetails } from "@/lib/spaces";
import { getVisit } from "@/lib/visits";

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
    return <ReflectionRequired spaceName={space.name} spaceSlug={space.slug} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1120] p-4 text-white">
      <div className="relative flex h-auto w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0B1120] p-10 shadow-2xl lg:max-w-4xl">
        <ReflectionForm
          moodBefore={profile?.current_mood ?? null}
          spaceId={space.id}
          spaceName={space.name}
          visitId={visit.id}
        />
      </div>
    </main>
  );
}

function ReflectionRequired({
  spaceName,
  spaceSlug,
}: {
  spaceName: string;
  spaceSlug: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1120] px-6 text-white">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1E293B] text-primary">
          <span className="material-symbols-outlined text-4xl">rate_review</span>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">Verified visit required</h1>
        <p className="mt-3 leading-relaxed text-slate-400">
          Check in at {spaceName} before submitting a post-visit reflection.
        </p>
        <Link
          className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary font-bold text-[#0B1120]"
          href={catalogSpacePath(spaceSlug, "/location")}
        >
          Verify Your Visit
        </Link>
      </section>
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

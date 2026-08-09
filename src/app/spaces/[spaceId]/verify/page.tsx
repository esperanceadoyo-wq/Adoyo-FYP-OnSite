import type { Metadata } from "next";
import Link from "next/link";
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
        ? `Visit Verification | ${result.space.name}`
        : "Visit Verification",
  };
}

export default async function VisitVerificationPage({
  params,
  searchParams,
}: SpaceRouteProps) {
  const { spaceId } = await params;
  await requireAuth(catalogSpacePath(spaceId, "/verify"));
  const space = await requireSpace(spaceId);
  const query = await searchParams;
  const visitId = parsePositiveInteger(firstValue(query.visitId));
  const visit = visitId ? await getVisit(visitId) : null;

  if (
    !visit ||
    visit.space_id !== space.id ||
    visit.verification_method !== "location"
  ) {
    return <CheckInRequired spaceName={space.name} spaceSlug={space.slug} />;
  }

  const distance = parseMetric(firstValue(query.distance));
  const accuracy = parseMetric(firstValue(query.accuracy));
  const allowedDistance = parseMetric(firstValue(query.allowed));
  const distanceRequirementWaived = firstValue(query.distanceWaived) === "true";
  const reflectionQuery = new URLSearchParams({ visitId: String(visit.id) });

  return (
    <main className="flex min-h-[max(884px,100dvh)] flex-col overflow-hidden bg-background text-on-background antialiased">
      <header className="flex w-full items-center px-6 pb-4 pt-12">
        <Link
          className="flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest active:scale-95"
          href={catalogSpacePath(space.slug)}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Spaces
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pb-8">
        <section className="mt-4 space-y-3 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <svg
                aria-hidden="true"
                className="h-20 w-20 drop-shadow-[0_0_18px_rgba(42,184,203,0.55)]"
                fill="none"
                viewBox="0 0 80 80"
              >
                <path
                  d="M40 68C40 68 22 50.2 22 35.8C22 25.9 30.1 18 40 18C49.9 18 58 25.9 58 35.8C58 50.2 40 68 40 68Z"
                  fill="#2ab8cb"
                />
                <circle cx="40" cy="35" fill="#0F172A" r="6" />
              </svg>
              <div className="absolute right-1 top-1 h-5 w-5 rounded-full border-2 border-background bg-primary" />
            </div>
          </div>
          <h1 className="px-4 text-3xl font-extrabold leading-tight tracking-tight text-on-surface">
            You&apos;re here!
            <br />
            Reflection unlocked.
          </h1>
          <p className="px-8 text-sm font-medium leading-relaxed text-on-surface-variant opacity-80">
            Your location reading was accepted for {space.name}. Precise
            coordinates were not stored.
          </p>
        </section>

        <section className="mt-8 flex w-full flex-col gap-3">
          <SensorCard
            icon="near_me"
            label="Verified Distance"
            value={distance === null ? "Within check-in range" : formatMeters(distance)}
          />
          <SensorCard
            icon="track_changes"
            label="Location Accuracy"
            value={accuracy === null ? "Accepted" : `Within ${formatMeters(accuracy)}`}
          />
          <SensorCard
            icon="signal_cellular_4_bar"
            label={
              distanceRequirementWaived
                ? "Distance Requirement"
                : "Verification Range"
            }
            value={
              distanceRequirementWaived
                ? "Waived for this space"
                : allowedDistance === null
                ? "Passed"
                : `${formatMeters(allowedDistance)} maximum`
            }
          />
        </section>

        <section className="w-full pt-5">
          <Link
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-lg font-bold text-[#0F172A] shadow-[0_0_20px_rgba(42,184,203,0.3)] transition-all active:scale-95"
            href={`${catalogSpacePath(space.slug, "/reflection")}?${reflectionQuery.toString()}`}
          >
            View Reflection
            <span className="material-symbols-outlined font-bold">
              arrow_forward
            </span>
          </Link>
          <p className="mt-6 px-10 text-center text-xs font-medium leading-relaxed text-on-surface-variant">
            Visit #{visit.id} was recorded using one-time location verification.
          </p>
        </section>
      </div>
    </main>
  );
}

function CheckInRequired({
  spaceName,
  spaceSlug,
}: {
  spaceName: string;
  spaceSlug: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-on-background">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container-high text-primary">
          <span className="material-symbols-outlined text-4xl">location_off</span>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">Check-in required</h1>
        <p className="mt-3 leading-relaxed text-on-surface-variant">
          Complete location verification at {spaceName} before opening the visit
          confirmation.
        </p>
        <Link
          className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary font-bold text-[#0F172A]"
          href={catalogSpacePath(spaceSlug, "/location")}
        >
          Verify Your Location
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

function parseMetric(value: string | undefined) {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function formatMeters(value: number) {
  if (value < 1000) return `${Math.round(value)} meters`;
  return `${(value / 1000).toFixed(1)} km`;
}

function SensorCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-low p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-xl text-primary">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            {label}
          </p>
          <p className="text-base font-semibold text-on-surface">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
        ACTIVE
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
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
        ? `Visit Verification | ${result.space.name}`
        : "Visit Verification",
  };
}

export default async function VisitVerificationPage({ params }: SpaceRouteProps) {
  const { spaceId } = await params;
  await requireAuth(catalogSpacePath(spaceId, "/verify"));
  const space = await requireSpace(spaceId);

  return (
    <main className="flex min-h-[max(884px,100dvh)] flex-col overflow-hidden bg-[#0F172A] text-white antialiased">
      <header className="flex w-full items-center px-6 pb-4 pt-12">
        <Link
          className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 active:scale-95"
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
              <div className="absolute right-1 top-1 h-5 w-5 rounded-full border-2 border-[#0F172A] bg-primary" />
            </div>
          </div>
          <h1 className="px-4 text-3xl font-extrabold leading-tight tracking-tight text-white">
            You&apos;re here!
            <br />
            Reflection unlocked.
          </h1>
          <p className="px-8 text-sm font-medium leading-relaxed text-slate-400 opacity-80">
            You must be within 5 meters of {space.name} to check in.
          </p>
        </section>

        <section className="mt-8 flex w-full flex-col gap-3">
          <SensorCard
            icon="near_me"
            label="Current Distance"
            value="3 meters away"
          />
          <SensorCard
            icon="track_changes"
            label="Estimated Accuracy"
            value="5 meters"
          />
          <SensorCard
            icon="signal_cellular_4_bar"
            label="GPS Signal Strength"
            value="Excellent"
          />
        </section>

        <section className="w-full pt-5">
          <Link
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-lg font-bold text-[#0F172A] shadow-[0_0_20px_rgba(42,184,203,0.3)] transition-all active:scale-95"
            href={catalogSpacePath(space.slug, "/reflection")}
          >
            View Reflection
            <span className="material-symbols-outlined font-bold">
              arrow_forward
            </span>
          </Link>
          <p className="mt-6 px-10 text-center text-xs font-medium leading-relaxed text-slate-500">
            Verify location to record your visit and unlock reflection.
          </p>
        </section>
      </div>
    </main>
  );
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
    <div className="flex items-center justify-between rounded-2xl border border-slate-700/50 bg-[#1E293B] p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-xl text-primary">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="text-base font-semibold text-white">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
        ACTIVE
      </div>
    </div>
  );
}

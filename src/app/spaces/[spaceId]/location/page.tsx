import type { Metadata } from "next";
import Link from "next/link";
import { featuredSpace, spacePath } from "@/lib/space-flow";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: `Location Access | ${featuredSpace.name}`,
};

export default async function LocationAccessPage() {
  await requireAuth(spacePath("/location"));

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background text-on-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(42,184,203,0.14),transparent_34%),radial-gradient(circle_at_78%_70%,rgba(249,115,22,0.08),transparent_30%)]" />

      <header className="fixed top-0 z-50 flex w-full items-center px-6 py-6">
        <Link
          aria-label="Back to space details"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest/50 text-on-surface backdrop-blur-md transition-colors hover:bg-surface-container-highest active:scale-90"
          href={spacePath()}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
      </header>

      <section className="relative flex w-full max-w-md flex-1 flex-col items-center justify-center px-8 pb-12 pt-16 text-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/5 bg-surface-container-highest/40 shadow-2xl backdrop-blur-xl">
            <span
              className="material-symbols-outlined text-7xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
            <div
              className="absolute -right-2 -top-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full border border-primary/20 bg-primary/10"
              style={{ animationDuration: "3s" }}
            >
              <span className="material-symbols-outlined text-sm text-primary">
                verified
              </span>
            </div>
          </div>
        </div>

        <div className="mb-12 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Verify Your Attendance
          </h1>
          <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
            To confirm your arrival at this space and unlock your post-visit
            reflection, please share your location. We prioritize your privacy:
            this is a one-time check to verify you are at the space. We do not
            track your movements, store your history, or monitor you once you
            are checked in.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary-container shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
            href={spacePath("/verify")}
          >
            <span className="material-symbols-outlined text-xl">my_location</span>
            Allow Location Access
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-xl border border-outline-variant/30 bg-transparent font-medium text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-[0.98]"
            href={spacePath()}
          >
            Not Now
          </Link>
        </div>
      </section>

      <footer className="relative flex w-full flex-col items-center gap-2 py-8 opacity-60">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-primary">
            security
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            End-to-End Privacy
          </span>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";

export default function SpaceNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6 text-center text-white">
      <section className="max-w-md">
        <span className="material-symbols-outlined text-6xl text-primary">
          wrong_location
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Space not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          This space is unavailable or is no longer part of the active catalog.
        </p>
        <Link
          className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-on-primary"
          href="/explore"
        >
          Return to Explore
        </Link>
      </section>
    </main>
  );
}

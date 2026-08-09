import type { Metadata } from "next";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { getAdminOverview } from "@/lib/admin";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAdmin } from "@/lib/server-auth";
import { AdminLocationsTable } from "./admin-locations-table";

export const metadata: Metadata = {
  title: "Admin Panel - Locations Management | OnSite",
};

type StatCard = {
  icon: string;
  label: string;
  value: string;
  badge: string;
};

type Reflection = {
  borderClassName: string;
  detail: string;
  id: number;
  quote: string;
  time: string;
};

export default async function AdminPage() {
  const user = await requireAdmin("/admin");
  const [{ progress }, adminResult] = await Promise.all([
    getDashboardData(),
    getAdminOverview(),
  ]);
  const overview = adminResult.overview;
  const stats: StatCard[] = [
    {
      badge: `${overview?.stats.active_locations ?? 0} Active`,
      icon: "map",
      label: "Total Managed Locations",
      value: String(overview?.stats.total_locations ?? 0),
    },
    {
      badge: "Live Data",
      icon: "group",
      label: "Total Visits (Global)",
      value: (overview?.stats.total_visits ?? 0).toLocaleString(),
    },
    {
      badge: "Live Data",
      icon: "auto_awesome",
      label: "Total Reflections",
      value: (overview?.stats.total_reflections ?? 0).toLocaleString(),
    },
  ];
  const reflections: Reflection[] = (overview?.recent_reflections ?? []).map(
    (reflection) => ({
      borderClassName:
        reflection.comfort_rating >= 4 ? "border-[#22D3EE]" : "border-slate-600",
      detail: `${reflection.user.name} rated comfort ${reflection.comfort_rating}/5 at ${reflection.space.name}.`,
      id: reflection.id,
      quote: reflection.reflection_text || `Reflection for ${reflection.space.name}`,
      time: formatRelativeTime(reflection.created_at),
    }),
  );

  return (
    <AppChrome activeHref="/admin" progress={progress} user={user}>
      <div className="text-slate-300">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Locations Overview
              </h2>
              <p className="mt-1 text-slate-400">
                Manage and monitor high-performance site deployments.
              </p>
            </div>
            <Link
              className="flex items-center gap-2 rounded-xl bg-[#22D3EE] px-6 py-3 font-bold text-[#0B1120] shadow-lg shadow-[#22D3EE]/20 transition-all hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-95"
              href="/admin/new"
            >
              <span className="material-symbols-outlined">add_location</span>
              Add New Location
            </Link>
          </div>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-[#161E2E] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/20 p-6">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <span className="material-symbols-outlined text-[#22D3EE]">
                  list_alt
                </span>
                Active Deployments
              </h3>
              <div className="flex gap-2">
                <button
                  aria-label="Filter locations"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button
                  aria-label="Download locations"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>
            <AdminLocationsTable locations={overview?.locations ?? []} />
          </section>

          <section className="grid grid-cols-1 gap-6 pb-12">
            <div className="flex h-80 flex-col rounded-2xl border border-slate-700/50 bg-[#161E2E] p-6">
              <h4 className="mb-4 text-lg font-bold text-white">
                Latest Reflections
              </h4>
              <div className="custom-scrollbar space-y-4 overflow-y-auto pr-2">
                {reflections.map((reflection) => (
                  <ReflectionCard key={reflection.id} reflection={reflection} />
                ))}
                {reflections.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">
                    {adminResult.error || "No reflections have been submitted yet."}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppChrome>
  );
}

function StatCard({ stat }: { stat: StatCard }) {
  return (
    <article className="group flex h-40 flex-col justify-between rounded-2xl border border-slate-700/50 bg-[#161E2E] p-6 transition-all hover:border-[#22D3EE]/30">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-[#22D3EE]/10 p-3 text-[#22D3EE]">
          <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
        </div>
        <span className="rounded-full bg-[#22D3EE]/10 px-2 py-1 text-[10px] font-bold text-[#22D3EE]">
          {stat.badge}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {stat.label}
        </p>
        <h3 className="mt-1 text-3xl font-bold text-white">{stat.value}</h3>
      </div>
    </article>
  );
}

function ReflectionCard({ reflection }: { reflection: Reflection }) {
  return (
    <article
      className={`rounded-xl border-l-4 bg-slate-800/30 p-4 ${reflection.borderClassName}`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-xs font-bold text-white">&quot;{reflection.quote}&quot;</p>
        <span className="text-[9px] uppercase text-slate-500">
          {reflection.time}
        </span>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-400">
        {reflection.detail}
      </p>
    </article>
  );
}

function formatRelativeTime(value: string) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 1000),
  );
  if (elapsedSeconds < 60) return "Just now";
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  return `${Math.floor(elapsedSeconds / 86400)}d ago`;
}

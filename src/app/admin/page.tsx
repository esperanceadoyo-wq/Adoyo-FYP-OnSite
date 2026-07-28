import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Admin Panel - Locations Management | OnSite",
};

type StatCard = {
  icon: string;
  label: string;
  value: string;
  badge: string;
};

type LocationRow = {
  category: string;
  id: string;
  image?: string;
  name: string;
  reflections: string;
  status: "Active" | "Offline";
  visits: string;
};

type Reflection = {
  borderClassName: string;
  detail: string;
  quote: string;
  time: string;
};

const stats: StatCard[] = [
  {
    badge: "+12%",
    icon: "map",
    label: "Total Managed Locations",
    value: "3",
  },
  {
    badge: "+24k",
    icon: "group",
    label: "Total Visits (Global)",
    value: "42",
  },
  {
    badge: "New Record",
    icon: "auto_awesome",
    label: "Total Reflections",
    value: "18",
  },
];

const locations: LocationRow[] = [
  {
    category: "Public",
    id: "LOC-882-C",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClhoMIwQD6j1yDT-5IeA1hHT-oazio_ycg2tGLjEvOHeZ7QUdnbiFkQFZUQKlfcFgJ8Q4kLelmRxhaWUi4NSiCHfBsozaNs8ZngkwBoObEoX-oEqLjxpNtgiPs-iBt4C6sIGeyHPeV3aa_ALqZzJ5QYgo0CQyP5hZffG6E2OJoj7vynH7gH3uKmoplz-nVPO44xeePqbmSHrm9nO4Y4Y1OIdpmwf5bBqI_ElDxsdA-XE4fyHmtF_wW1_DBkqJrz4ZZNPQINm80LFAY",
    name: "Cyberjaya Community Library",
    reflections: "3,410",
    status: "Active",
    visits: "14,202",
  },
  {
    category: "Casual",
    id: "LOC-441-B",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXCf3YYxAs2ngby25WUQxWVCYPPhXpp9ZHBwtaOvsASZkJIr-QosutJPTPZzAoRv_5-E4BRyAEAp280CTGD71j2JKQeR1e2winHfybue0QOWfdBGewXeYqTAsS6FCxjQuTfBYnE3Cp5LXNGMssjWTAHAgC5DfEKvm09qtyqf2u2QMrul_vCap1QuYrOHfMBpUuTVRnczEPb3lsJr6NW8X6KVPplglgvQvmcfQaH9HdnheT4zpBcMKvzTpQ2IuRNk3UZljcFZtWZqnZ",
    name: "Blue Flow Cafe",
    reflections: "1,240",
    status: "Active",
    visits: "8,912",
  },
  {
    category: "Office",
    id: "LOC-109-Z",
    name: "Zenith Workspace",
    reflections: "890",
    status: "Offline",
    visits: "4,200",
  },
];

const reflections: Reflection[] = [
  {
    borderClassName: "border-[#22D3EE]",
    detail: "System recorded a high NPS score of 9.4 for this location session.",
    quote: "Incredible quiet at the Library.",
    time: "2m ago",
  },
  {
    borderClassName: "border-slate-600",
    detail: "Engagement spike detected in casual seating area B.",
    quote: "Coffee at Blue Flow was optimal.",
    time: "14m ago",
  },
  {
    borderClassName: "border-[#22D3EE]",
    detail: "NFC interaction triggered correctly on first attempt.",
    quote: "Smooth check-in experience.",
    time: "1h ago",
  },
];

export default async function AdminPage() {
  const user = await requireAuth("/admin");
  const { progress } = await getDashboardData();

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
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-700/30 text-[11px] uppercase tracking-widest text-slate-500">
                    <th className="px-6 py-4 font-semibold">Location Name</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Total Visits</th>
                    <th className="px-6 py-4 font-semibold">Reflections</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {locations.map((location) => (
                    <LocationTableRow key={location.id} location={location} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/50 bg-slate-900/40 p-4">
              <p className="text-[11px] text-slate-500">
                Showing 1 to 3 of 3 entries
              </p>
              <div className="flex gap-1">
                <button className="rounded-lg bg-[#22D3EE] px-3 py-1 text-xs font-bold text-[#0B1120]">
                  1
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 pb-12">
            <div className="flex h-80 flex-col rounded-2xl border border-slate-700/50 bg-[#161E2E] p-6">
              <h4 className="mb-4 text-lg font-bold text-white">
                Latest Reflections
              </h4>
              <div className="custom-scrollbar space-y-4 overflow-y-auto pr-2">
                {reflections.map((reflection) => (
                  <ReflectionCard key={reflection.time} reflection={reflection} />
                ))}
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

function LocationTableRow({ location }: { location: LocationRow }) {
  const isActive = location.status === "Active";

  return (
    <tr className="group transition-colors hover:bg-slate-800/40">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-700">
            {location.image ? (
              <Image
                alt={location.name}
                className="object-cover"
                fill
                sizes="40px"
                src={location.image}
              />
            ) : (
              <span className="material-symbols-outlined text-slate-500">
                image_not_supported
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white transition-colors group-hover:text-[#22D3EE]">
              {location.name}
            </p>
            <p className="text-[10px] text-slate-500">ID: {location.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-300">
          {location.category}
        </span>
      </td>
      <td className="px-6 py-5 text-sm font-medium text-slate-300">
        {location.visits}
      </td>
      <td className="px-6 py-5 text-sm font-medium text-slate-300">
        {location.reflections}
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? "animate-pulse bg-[#22D3EE]" : "bg-slate-500"
            }`}
          />
          <span
            className={`text-[10px] font-bold uppercase ${
              isActive ? "text-[#22D3EE]" : "text-slate-500"
            }`}
          >
            {location.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            aria-label={`View ${location.name}`}
            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-[#22D3EE]/20 hover:text-[#22D3EE]"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
          </button>
          <button
            aria-label={`Delete ${location.name}`}
            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </td>
    </tr>
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

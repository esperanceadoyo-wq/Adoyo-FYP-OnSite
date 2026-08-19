"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminLocation } from "@/features/admin/admin";

export function AdminLocationsTable({ locations }: { locations: AdminLocation[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function setLocationActive(location: AdminLocation, isActive: boolean) {
    const action = isActive ? "reactivate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} ${location.space.name}?`)) {
      return;
    }

    setUpdatingId(location.space.id);
    try {
      const response = await fetch(`/api/spaces/${location.space.id}`, {
        ...(isActive
          ? {
              body: JSON.stringify({ is_active: true }),
              headers: { "content-type": "application/json" },
              method: "PATCH",
            }
          : { method: "DELETE" }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        window.alert(data.error || `Could not ${action} this location.`);
        return;
      }
      router.refresh();
    } catch {
      window.alert("Could not reach the backend. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
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
              <LocationTableRow
                key={location.space.id}
                location={location}
                onSetActive={setLocationActive}
                updating={updatingId === location.space.id}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-700/50 bg-slate-900/40 p-4">
        <p className="text-[11px] text-slate-500">
          Showing {locations.length === 0 ? 0 : 1} to {locations.length} of {locations.length} entries
        </p>
        <div className="flex gap-1">
          <button className="rounded-lg bg-[#22D3EE] px-3 py-1 text-xs font-bold text-[#0B1120]">
            1
          </button>
        </div>
      </div>
    </>
  );
}

function LocationTableRow({
  location,
  onSetActive,
  updating,
}: {
  location: AdminLocation;
  onSetActive: (location: AdminLocation, isActive: boolean) => Promise<void>;
  updating: boolean;
}) {
  const { space } = location;
  const isActive = space.is_active;

  return (
    <tr className="group transition-colors hover:bg-slate-800/40">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-700">
            {space.image_url ? (
              <Image alt={space.image_alt || space.name} className="object-cover" fill sizes="40px" src={space.image_url} />
            ) : (
              <span className="material-symbols-outlined text-slate-500">image_not_supported</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white transition-colors group-hover:text-[#22D3EE]">{space.name}</p>
            <p className="text-[10px] text-slate-500">ID: LOC-{String(space.id).padStart(3, "0")}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5"><span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-300">{space.category}</span></td>
      <td className="px-6 py-5 text-sm font-medium text-slate-300">{location.visits.toLocaleString()}</td>
      <td className="px-6 py-5 text-sm font-medium text-slate-300">{location.reflections.toLocaleString()}</td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "animate-pulse bg-[#22D3EE]" : "bg-slate-500"}`} />
          <span className={`text-[10px] font-bold uppercase ${isActive ? "text-[#22D3EE]" : "text-slate-500"}`}>{isActive ? "Active" : "Offline"}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          {isActive ? (
            <Link aria-label={`View ${space.name}`} className="rounded-lg p-2 text-slate-500 transition-all hover:bg-[#22D3EE]/20 hover:text-[#22D3EE]" href={`/spaces/${space.slug}`}>
              <span className="material-symbols-outlined text-sm">visibility</span>
            </Link>
          ) : (
            <button aria-label={`${space.name} is offline`} className="rounded-lg p-2 text-slate-500" disabled>
              <span className="material-symbols-outlined text-sm">visibility_off</span>
            </button>
          )}
          <button
            aria-label={`${isActive ? "Deactivate" : "Reactivate"} ${space.name}`}
            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
            disabled={updating}
            onClick={() => onSetActive(location, !isActive)}
          >
            <span className="material-symbols-outlined text-sm">{isActive ? "delete" : "restore_from_trash"}</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

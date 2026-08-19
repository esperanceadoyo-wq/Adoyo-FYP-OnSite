"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { SavedSpace } from "@/features/saved/saved-spaces";
import { catalogSpacePath } from "@/features/spaces/space-flow";

export function SavedPageClient({
  initialError,
  initialItems,
}: {
  initialError: string | null;
  initialItems: SavedSpace[];
}) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(initialError);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [item.space.category, item.space.description, item.space.name].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [items, query]);

  async function removeItem(item: SavedSpace) {
    setRemovingId(item.id);
    setError(null);
    try {
      const response = await fetch(`/api/saved-spaces/${item.space_id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        const message = data.error || "This saved space could not be removed.";
        setError(message);
        window.alert(message);
        return;
      }

      setItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id),
      );
    } catch {
      const message = "Could not reach the backend. Please try again.";
      setError(message);
      window.alert(message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="overflow-x-hidden text-white antialiased">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Saved Pages
          </h1>
          <p className="text-lg font-medium text-slate-400">
            Quick access to your bookmarked spaces and reflections
          </p>
        </header>

        <section className="mb-8 flex flex-col gap-4 md:flex-row">
          <label className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <span className="sr-only">Search saved spaces</span>
            <input
              className="w-full rounded-xl border border-[#1E293B] bg-[#161E2E] py-3 pl-12 pr-4 text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#22D3EE]/60 focus:ring-2 focus:ring-[#22D3EE]/50"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search saved spaces..."
              type="text"
              value={query}
            />
          </label>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#161E2E] px-4 py-3 text-slate-300 transition-colors hover:bg-[#1E293B]">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              All Types
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#161E2E] px-4 py-3 text-slate-300 transition-colors hover:bg-[#1E293B]">
              <span className="material-symbols-outlined text-sm">sort</span>
              Date Added
            </button>
          </div>
        </section>

        {visibleItems.length ? (
          <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {visibleItems.map((item) => (
              <SavedCard
                item={item}
                key={item.id}
                onRemove={() => removeItem(item)}
                removing={removingId === item.id}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-[#1E293B] bg-[#161E2E] p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-[#22D3EE]">
              bookmark
            </span>
            <h2 className="mt-4 text-xl font-bold">
              {error ? "Saved spaces unavailable" : "No saved spaces found"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {error ||
                "Try a different search, or save a few more spaces from your dashboard."}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function SavedCard({
  item,
  onRemove,
  removing,
}: {
  item: SavedSpace;
  onRemove: () => void;
  removing: boolean;
}) {
  const { space } = item;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#1E293B] bg-[#161E2E] shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48">
        {space.image_url ? (
          <Image
            alt={space.image_alt || space.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={space.image_url}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            <span className="material-symbols-outlined text-5xl">
              image_not_supported
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-[#22D3EE]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#22D3EE] backdrop-blur-md">
            {formatLabel(space.category)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-white">{space.name}</h3>
          <button
            aria-label={`Remove ${space.name} from saved pages`}
            className="p-1 text-slate-500 transition-colors hover:text-red-400 disabled:opacity-60"
            disabled={removing}
            onClick={onRemove}
            type="button"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          Saved on {formatSavedDate(item.created_at)}
        </p>
        <div className="mb-6 rounded-lg border border-white/5 bg-[#0B1120]/50 p-3">
          <p className="text-sm italic text-slate-300">
            &quot;{space.description}&quot;
          </p>
        </div>
        <Link
          className="block w-full rounded-xl bg-[#22D3EE] py-2.5 text-center text-sm font-bold text-[#0B1120] transition-opacity hover:opacity-90"
          href={catalogSpacePath(space.slug)}
        >
          View Space
        </Link>
      </div>
    </article>
  );
}

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

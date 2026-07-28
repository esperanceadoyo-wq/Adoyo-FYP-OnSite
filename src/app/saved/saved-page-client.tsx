"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { spacePath } from "@/lib/space-flow";

type SavedItem = {
  category: string;
  date: string;
  image: string;
  imageAlt: string;
  note: string;
  title: string;
};

const savedItems: SavedItem[] = [
  {
    category: "Library",
    date: "July 10, 2026",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBaMDZtg86laYk-VFygBceo_e8Gj-TtEy7adkOKANL_y3dys0VJAhrlw_3gkMi6EjpOnfHwgVVYUc110hkh2NjqB0nbKrsH-ENN_SOJet15qqwXQpZ8SLCY8uaOqryLut3P2lTBFuNoNJbVXLO3Vr0MvipwNLWkFK_CHyldQ87q33w7DxhHu582m2q8GundoF5lJJ-EhkPcwy8yIfNdRJuP8umj6dPzWHvdrhkIIxXSzP3pVD2___c-CziE1cgYj4i1dEqtqpaGJTQ",
    imageAlt:
      "A modern high-tech community library with tall glass windows, sleek wooden shelves, and minimalist work pods.",
    note: "Great for deep focus and near the cafe. The Wi-Fi is incredibly stable for long study sessions.",
    title: "Cyberjaya Community Library",
  },
  {
    category: "Outdoor",
    date: "June 28, 2026",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqmTalytP7LcX2f5WmPDpfrj5DKc9pgIB0mn-wiyLigv7Vn2SpU8WRhGlpjwYvXlmwkblbN9aRo7_CvAMhYAndEe9uH-jh9qF_xxSLXCfKcmfH3ZEtoCDSLGs5rJbNGxZTMD_V1XqlL2_epXMcIMeZWmPOXmPsHSlCOA1NeZq1gaornBQQ3zvTSxps6L5DUB59KqyacdFpGOWzRdEnPIFDPj2Y5tOh3hnQTjCCcdpU3hnW9gpwXAtHJpKQkg6X2h6ogzSWQUNtzl2a",
    imageAlt:
      "A rooftop sky garden with tropical greenery, winding stone paths, and a futuristic skyline at sunset.",
    note: "Perfect sunset views. A bit breezy, so bring a jacket. Best reflection spot on campus.",
    title: "The Sky Garden",
  },
  {
    category: "Lounge",
    date: "July 02, 2026",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpDnizp1RQ0KTqGdQerIt9tajNLxd47C7gThMaocZEKirdjK5Mwlw8lQE-GjiH_lHTBvbLw7wADig1HMBKEVOvdi-iPb-icBvAq2sZEDKKurENsrYTCkVueU6IOhk8QZGx7vCSI2AezOEuOBU3v-o6dPjVAeUrhZtwO-dZhvahPVjUKpW7OgnHmXc479Wld67brP19WaMKh2iCbOL0mhqGKx1Vd4huEdmIGV3n9ZYwreps62puN15C90qHXwrUxN2jdQk1GKcAf4xG",
    imageAlt:
      "A cozy international student lounge with armchairs, a fireplace, and a large map on the wall.",
    note: "Best place for group projects. Usually quiet on Tuesday mornings before the lunch rush.",
    title: "Global Hub Lounge",
  },
  {
    category: "Quiet Zone",
    date: "May 15, 2026",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMe9Pud8m0v65EvVDFmJOiACt09V4vUAMkSYieDNdGrb985BOGyjY41U0UniaaHM3ga_8DjrtIXZCjEKjVWfvIungGXCoLLo2TOmyr1gaJqVBSur4h8a3XIYHFnFFpkwgk-2i-dTUwJkChrVejEAKmGFYQ0Wl9LqX_0tnsa6YXzsT6OiLkhb9iaG1cXRs_h37n60m1IBUDCzldUQPAo6cJ0_lYjpihK9XDO9p-l24p9PhYRjdlr4Nob4E_v53wqrwu6n5WJqZE5NA_",
    imageAlt:
      "A minimalist zen-inspired reflection space with soft light, a water feature, and comfortable floor cushions.",
    note: "Pure silence. Essential for meditation after a heavy exam week. Highly recommended.",
    title: "Reflection Corner",
  },
];

export function SavedPageClient() {
  const [items, setItems] = useState(savedItems);
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [item.category, item.note, item.title].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [items, query]);

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
                key={item.title}
                onRemove={() =>
                  setItems((currentItems) =>
                    currentItems.filter((currentItem) => currentItem.title !== item.title),
                  )
                }
              />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-[#1E293B] bg-[#161E2E] p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-[#22D3EE]">
              bookmark
            </span>
            <h2 className="mt-4 text-xl font-bold">No saved spaces found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Try a different search, or save a few more spaces from your dashboard.
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
}: {
  item: SavedItem;
  onRemove: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#1E293B] bg-[#161E2E] shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48">
        <Image
          alt={item.imageAlt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={item.image}
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-[#22D3EE]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#22D3EE] backdrop-blur-md">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
          <button
            aria-label={`Remove ${item.title} from saved pages`}
            className="p-1 text-slate-500 transition-colors hover:text-red-400"
            onClick={onRemove}
            type="button"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-400">Saved on {item.date}</p>
        <div className="mb-6 rounded-lg border border-white/5 bg-[#0B1120]/50 p-3">
          <p className="text-sm italic text-slate-300">&quot;{item.note}&quot;</p>
        </div>
        <Link
          className="block w-full rounded-xl bg-[#22D3EE] py-2.5 text-center text-sm font-bold text-[#0B1120] transition-opacity hover:opacity-90"
          href={spacePath()}
        >
          View Space
        </Link>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const chipGroups = [
  {
    label: "Interests",
    options: ["Study", "Social", "Collaborative"],
  },
  {
    label: "Current Mood",
    options: ["Focused", "Social", "Overwhelmed"],
  },
  {
    label: "Comfort Level",
    options: ["Private", "Casual", "Public"],
  },
  {
    label: "Amenities",
    options: ["Strong Wifi", "Power Outlets", "Coffee/Food Nearby"],
  },
  {
    className: "md:col-span-2",
    label: "Noise Tolerance",
    options: ["Pin-drop Silence", "Light Hum", "Lively/Noisy"],
  },
];

export function AddLocationForm() {
  const router = useRouter();
  const [activeChips, setActiveChips] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleChip(group: string, option: string) {
    const key = `${group}:${option}`;
    setActiveChips((currentChips) => {
      const nextChips = new Set(currentChips);
      if (nextChips.has(key)) {
        nextChips.delete(key);
      } else {
        nextChips.add(key);
      }
      return nextChips;
    });
  }

  async function submitLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const address = String(form.get("address") || "").trim();
    const description = String(form.get("description") || "").trim();
    const openingTime = String(form.get("opening_time") || "");
    const closingTime = String(form.get("closing_time") || "");
    const interests = selectedOptions(activeChips, "Interests");
    const moods = selectedOptions(activeChips, "Current Mood");
    const comfort = selectedOptions(activeChips, "Comfort Level")[0];
    const noise = selectedOptions(activeChips, "Noise Tolerance")[0];

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/spaces", {
        body: JSON.stringify({
          address,
          amenities: selectedOptions(activeChips, "Amenities").map(amenityValue),
          atmosphere_tags: [...interests, ...moods].map((value) => value.toLowerCase()),
          category: categoryValue(interests),
          description,
          name,
          noise_level: noiseValue(noise),
          opening_hours:
            openingTime && closingTime
              ? { daily: `${openingTime} - ${closingTime}` }
              : {},
          social_intensity: socialIntensityValue(comfort),
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        window.alert(data.error || "This location could not be created.");
        return;
      }
      window.alert("Location created successfully.");
      router.push("/admin");
      router.refresh();
    } catch {
      window.alert("Could not reach the backend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-slate-50 antialiased">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Add New Space
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure a new destination for the OnSite platform.
        </p>
      </div>

      <section className="flex justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#334155]/30 bg-[#161E2E] shadow-2xl">
          <div className="relative h-48 w-full">
            <Image
              alt="A sleek, high-tech modern co-working space with deep blue lighting, cyan accents, and minimalist ergonomic furniture."
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMGC5nV944Jpedb7D2s62_50lSm5zD_43isIcin2rN1WMavrfPEYmbeJIC99_-O2LLrS-F56Por3BXddu7YA2HorEIF1JVco9YvzelzM3YV230jrv45TWq-MGqRUaXWzbS2BP_UJIJHbwwa2qQfCvoDL1iIWvsJFFvEYntXqev_8tRggXa_Qm8ZPvP6r02E-D5Zz3MXD8g96k5xyKU8Gqfzzn8q_KExLojM1ZpPunIHSvFec1x3fN1G5MO0PhfvAViaoKwn05H09p9"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#161E2E] to-transparent" />
            <div className="absolute bottom-6 left-8 z-20">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Space Configuration
              </h2>
              <p className="text-sm text-slate-400">
                Define the environment and accessibility for your new destination.
              </p>
            </div>
          </div>

          <form className="space-y-10 p-8" onSubmit={submitLocation}>
            <section>
              <SectionHeader icon="info" title="Basic Information" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Space Name">
                  <input
                    className={inputClassName}
                    name="name"
                    placeholder="e.g., The Zenith Lounge"
                    required
                    type="text"
                  />
                </Field>
                <Field label="Location / Address">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      location_on
                    </span>
                    <input
                      className={`${inputClassName} pl-10`}
                      name="address"
                      placeholder="Enter full address"
                      required
                      type="text"
                    />
                  </div>
                </Field>
                <Field label="Opening Time">
                  <input className={inputClassName} name="opening_time" type="time" />
                </Field>
                <Field label="Closing Time">
                  <input className={inputClassName} name="closing_time" type="time" />
                </Field>
              </div>
            </section>

            <section>
              <SectionHeader icon="description" title="About the Space" />
              <textarea
                className={`${inputClassName} min-h-28 resize-none`}
                name="description"
                placeholder="Describe the ambiance, unique features, and the community vibe..."
                required
                rows={4}
              />
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#22D3EE]">tune</span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Space Profile
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                {chipGroups.map((group) => (
                  <div className={`space-y-3 ${group.className ?? ""}`} key={group.label}>
                    <label className="text-xs font-bold text-slate-300/60">
                      {group.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const key = `${group.label}:${option}`;
                        const active = activeChips.has(key);

                        return (
                          <button
                            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                              active
                                ? "border-[#22D3EE] bg-[#22D3EE] text-[#0B1120]"
                                : "border-[#334155]/50 bg-[#1E293B]/30 text-slate-100 hover:border-[#22D3EE]"
                            }`}
                            key={option}
                            onClick={() => toggleChip(group.label, option)}
                            type="button"
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#334155]/20 pt-8 md:flex-row">
              <p className="max-w-xs text-xs italic text-slate-400">
                * New spaces go through a 24h verification process before becoming
                public to the OnSite Platform expedition.
              </p>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-10 py-4 font-bold text-[#0B1120] shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95 md:w-auto"
                disabled={isSubmitting}
                type="submit"
              >
                <span className="material-symbols-outlined">add_circle</span>
                {isSubmitting ? "Adding Space..." : "Add Space"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function selectedOptions(chips: Set<string>, group: string) {
  const prefix = `${group}:`;
  return [...chips]
    .filter((chip) => chip.startsWith(prefix))
    .map((chip) => chip.slice(prefix.length));
}

function categoryValue(interests: string[]) {
  if (interests.includes("Study")) return "library";
  if (interests.includes("Collaborative")) return "coworking";
  if (interests.includes("Social")) return "cafe";
  return "community";
}

function socialIntensityValue(comfort?: string) {
  if (comfort === "Private") return 1;
  if (comfort === "Public") return 3;
  return 2;
}

function noiseValue(noise?: string) {
  if (noise === "Pin-drop Silence") return "silent";
  if (noise === "Lively/Noisy") return "lively";
  return "hum";
}

function amenityValue(amenity: string) {
  if (amenity === "Strong Wifi") return "wifi";
  if (amenity === "Power Outlets") return "outlets";
  return "food";
}

const inputClassName =
  "w-full rounded-xl border border-[#334155]/50 bg-[#1E293B] px-4 py-3 text-slate-50 outline-none transition-all placeholder:text-slate-500 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]";

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="material-symbols-outlined text-[#22D3EE]">{icon}</span>
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
        {title}
      </h3>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 block text-xs font-semibold text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

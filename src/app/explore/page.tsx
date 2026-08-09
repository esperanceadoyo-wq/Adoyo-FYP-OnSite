import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { catalogSpacePath } from "@/lib/space-flow";
import { getSpaceCatalog, type Space } from "@/lib/spaces";

export const metadata: Metadata = {
  title: "Explore Spaces | OnSite",
};

type SectionDefinition = {
  accentClassName: string;
  badge: string;
  badgeClassName: string;
  description: string;
  socialIntensity: number;
  tagClassName: string;
  title: string;
};

const sectionDefinitions: SectionDefinition[] = [
  {
    accentClassName: "bg-emerald-500",
    badge: "Private",
    badgeClassName: "bg-emerald-600 text-white",
    description: "Quiet spaces ideal for relaxing, recharging, or focused study.",
    socialIntensity: 1,
    tagClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    title: "Top Private",
  },
  {
    accentClassName: "bg-amber-500",
    badge: "Casual",
    badgeClassName: "bg-amber-600 text-white",
    description:
      "Comfortable spaces that balance productivity and light social interaction.",
    socialIntensity: 2,
    tagClassName: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    title: "Top Casual",
  },
  {
    accentClassName: "bg-blue-500",
    badge: "Public",
    badgeClassName: "bg-blue-600 text-white",
    description:
      "Lively spaces perfect for meeting people, collaborating, and community engagement.",
    socialIntensity: 3,
    tagClassName: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    title: "Top Public",
  },
];

export default async function ExplorePage() {
  const user = await requireAuth("/explore");
  const [{ progress }, catalog] = await Promise.all([
    getDashboardData(),
    getSpaceCatalog(),
  ]);

  return (
    <AppChrome activeHref="/explore" progress={progress} user={user}>
      <div className="relative overflow-hidden text-slate-50">
        <div className="absolute -right-32 -top-64 -z-0 h-[500px] w-[500px] rounded-full bg-[#2ab8cb] opacity-15 blur-[100px]" />
        <div className="absolute -left-48 top-1/2 -z-0 h-[400px] w-[400px] rounded-full bg-[#f97316] opacity-10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 -z-0 h-[600px] w-[600px] rounded-full bg-[#2ab8cb] opacity-5 blur-[100px]" />

        <header className="relative z-10 mx-auto max-w-4xl pb-16 pt-6 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            OnSite Explore
          </h1>
          <p className="text-lg font-light text-slate-400 md:text-xl">
            Discover third spaces that match your comfort level, mood, and interests.
          </p>
        </header>

        <div className="relative z-10 flex-grow pb-24">
          {catalog.error ? (
            <CatalogState
              description={catalog.error}
              icon="cloud_off"
              title="Could not load spaces"
            />
          ) : catalog.spaces.length === 0 ? (
            <CatalogState
              description="New destinations will appear here once they are available."
              icon="travel_explore"
              title="No spaces available"
            />
          ) : (
            sectionDefinitions.map((section, index) => {
              const spaces = catalog.spaces.filter(
                (space) => space.social_intensity === section.socialIntensity,
              );

              if (spaces.length === 0) return null;

              return (
                <div key={section.title}>
                  <ExploreSection section={section} spaces={spaces} />
                  {index === 0 ? <InspirationPanel /> : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppChrome>
  );
}

function ExploreSection({
  section,
  spaces,
}: {
  section: SectionDefinition;
  spaces: Space[];
}) {
  return (
    <section className="mb-20">
      <div className="mx-auto mb-8 flex max-w-7xl flex-col justify-between gap-2 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${section.accentClassName}`} />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              {section.title}
            </h2>
          </div>
          <p className="text-sm text-slate-400">{section.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {spaces.map((space) => (
          <ExploreCard key={space.id} section={section} space={space} />
        ))}
      </div>
    </section>
  );
}

function ExploreCard({
  section,
  space,
}: {
  section: SectionDefinition;
  space: Space;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-[#161E2E] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full bg-slate-800">
        {space.image_url ? (
          <Image
            alt={space.image_alt || space.name}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={space.image_url}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            <span className="material-symbols-outlined text-5xl">image_not_supported</span>
          </div>
        )}
        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${section.badgeClassName}`}
        >
          {section.badge}
        </div>
        {space.rating !== null ? (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-md">
            <span
              className="material-symbols-outlined text-sm text-yellow-400"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            {space.rating.toFixed(1)}
          </div>
        ) : null}
      </div>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="mb-1.5 text-xl font-bold text-white">{space.name}</h3>
        <p className="mb-3 text-xs text-slate-400">
          {formatHours(space.opening_hours)} - {formatLabel(space.category)}
        </p>
        <p className="mb-4 line-clamp-2 text-sm italic leading-relaxed text-slate-300">
          &quot;{space.description}&quot;
        </p>
        <div className="mb-5 flex flex-wrap gap-2">
          {space.atmosphere_tags.slice(0, 3).map((tag) => (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-medium ${section.tagClassName}`}
              key={tag}
            >
              {formatLabel(tag)}
            </span>
          ))}
        </div>
        <div className="mb-6 flex min-h-12 items-start gap-6 border-t border-slate-700/50 pt-5">
          {space.amenities.slice(0, 3).map((amenity) => (
            <div className="flex min-w-0 flex-col items-center" key={amenity}>
              <span className="material-symbols-outlined text-xl text-slate-400">
                {amenityIcon(amenity)}
              </span>
              <span className="mt-0.5 max-w-20 text-center text-[10px] text-slate-500">
                {formatLabel(amenity)}
              </span>
            </div>
          ))}
        </div>
        <Link
          className="mt-auto block w-full rounded-lg bg-[#22D3EE] py-3 text-center text-sm font-bold text-[#0B1120] transition-all hover:bg-[#06B6D4] active:scale-95"
          href={catalogSpacePath(space.slug)}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function CatalogState({
  description,
  icon,
  title,
}: {
  description: string;
  icon: string;
  title: string;
}) {
  return (
    <section className="mx-auto max-w-xl rounded-xl border border-slate-700/50 bg-[#161E2E] px-6 py-12 text-center">
      <span className="material-symbols-outlined text-5xl text-[#22D3EE]">{icon}</span>
      <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </section>
  );
}

function InspirationPanel() {
  return (
    <section className="mb-20">
      <div className="relative mx-auto h-[320px] max-w-7xl overflow-hidden rounded-3xl">
        <Image
          alt="A calm campus discovery scene with warm light and architectural greenery."
          className="object-cover opacity-40 mix-blend-luminosity transition-all duration-1000 hover:opacity-60"
          fill
          sizes="100vw"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd8HCZJivh8yF3n1kEna947SK8lA8bIOxeHqja5WifP9IToDLx9QjZxi__Fe910ID7lYW9j5G6yZURx07aXcNyZeo9QCeD65eWOreEk-EQrEGVVtkZZrS0e-e45qJ_q9ENJjWdJXSwH6C3ILmP-4dLBCmvdIFeFLP1Arsi_es1vcuKl9Qcwdz9skIyabZk7Tc95PHTQle4pr-D4Wcv-1a3BkEeWL1JJ8XngvAIqw4DlNVfci8qn3KbaOeOyYjdoRiC_H6VaU5nI96D"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0B1120]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <div className="mb-8 h-1 w-12 rounded-full bg-[#22D3EE]" />
          <h3 className="theme-keep-white mb-4 max-w-2xl text-2xl font-light italic leading-snug tracking-tight text-white md:text-4xl">
            &quot;Every new place is an opportunity to learn, connect, and grow.&quot;
          </h3>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/80">
            Ambient Discovery
          </p>
        </div>
      </div>
    </section>
  );
}

function formatHours(openingHours: Record<string, string>) {
  const hours = openingHours.daily || openingHours.weekdays || Object.values(openingHours)[0];
  return hours ? hours.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, "$1 - $2") : "Hours vary";
}

function formatLabel(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function amenityIcon(amenity: string) {
  const normalized = amenity.toLowerCase();
  if (normalized.includes("wifi") || normalized.includes("coverage")) return "wifi";
  if (normalized.includes("outlet")) return "bolt";
  if (normalized.includes("coffee")) return "local_cafe";
  if (normalized.includes("food")) return "restaurant";
  if (normalized.includes("green") || normalized.includes("walk")) return "nature_people";
  if (normalized.includes("event")) return "campaign";
  if (normalized.includes("table") || normalized.includes("seating")) return "chair";
  return "check_circle";
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { featuredSpace, spacePath } from "@/lib/space-flow";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: `${featuredSpace.name} | OnSite`,
};

export default async function SpaceDetailsPage() {
  await requireAuth(spacePath());

  return (
    <main className="min-h-screen bg-[#0F172A] text-on-surface">
      <FlowHeader />
      <div className="mx-auto max-w-6xl p-8 pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-10 lg:col-span-3">
            <section className="space-y-8">
              <div className="group relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-surface-container-high shadow-2xl">
                <Image
                  alt={featuredSpace.name}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                  src={featuredSpace.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 pr-8">
                  <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl">
                    {featuredSpace.name}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-on-surface">
                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    <span>{featuredSpace.address}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    <span>Open until 10:00 PM</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button className="flex items-center gap-2 rounded-xl border border-primary px-8 py-3 font-bold text-primary transition-all hover:bg-primary/10">
                    <span className="material-symbols-outlined">bookmark</span>
                    Save
                  </button>
                  <Link
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary transition-all hover:opacity-90"
                    href={spacePath("/location")}
                  >
                    <span className="material-symbols-outlined">login</span>
                    Visit Space
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-on-surface">
                About this space
                <span className="h-px flex-grow bg-outline/30" />
              </h2>
              <div className="rounded-2xl border border-outline/20 bg-[#1E293B] p-8">
                <p className="text-lg leading-relaxed text-on-surface-variant">
                  {featuredSpace.description}
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="mb-8 text-2xl font-bold text-on-surface">
                Space Details
              </h2>
              <div className="space-y-8 rounded-3xl border border-outline/10 bg-[#1E293B] p-8">
                <PillGroup
                  accent="primary"
                  items={[
                    { icon: "menu_book", label: "Study" },
                    { icon: "groups", label: "Collaborative" },
                  ]}
                  label="Interests & Purpose"
                />
                <PillGroup
                  accent="tertiary"
                  items={[
                    { icon: "psychology", label: "Focused" },
                    { icon: "self_improvement", label: "Overwhelmed" },
                  ]}
                  label="Best When You Feel"
                />

                <div className="grid grid-cols-2 gap-4">
                  <SpecCard label="Comfort Level" value="Private" />
                  <SpecCard label="Noise Tolerance" value="Pin Drop Silence" />
                </div>

                <PillGroup
                  accent="neutral"
                  items={[
                    { icon: "wifi", label: "Strong WiFi" },
                    { icon: "power", label: "Power Outlets" },
                  ]}
                  label="Amenities"
                />
              </div>
            </section>

            <section>
              <div className="space-y-6 rounded-3xl border border-outline/20 bg-[#1E293B] p-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
                  Community Highlights
                </h3>
                <div className="space-y-4">
                  <HighlightRow
                    label="Student-Rated"
                    value={
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg text-primary">
                          star
                        </span>
                        4.8/5
                      </span>
                    }
                  />
                  <HighlightRow
                    label="Most Popular Times"
                    value="2 PM - 5 PM"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function PillGroup({
  accent,
  items,
  label,
}: {
  accent: "neutral" | "primary" | "tertiary";
  items: Array<{ icon: string; label: string }>;
  label: string;
}) {
  const headingClassName =
    accent === "tertiary"
      ? "text-tertiary/70"
      : accent === "primary"
        ? "text-primary/70"
        : "text-on-surface-variant/60";

  return (
    <div>
      <h3
        className={`mb-4 text-[11px] font-bold uppercase tracking-[0.2em] ${headingClassName}`}
      >
        {label}
      </h3>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <Pill accent={accent} icon={item.icon} key={item.label}>
            {item.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Pill({
  accent,
  children,
  icon,
}: {
  accent: "neutral" | "primary" | "tertiary";
  children: React.ReactNode;
  icon: string;
}) {
  const className =
    accent === "primary"
      ? "border-primary/20 bg-primary-container text-on-primary-container"
      : accent === "tertiary"
        ? "border-tertiary/20 bg-tertiary-container text-on-tertiary-container"
        : "border-transparent bg-[#0B1120] text-white";
  const shapeClassName =
    accent === "neutral"
      ? "rounded-[1.125rem] px-7 py-3 text-sm"
      : "rounded-xl px-5 py-2 text-sm";
  const iconClassName =
    accent === "neutral"
      ? "text-[28px] text-primary"
      : "text-[20px]";

  return (
    <span
      className={`flex min-h-[50px] items-center gap-3 border font-semibold leading-none ${shapeClassName} ${className}`}
    >
      <span className={`material-symbols-outlined ${iconClassName}`}>{icon}</span>
      {children}
    </span>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-outline/20 bg-surface-container p-5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </span>
      <span className="text-base font-bold text-on-surface">{value}</span>
    </div>
  );
}

function HighlightRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-bold text-on-surface">{value}</span>
    </div>
  );
}

function FlowHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-outline/20 bg-surface/80 px-8 backdrop-blur-md">
      <Link
        className="flex items-center gap-2 font-medium text-on-surface transition-colors hover:text-primary"
        href="/dashboard"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Home
      </Link>
    </header>
  );
}

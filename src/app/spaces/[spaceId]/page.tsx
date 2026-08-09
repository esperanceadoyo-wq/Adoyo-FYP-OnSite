import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SaveSpaceButton } from "@/components/SaveSpaceButton";
import { requireAuth } from "@/lib/server-auth";
import { requireSpace } from "@/lib/server-spaces";
import { getSavedSpaces } from "@/lib/saved-spaces";
import { catalogSpacePath } from "@/lib/space-flow";
import { getSpaceDetails, type Space } from "@/lib/spaces";

type SpaceRouteProps = { params: Promise<{ spaceId: string }> };

export async function generateMetadata({
  params,
}: SpaceRouteProps): Promise<Metadata> {
  const { spaceId } = await params;
  const result = await getSpaceDetails(spaceId);
  return {
    title: result.status === "ok" ? result.space.name : "Space",
  };
}

export default async function SpaceDetailsPage({ params }: SpaceRouteProps) {
  const { spaceId } = await params;
  await requireAuth(catalogSpacePath(spaceId));
  const space = await requireSpace(spaceId);
  const { savedSpaces } = await getSavedSpaces();
  const initialSaved = savedSpaces.some((saved) => saved.space_id === space.id);

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <FlowHeader />
      <div className="mx-auto max-w-6xl p-8 pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-10 lg:col-span-3">
            <section className="space-y-8">
              <div className="group relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-surface-container-high shadow-2xl">
                {space.image_url ? (
                  <Image
                    alt={space.image_alt || space.name}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 680px"
                    src={space.image_url}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-6xl">
                      image_not_supported
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 pr-8">
                  <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl">
                    {space.name}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-on-surface">
                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    <span>{space.address}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    <span>{formatHours(space.opening_hours)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <SaveSpaceButton
                    initialSaved={initialSaved}
                    spaceId={space.id}
                  />
                  <Link
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary transition-all hover:opacity-90"
                    href={catalogSpacePath(space.slug, "/location")}
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
              <div className="rounded-2xl border border-outline/20 bg-surface-container-low p-8">
                <p className="text-lg leading-relaxed text-on-surface-variant">
                  {space.description}
                </p>
              </div>
              {space.cultural_notes || space.safety_notes ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {space.cultural_notes ? (
                    <GuidanceCard
                      icon="diversity_3"
                      label="Cultural guidance"
                      value={space.cultural_notes}
                    />
                  ) : null}
                  {space.safety_notes ? (
                    <GuidanceCard
                      icon="health_and_safety"
                      label="Safety notes"
                      value={space.safety_notes}
                    />
                  ) : null}
                </div>
              ) : null}
            </section>
          </div>

          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="mb-8 text-2xl font-bold text-on-surface">
                Space Details
              </h2>
              <div className="space-y-8 rounded-3xl border border-outline/10 bg-surface-container-low p-8">
                <PillGroup
                  accent="primary"
                  items={[
                    ...space.atmosphere_tags.slice(0, 3).map((tag) => ({
                      icon: atmosphereIcon(tag),
                      label: formatLabel(tag),
                    })),
                  ]}
                  label="Interests & Purpose"
                />
                <PillGroup
                  accent="tertiary"
                  items={bestMoodItems(space)}
                  label="Best When You Feel"
                />

                <div className="grid grid-cols-2 gap-4">
                  <SpecCard
                    label="Comfort Level"
                    value={comfortLabel(space.social_intensity)}
                  />
                  <SpecCard
                    label="Noise Tolerance"
                    value={formatLabel(space.noise_level)}
                  />
                </div>

                <PillGroup
                  accent="neutral"
                  items={space.amenities.map((amenity) => ({
                    icon: amenityIcon(amenity),
                    label: formatLabel(amenity),
                  }))}
                  label="Amenities"
                />
              </div>
            </section>

            <section>
              <div className="space-y-6 rounded-3xl border border-outline/20 bg-surface-container-low p-8">
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
                        {space.rating !== null ? `${space.rating.toFixed(1)}/5` : "New"}
                      </span>
                    }
                  />
                  <HighlightRow
                    label="Space Type"
                    value={formatLabel(space.category)}
                  />
                  <HighlightRow
                    label="Cost Level"
                    value={costLabel(space.cost_level)}
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

function GuidanceCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-outline/20 bg-surface-container-low p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
        <span className="material-symbols-outlined text-xl">{icon}</span>
        {label}
      </div>
      <p className="text-sm leading-relaxed text-on-surface-variant">{value}</p>
    </article>
  );
}

function formatHours(openingHours: Record<string, string>) {
  const hours =
    openingHours.daily ??
    openingHours.weekdays ??
    Object.values(openingHours)[0];

  if (!hours) return "Hours vary";

  return hours.replace(
    /(\d{2}):(\d{2})-(\d{2}):(\d{2})/,
    (_match, startHour, startMinute, endHour, endMinute) =>
      `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`,
  );
}

function formatTime(hour: string, minute: string) {
  const numericHour = Number(hour);
  const displayHour = numericHour % 12 || 12;
  return `${displayHour}:${minute} ${numericHour >= 12 ? "PM" : "AM"}`;
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function comfortLabel(intensity: number) {
  if (intensity <= 1) return "Private";
  if (intensity === 2) return "Casual";
  return "Public";
}

function costLabel(level: number) {
  if (level <= 0) return "Free";
  if (level === 1) return "Low Cost";
  if (level === 2) return "Moderate";
  return "Premium";
}

function atmosphereIcon(tag: string) {
  const normalizedTag = tag.toLowerCase();
  if (/study|read|focus|academic/.test(normalizedTag)) return "menu_book";
  if (/social|community|collaborat/.test(normalizedTag)) return "groups";
  if (/nature|calm|outdoor/.test(normalizedTag)) return "nature_people";
  if (/event|creative|culture/.test(normalizedTag)) return "celebration";
  return "interests";
}

function amenityIcon(amenity: string) {
  const normalizedAmenity = amenity.toLowerCase();
  if (/wi-?fi|internet/.test(normalizedAmenity)) return "wifi";
  if (/power|outlet|charging/.test(normalizedAmenity)) return "power";
  if (/parking/.test(normalizedAmenity)) return "local_parking";
  if (/food|cafe|coffee/.test(normalizedAmenity)) return "local_cafe";
  if (/air|cool/.test(normalizedAmenity)) return "ac_unit";
  if (/accessible|wheelchair/.test(normalizedAmenity)) return "accessible";
  return "check_circle";
}

function bestMoodItems(space: Space) {
  if (space.social_intensity <= 1) {
    return [
      { icon: "psychology", label: "Focused" },
      { icon: "self_improvement", label: "Overwhelmed" },
    ];
  }

  if (space.social_intensity === 2) {
    return [
      { icon: "psychology", label: "Focused" },
      { icon: "sentiment_satisfied", label: "Social" },
    ];
  }

  return [
    { icon: "sentiment_satisfied", label: "Social" },
    { icon: "bolt", label: "Energized" },
  ];
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
        : "border-transparent bg-surface-container-high text-on-surface";
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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  DashboardAuthPanel,
  DashboardGreeting,
  LogoutButton,
} from "@/components/DashboardAuth";
import { NearbyRecommendations } from "@/components/NearbyRecommendations";
import {
  getDashboardData,
  type UserProfile,
  type UserProgress,
} from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { getInitials, type AuthUser } from "@/lib/auth";
import type { SpaceRecommendation } from "@/lib/recommendations";
import { catalogSpacePath } from "@/lib/space-flow";
import type { Space } from "@/lib/spaces";

export const metadata: Metadata = {
  title: "Azure Horizon | OnSite Community Hub",
};

type IconName =
  | "admin"
  | "arrowRight"
  | "book"
  | "bookmark"
  | "coffee"
  | "compass"
  | "fire"
  | "gauge"
  | "home"
  | "leaderboard"
  | "lock"
  | "logout"
  | "mapPin"
  | "medal"
  | "notification"
  | "park"
  | "person"
  | "public"
  | "settings"
  | "spark"
  | "star"
  | "target"
  | "tune"
  | "users";

const navItems = [
  { label: "Home", icon: "home", href: "/dashboard", active: true },
  { label: "Saved", icon: "bookmark", href: "/saved" },
  { label: "Profile", icon: "person", href: "/profile" },
  { label: "Explore", icon: "compass", href: "/explore" },
  { label: "Leaderboard", icon: "leaderboard", href: "/leaderboard" },
  { label: "Admin", icon: "admin", href: "/admin" },
] satisfies Array<{ label: string; icon: IconName; href: string; active?: boolean }>;

const utilityNavItems = [
  { label: "Notifications", icon: "notification", href: "/notifications" },
  { label: "Settings", icon: "settings", href: "/settings" },
  { label: "Log Out", icon: "logout", danger: true },
] satisfies Array<{ label: string; icon: IconName; danger?: boolean; href?: string }>;

type StatChip = {
  icon: IconName;
  label: string;
  value: string;
  className: string;
  iconClassName: string;
  valueClassName: string;
};

export default async function DashboardPage() {
  const user = await requireAuth("/dashboard");
  const { profile, progress, recommendationError, recommendations } =
    await getDashboardData();

  return (
    <main className="min-h-screen bg-background pb-24 text-on-background md:pb-8">
      <DesktopSidebar />
      <section className="md:ml-64">
        <DashboardHeader progress={progress} user={user} />
        <div className="mx-auto mt-4 max-w-7xl space-y-8 px-6">
          <IntroSection profile={profile} progress={progress} user={user} />
          <NearbyRecommendations mood={profile?.current_mood ?? null} />
          <RecommendationSection
            error={recommendationError}
            recommendations={recommendations}
          />
          {recommendations.length > 3 ? (
            <CompactRecommendationSection recommendations={recommendations.slice(3, 6)} />
          ) : null}
          {recommendations.length > 6 ? (
            <DiscoverySection recommendations={recommendations.slice(6, 8)} />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function DesktopSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest md:flex">
      <div className="flex flex-col gap-1 p-6">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-on-surface">
          <Icon className="h-6 w-6 text-primary" name="mapPin" />
          ONSITE
        </h1>
        <p className="text-[10px] font-medium leading-tight text-on-surface-variant">
          WHERE COMFORT MEETS CONNECTION
        </p>
      </div>
      <nav className="custom-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => (
          <a
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 active:scale-95 ${
              item.active
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
            href={item.href}
            key={item.label}
          >
            <Icon
              className={`h-5 w-5 ${item.active ? "text-primary" : ""}`}
              name={item.icon}
            />
            <span className={item.active ? "font-bold" : "font-medium"}>
              {item.label}
            </span>
          </a>
        ))}
        <div className="px-4 pb-2 pt-4">
          <hr className="border-outline-variant" />
        </div>
        {utilityNavItems.map((item) => (
          item.danger ? (
            <LogoutButton
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-error transition-all duration-200 hover:bg-error-container/20 active:scale-95 disabled:opacity-60"
              key={item.label}
            >
              <Icon className="h-5 w-5" name={item.icon} />
              <span className="font-medium">{item.label}</span>
            </LogoutButton>
          ) : (
            <a
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low active:scale-95"
              href={item.href}
              key={item.label}
            >
              <Icon className="h-5 w-5" name={item.icon} />
              <span className="font-medium">{item.label}</span>
            </a>
          )
        ))}
      </nav>
    </aside>
  );
}

function DashboardHeader({
  progress,
  user,
}: {
  progress: UserProgress | null;
  user: AuthUser;
}) {
  const statChips = dashboardStatChips(progress);

  return (
    <header className="sticky top-0 z-40 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-outline-variant bg-background/90 px-6 py-4 backdrop-blur-md md:border-none">
      <div className="flex flex-wrap items-center gap-4">
        {statChips.map((chip) => (
          <div
            className={`flex items-center gap-3 rounded-full px-4 py-2 shadow-sm ${chip.className}`}
            key={chip.label}
          >
            <Icon className={`h-4 w-4 ${chip.iconClassName}`} name={chip.icon} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase leading-none text-on-secondary-fixed-variant">
                {chip.label}
              </span>
              <span className={`text-xs font-bold ${chip.valueClassName}`}>
                {chip.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-3">
        <a
          className="flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-xs font-bold text-on-primary-container shadow-sm transition-all hover:bg-primary-container/80 active:scale-95"
          href="/onboarding"
        >
          <Icon className="h-4 w-4" name="tune" />
          <span className="hidden sm:inline">Adjust Preferences</span>
          <span className="sm:hidden">Adjust</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant transition-colors hover:text-primary"
            href="/notifications"
          >
            <Icon className="h-5 w-5" name="notification" />
          </a>
          <button className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary transition-transform active:scale-95">
            <span className="flex h-full w-full items-center justify-center bg-surface-variant text-on-surface-variant">
              <span className="text-xs font-extrabold">{getInitials(user.name)}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function IntroSection({
  profile,
  progress,
  user,
}: {
  profile: UserProfile | null;
  progress: UserProgress | null;
  user: AuthUser;
}) {
  return (
    <section className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
          <DashboardGreeting user={user} />
        </h2>
        <p className="max-w-2xl text-lg text-on-surface-variant">
          {profileSummary(profile)}
        </p>
        <PreferenceRow profile={profile} />
      </div>
      <DashboardAuthPanel progress={progress} user={user} />
    </section>
  );
}

function PreferenceRow({ profile }: { profile: UserProfile | null }) {
  const preferences = [
    profile?.current_mood ? `Mood: ${formatLabel(profile.current_mood)}` : null,
    profile?.comfort_level
      ? `Comfort: ${formatLabel(profile.comfort_level)}`
      : null,
    profile?.noise_tolerance
      ? `Noise: ${formatLabel(profile.noise_tolerance)}`
      : null,
    profile?.preferred_amenities.length
      ? `Amenities: ${profile.preferred_amenities.map(formatLabel).join(", ")}`
      : null,
  ].filter(Boolean);

  if (preferences.length === 0) {
    return (
      <a
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container transition-colors hover:bg-primary-container/80"
        href="/onboarding"
      >
        <Icon className="h-4 w-4" name="tune" />
        Complete your preferences
      </a>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {preferences.map((preference) => (
        <span
          className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-xs font-bold text-on-surface-variant"
          key={preference}
        >
          {preference}
        </span>
      ))}
    </div>
  );
}

function dashboardStatChips(progress: UserProgress | null): StatChip[] {
  const visits = progress?.visits ?? 0;
  const reflections = progress?.reflections ?? 0;
  const level = progress?.level ?? 1;
  const badges = progress?.achievements.length ?? 0;
  const xp = progress?.xp ?? 0;

  return [
    {
      icon: "gauge",
      label: "Weekly Goal",
      value: `${Math.min(visits, 5)}/5 visits`,
      className: "bg-surface-container-lowest border border-outline-variant",
      iconClassName: "text-primary",
      valueClassName: "text-on-surface",
    },
    {
      icon: "star",
      label: `Level ${level}`,
      value: levelName(level),
      className: "bg-primary-container border border-primary/20",
      iconClassName: "text-primary",
      valueClassName: "text-on-primary-container",
    },
    {
      icon: "fire",
      label: `${reflections} Reflections`,
      value: reflections === 0 ? "First reflection pending" : "Keep learning",
      className: "bg-tertiary-container/30 border border-tertiary/20",
      iconClassName: "text-tertiary",
      valueClassName: "text-tertiary",
    },
    {
      icon: "medal",
      label: `${badges} ${badges === 1 ? "Badge" : "Badges"}`,
      value: `${xp} XP earned`,
      className: "bg-secondary-container/50",
      iconClassName: "text-secondary",
      valueClassName: "text-on-surface",
    },
  ];
}

function profileSummary(profile: UserProfile | null) {
  if (!profile?.current_mood && !profile?.comfort_level) {
    return "Welcome to OnSite. Complete onboarding to personalize your recommendations and dashboard.";
  }

  const mood = profile.current_mood
    ? `${formatLabel(profile.current_mood)} mode`
    : "your current mode";
  const comfort = profile.comfort_level
    ? formatLabel(profile.comfort_level)
    : "comfortable";
  const interests = profile.interests.length
    ? profile.interests.map(formatLabel).join(", ")
    : "study";

  return `Welcome back. Your dashboard is tuned for ${mood}, ${comfort.toLowerCase()} spaces, and ${interests.toLowerCase()} goals.`;
}

function levelName(level: number) {
  if (level >= 5) return "Community Guide";
  if (level >= 3) return "Space Regular";
  if (level >= 2) return "Focus Finder";
  return "New Explorer";
}

function formatLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function RecommendationSection({
  error,
  recommendations,
}: {
  error: string | null;
  recommendations: SpaceRecommendation[];
}) {
  return (
    <section className="space-y-6">
      <SectionTitle icon="spark">Top Recommendations</SectionTitle>
      {error ? (
        <RecommendationState
          icon="lock"
          message={error}
          title="Recommendations unavailable"
        />
      ) : recommendations.length === 0 ? (
        <RecommendationState
          icon="compass"
          message="There are no active spaces to recommend right now."
          title="No recommendations yet"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {recommendations.slice(0, 3).map((recommendation) => (
            <RecommendationCard
              key={recommendation.space.id}
              recommendation={recommendation}
            />
          ))}
          <TopSpacesPanel recommendations={recommendations.slice(0, 3)} />
        </div>
      )}
    </section>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: SpaceRecommendation;
}) {
  const { reason, score, space } = recommendation;
  const tags = recommendationTags(space);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <SpaceImage
          className="transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          space={space}
        />
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-surface-container-lowest/80 px-2 py-1 text-xs font-bold text-on-surface backdrop-blur">
          <Icon className="h-4 w-4 text-primary" name="target" />
          {formatScore(score)} match
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="text-lg font-extrabold text-on-surface">{space.name}</h4>
          <span className="text-[10px] font-bold text-on-surface-variant">
            {space.rating !== null ? `${space.rating.toFixed(1)}/5` : "New"}
          </span>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">
          {space.description}
        </p>
        <div className="custom-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <span
              className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${tag.className}`}
              key={tag.label}
            >
              <Icon className="h-4 w-4" name={tag.icon} />
              {tag.label}
            </span>
          ))}
        </div>
        <p className="mb-5 text-xs font-medium leading-relaxed text-primary">
          {reason}
        </p>
        <Link
          className="mt-auto block w-full rounded-xl bg-primary py-3 text-center font-bold text-on-primary transition-all hover:bg-primary/90 active:scale-95"
          href={catalogSpacePath(space.slug)}
        >
          View Space
        </Link>
      </div>
    </article>
  );
}

function TopSpacesPanel({
  recommendations,
}: {
  recommendations: SpaceRecommendation[];
}) {
  return (
    <aside className="hidden flex-col gap-4 xl:flex">
      <div className="flex h-full flex-col rounded-[2rem] border border-outline-variant bg-surface-container-low p-6">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-primary">
          <Icon className="h-4 w-4" name="star" />
          Top Spaces
        </h4>
        <div className="space-y-4">
          {recommendations.map(({ reason, score, space }) => (
            <Link
              className="flex flex-col gap-1"
              href={catalogSpacePath(space.slug)}
              key={space.id}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest text-primary shadow-sm">
                  <Icon className="h-5 w-5" name={categoryIcon(space.category)} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-on-surface">
                    {space.name}
                  </h5>
                  <p className="text-[10px] font-bold uppercase text-primary">
                    {formatScore(score)} match
                  </p>
                </div>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-on-surface-variant">
                {reason}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-3">
          <p className="text-[10px] font-medium leading-tight text-on-surface-variant">
            <span className="font-bold text-on-surface">Pro Tip:</span> Filter
            by your favorite amenities to find the perfect spot for your next
            session.
          </p>
        </div>
      </div>
    </aside>
  );
}

function CompactRecommendationSection({
  recommendations,
}: {
  recommendations: SpaceRecommendation[];
}) {
  return (
    <section className="space-y-6">
      <SectionTitle icon="spark">How About These?</SectionTitle>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((recommendation) => (
          <CompactRecommendationCard
            key={recommendation.space.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
}

function CompactRecommendationCard({
  recommendation,
}: {
  recommendation: SpaceRecommendation;
}) {
  const { reason, score, space } = recommendation;

  return (
    <article className="group flex h-40 items-center overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low p-3 shadow-sm">
      <div className="relative h-full w-32 shrink-0 overflow-hidden rounded-2xl">
        <SpaceImage sizes="128px" space={space} />
      </div>
      <div className="flex h-full w-full flex-col justify-between px-4 py-2">
        <div>
          <h4 className="font-extrabold text-on-surface">{space.name}</h4>
          <p className="line-clamp-2 text-xs text-on-surface-variant">
            {reason}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className="rounded-lg bg-primary-container px-2 py-1 text-[10px] font-bold uppercase text-on-primary-container"
          >
            {formatScore(score)} match
          </span>
          <Link
            className="flex items-center gap-1 text-xs font-extrabold text-primary transition-transform group-hover:translate-x-1"
            href={catalogSpacePath(space.slug)}
          >
            View Space
            <Icon className="h-3 w-3" name="arrowRight" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function DiscoverySection({
  recommendations,
}: {
  recommendations: SpaceRecommendation[];
}) {
  return (
    <section className="space-y-6 pb-12">
      <SectionTitle icon="fire" iconClassName="text-tertiary">
        Why Don&apos;t You Try These Next?
      </SectionTitle>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendations.map((recommendation) => (
          <DiscoveryCard
            key={recommendation.space.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
}

function DiscoveryCard({
  recommendation,
}: {
  recommendation: SpaceRecommendation;
}) {
  const { reason, score, space } = recommendation;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-sm md:flex-row">
      <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-56">
        <SpaceImage sizes="224px" space={space} />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h4 className="text-xl font-extrabold text-on-surface">{space.name}</h4>
            <span className="rounded bg-tertiary/20 px-2 py-1 text-[10px] font-bold uppercase text-tertiary">
              {formatScore(score)} match
            </span>
          </div>
          <p className="mb-4 text-sm text-on-surface-variant">{reason}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
            <Icon className="h-4 w-4" name={categoryIcon(space.category)} />
            {formatLabel(space.category)}
          </span>
          <Link
            className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-on-primary shadow-sm transition-transform hover:bg-primary/90 active:scale-95"
            href={catalogSpacePath(space.slug)}
          >
            View Space
          </Link>
        </div>
      </div>
    </article>
  );
}

function RecommendationState({
  icon,
  message,
  title,
}: {
  icon: IconName;
  message: string;
  title: string;
}) {
  return (
    <div className="flex min-h-44 items-center gap-4 rounded-[2rem] border border-outline-variant bg-surface-container-low p-8">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-primary">
        <Icon className="h-6 w-6" name={icon} />
      </div>
      <div>
        <h4 className="font-extrabold text-on-surface">{title}</h4>
        <p className="mt-1 text-sm text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
}

function SpaceImage({
  className = "",
  sizes,
  space,
}: {
  className?: string;
  sizes: string;
  space: Space;
}) {
  if (!space.image_url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-container-highest text-on-surface-variant">
        <Icon className="h-8 w-8" name={categoryIcon(space.category)} />
      </div>
    );
  }

  return (
    <Image
      alt={space.image_alt || space.name}
      className={`object-cover ${className}`}
      fill
      sizes={sizes}
      src={space.image_url}
    />
  );
}

function recommendationTags(space: Space) {
  const styles = [
    "bg-primary-container text-on-primary-container",
    "bg-tertiary-container text-on-tertiary-container",
    "bg-secondary-container text-on-secondary-container",
  ];

  return space.atmosphere_tags.slice(0, 3).map((tag, index) => ({
    className: styles[index],
    icon: tagIcon(tag),
    label: formatLabel(tag),
  }));
}

function tagIcon(tag: string): IconName {
  const normalizedTag = tag.toLowerCase();
  if (/study|read|focus|academic/.test(normalizedTag)) return "book";
  if (/social|community|collaborat/.test(normalizedTag)) return "users";
  if (/nature|calm|outdoor|reflection/.test(normalizedTag)) return "park";
  return "target";
}

function categoryIcon(category: string): IconName {
  const normalizedCategory = category.toLowerCase();
  if (/library|bookstore/.test(normalizedCategory)) return "book";
  if (/cafe|coffee/.test(normalizedCategory)) return "coffee";
  if (/park|courtyard/.test(normalizedCategory)) return "park";
  if (/event/.test(normalizedCategory)) return "users";
  return "public";
}

function formatScore(score: number) {
  return `${Math.round(score)}%`;
}

function SectionTitle({
  children,
  icon,
  iconClassName = "text-primary",
}: {
  children: ReactNode;
  icon: IconName;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-2xl font-bold text-on-surface">
        <Icon className={`h-6 w-6 ${iconClassName}`} name={icon} />
        {children}
      </h3>
    </div>
  );
}

function Icon({ className, name }: { className?: string; name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {iconPaths[name]}
    </svg>
  );
}

const iconPaths: Record<IconName, ReactNode> = {
  admin: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </>
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  coffee: (
    <>
      <path d="M4 8h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M16 9h2a3 3 0 0 1 0 6h-2" />
      <path d="M6 2v2" />
      <path d="M10 2v2" />
      <path d="M14 2v2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 8-2.5 5.5L8 16l2.5-5.5z" />
    </>
  ),
  fire: (
    <>
      <path d="M8.5 14.5A3.5 3.5 0 0 0 12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-4 4-4 7a3 3 0 0 1-1.5 2.5z" />
      <path d="M12 21a3 3 0 0 1-3-3c0-1.5 1-2.5 2-3.5.5 1.5 2 2.5 2 4A2.5 2.5 0 0 1 12 21z" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="M12 14 16 9" />
      <path d="M4 14h16" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  leaderboard: (
    <>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
      <path d="M2 20h20" />
    </>
  ),
  lock: (
    <>
      <rect height="11" rx="2" width="16" x="4" y="11" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17 15 12l-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  medal: (
    <>
      <path d="m8 2 4 7 4-7" />
      <circle cx="12" cy="14" r="5" />
      <path d="m10.5 14 1 1 2-2" />
    </>
  ),
  notification: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  park: (
    <>
      <path d="M12 22V10" />
      <path d="M8 14h8" />
      <path d="M6 10a6 6 0 1 1 12 0c0 2.5-2.5 4-6 4s-6-1.5-6-4z" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  public: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 18l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2v5" />
      <path d="M12 17v5" />
      <path d="M4.2 4.2 7.7 7.7" />
      <path d="m16.3 16.3 3.5 3.5" />
      <path d="M2 12h5" />
      <path d="M17 12h5" />
      <path d="m4.2 19.8 3.5-3.5" />
      <path d="m16.3 7.7 3.5-3.5" />
    </>
  ),
  star: (
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  tune: (
    <>
      <path d="M4 6h10" />
      <path d="M18 6h2" />
      <path d="M14 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M4 18h2" />
      <path d="M10 18h10" />
      <path d="M6 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M4 12h6" />
      <path d="M14 12h6" />
      <path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

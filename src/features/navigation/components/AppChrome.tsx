import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { LogoutButton } from "@/features/auth/components/DashboardAuth";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import type { AuthUser } from "@/features/auth/auth";
import type { UserProgress } from "@/features/dashboard/dashboard-data";
import { levelName } from "@/features/progress/levels";

export type AppIconName =
  | "admin"
  | "bookmark"
  | "compass"
  | "fire"
  | "gauge"
  | "home"
  | "leaderboard"
  | "logout"
  | "mapPin"
  | "medal"
  | "notification"
  | "person"
  | "settings"
  | "star"
  | "tune";

const primaryNavItems = [
  { label: "Home", icon: "home", href: "/dashboard" },
  { label: "Saved", icon: "bookmark", href: "/saved" },
  { label: "Profile", icon: "person", href: "/profile" },
  { label: "Explore", icon: "compass", href: "/explore" },
  { label: "Leaderboard", icon: "leaderboard", href: "/leaderboard" },
  { label: "Admin", icon: "admin", href: "/admin" },
] satisfies Array<{ label: string; icon: AppIconName; href: string }>;

const utilityNavItems = [
  { label: "Notifications", icon: "notification", href: "/notifications" },
  { label: "Settings", icon: "settings", href: "/settings" },
] satisfies Array<{ label: string; icon: AppIconName; href: string }>;

export function AppChrome({
  activeHref,
  children,
  progress,
  user,
}: {
  activeHref: string;
  children: ReactNode;
  progress: UserProgress | null;
  user: AuthUser;
}) {
  return (
    <main className="app-theme min-h-screen bg-background pb-8 text-on-background">
      <AppSidebar activeHref={activeHref} userRole={user.role} />
      <section className="md:ml-64">
        <AppHeader progress={progress} user={user} />
        <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>
      </section>
    </main>
  );
}

function AppSidebar({
  activeHref,
  userRole,
}: {
  activeHref: string;
  userRole: string;
}) {
  const visiblePrimaryNavItems = primaryNavItems.filter(
    (item) => item.href !== "/admin" || userRole === "admin",
  );

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest md:flex">
      <div className="flex flex-col gap-1 p-6">
        <Link aria-label="OnSite dashboard" href="/dashboard">
          <BrandLogo className="h-8 w-32" priority />
        </Link>
        <p className="text-[10px] font-medium leading-tight text-on-surface-variant">
          WHERE COMFORT MEETS CONNECTION
        </p>
      </div>
      <nav className="custom-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto px-3">
        {visiblePrimaryNavItems.map((item) => (
          <NavLink
            active={activeHref === item.href}
            href={item.href}
            icon={item.icon}
            key={item.label}
            label={item.label}
          />
        ))}
        <div className="px-4 pb-2 pt-4">
          <hr className="border-outline-variant" />
        </div>
        {utilityNavItems.map((item) => (
          <NavLink
            active={activeHref === item.href}
            href={item.href}
            icon={item.icon}
            key={item.label}
            label={item.label}
          />
        ))}
        <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-error transition-all duration-200 hover:bg-error-container/20 active:scale-95 disabled:opacity-60">
          <AppIcon className="h-5 w-5" name="logout" />
          <span className="font-medium">Log Out</span>
        </LogoutButton>
      </nav>
    </aside>
  );
}

function NavLink({
  active,
  href,
  icon,
  label,
}: {
  active: boolean;
  href: string;
  icon: AppIconName;
  label: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 active:scale-95 ${
        active
          ? "bg-primary-container text-on-primary-container"
          : "text-on-surface-variant hover:bg-surface-container-low"
      }`}
      href={href}
    >
      <AppIcon className={`h-5 w-5 ${active ? "text-primary" : ""}`} name={icon} />
      <span className={active ? "font-bold" : "font-medium"}>{label}</span>
    </Link>
  );
}

function AppHeader({
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
            <AppIcon className={`h-4 w-4 ${chip.iconClassName}`} name={chip.icon} />
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
        <Link
          className="flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-xs font-bold text-on-primary-container shadow-sm transition-all hover:bg-primary-container/80 active:scale-95"
          href="/onboarding"
        >
          <AppIcon className="h-4 w-4" name="tune" />
          <span className="hidden sm:inline">Adjust Preferences</span>
          <span className="sm:hidden">Adjust</span>
        </Link>
        <Link
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant transition-colors hover:text-primary"
          href="/notifications"
        >
          <AppIcon className="h-5 w-5" name="notification" />
        </Link>
        <Link
          aria-label="View profile"
          className="rounded-full border-2 border-primary transition-transform active:scale-95"
          href="/profile"
        >
          <UserAvatar
            className="h-9 w-9 rounded-full text-xs"
            name={user.name}
            sizes="36px"
          />
        </Link>
      </div>
    </header>
  );
}

function dashboardStatChips(progress: UserProgress | null) {
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
      value: reflections === 0 ? "First reflection pending" : "Keep going!",
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
  ] satisfies Array<{
    icon: AppIconName;
    label: string;
    value: string;
    className: string;
    iconClassName: string;
    valueClassName: string;
  }>;
}

export function AppIcon({
  className,
  name,
}: {
  className?: string;
  name: AppIconName;
}) {
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

const iconPaths: Record<AppIconName, ReactNode> = {
  admin: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </>
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
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
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 18l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1z" />,
  tune: (
    <>
      <path d="M4 6h10" />
      <path d="M18 6h2" />
      <path d="M14 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M4 18h2" />
      <path d="M10 18h10" />
      <path d="M6 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
    </>
  ),
};

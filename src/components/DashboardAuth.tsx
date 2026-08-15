"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRouteMotion } from "@/components/RouteMotion";
import { UserAvatar } from "@/components/UserAvatar";
import type { AuthUser } from "@/lib/auth";
import type { UserProgress } from "@/lib/dashboard-data";

export function DashboardAuthPanel({
  progress,
  user,
}: {
  progress: UserProgress | null;
  user: AuthUser;
}) {
  return (
    <UserPanelShell
      name={user.name}
      progress={progress}
    />
  );
}

export function DashboardGreeting({ user }: { user: AuthUser }) {
  const firstName = user.name.split(/\s+/)[0] || "there";

  return (
    <>
      Hi {firstName},{" "}
      <span className="text-primary">find your focus today.</span>
    </>
  );
}

export function LogoutButton({
  className,
  children,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", { method: "POST" });
    startRouteMotion();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className={className}
      disabled={isSubmitting}
      onClick={handleLogout}
      type="button"
    >
      {children}
    </button>
  );
}

function UserPanelShell({
  name,
  progress,
}: {
  name: string;
  progress: UserProgress | null;
}) {
  const level = progress?.level ?? 1;
  const currentXp = progress?.current_level_xp ?? 0;
  const nextXp = progress?.next_level_xp ?? 200;
  const xpPercent = Math.min(100, Math.round((currentXp / nextXp) * 100));

  return (
    <div className="flex items-center gap-5 rounded-[2rem] border border-outline-variant bg-surface-container-low p-6 shadow-sm lg:col-span-4">
      <UserAvatar
        className="h-16 w-16 rounded-2xl text-2xl text-on-primary-container"
        name={name}
        sizes="64px"
      />
      <div className="flex-1">
        <div className="mb-1 flex items-end justify-between">
          <span className="font-bold text-on-surface">{name}</span>
          <span className="text-[11px] font-bold text-primary">
            {currentXp}/{nextXp} XP
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-outline-variant">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-primary">
          Level {level}: {levelName(level)}
        </p>
      </div>
    </div>
  );
}

function levelName(level: number) {
  if (level >= 5) return "Community Guide";
  if (level >= 3) return "Space Regular";
  if (level >= 2) return "Focus Finder";
  return "New Explorer";
}

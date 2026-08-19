import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppChrome } from "@/features/navigation/components/AppChrome";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import {
  getDashboardData,
  type AchievementProgress,
} from "@/features/dashboard/dashboard-data";
import { requireAuth } from "@/features/auth/server-auth";
import { levelName } from "@/features/progress/levels";

export const metadata: Metadata = {
  title: "Profile & My Journey",
};

export default async function ProfilePage() {
  const user = await requireAuth("/profile");
  const { progress } = await getDashboardData();
  const level = progress?.level ?? 1;
  const currentXp = progress?.current_level_xp ?? 0;
  const nextXp = progress?.next_level_xp ?? 200;
  const xpPercent = Math.min(100, Math.round((currentXp / nextXp) * 100));
  const achievementProgress = progress?.achievement_progress ?? [];
  const visits = progress?.visits ?? 0;
  const reflections = progress?.reflections ?? 0;
  const currentStreak = progress?.current_streak ?? 0;
  const weeklyGoal = progress?.weekly_goal ?? {
    completed: 0,
    percent: 0,
    target: 5,
  };
  const recentActivity = progress?.recent_activity ?? [];

  return (
    <AppChrome activeHref="/profile" progress={progress} user={user}>
      <div className="text-white">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0B1120] shadow-2xl">
        <header className="relative z-10 pb-10 pt-12 text-center">
          <div className="mb-3 flex justify-center">
            <BrandLogo className="h-[65px] w-64" priority />
          </div>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Where Comfort Meets Connection
          </p>
        </header>

        <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-6 pb-12">
          <section className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 shadow-[0_0_20px_rgba(34,211,238,0.06)]">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative">
                <UserAvatar
                  className="h-24 w-24 rounded-full border-2 border-[#22D3EE]/30 text-2xl text-[#22D3EE]"
                  name={user.name}
                  sizes="96px"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-[#22D3EE] px-2 py-0.5 text-[10px] font-bold text-[#0B1120]">
                  LVL {level}
                </div>
              </div>

              <div className="w-full flex-1 space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-extrabold text-white">{user.name}</h2>
                <p className="text-sm font-medium text-[#94A3B8]">
                  Level {level} {levelName(level)}
                </p>
                <div className="pt-2">
                  <div className="mb-1.5 flex items-end justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#22D3EE]">
                      XP Progress
                    </span>
                    <span className="text-[11px] font-bold text-white">
                      {currentXp}{" "}
                      <span className="text-[#94A3B8]">/ {nextXp} XP</span>
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full border border-[#1E293B] bg-[#0B1120]">
                    <div
                      className="h-full bg-gradient-to-r from-[#22D3EE] via-[#67E8F9] to-[#22D3EE] transition-all duration-1000 ease-out"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="hidden border-l border-[#1E293B] pl-6 lg:block">
                <button className="rounded-lg bg-[#22D3EE] px-8 py-3 font-bold text-[#0B1120] shadow-lg transition-all hover:brightness-110">
                  My Journey
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <JourneyStat
              icon="location_on"
              label="Places Visited"
              marker="Lifetime"
              tone="cyan"
              value={String(visits)}
            />
            <JourneyStat
              icon="assignment"
              label="Reflections Done"
              marker="Complete"
              tone="cyan"
              value={String(reflections)}
            />
            <JourneyStat
              icon="local_fire_department"
              label="Current Streak"
              marker={<StreakDots />}
              tone="amber"
              value={`${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`}
            />
            <WeeklyGoalStat
              percent={weeklyGoal.percent}
              value={`${weeklyGoal.completed}/${weeklyGoal.target}`}
            />
          </section>

          <section className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-8 shadow-[0_0_20px_rgba(34,211,238,0.06)]">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white">Achievement Badges</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Milestones unlocked during your campus exploration.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {achievementProgress.map((item, index) => (
                <Badge
                  description={item.achievement.description}
                  icon={achievementIcon(item.achievement.code)}
                  key={item.achievement.code}
                  name={item.achievement.name}
                  tone={
                    item.unlocked ? (index === 0 ? "amber" : "cyan") : "locked"
                  }
                  unlocked={item.unlocked}
                />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 shadow-[0_0_20px_rgba(34,211,238,0.06)] lg:col-span-2">
              <h3 className="mb-4 font-bold text-white">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.slice(0, 2).map((activity, index) => (
                  <Activity
                    border={index > 0}
                    icon={activity.kind === "reflection" ? "rate_review" : "location_on"}
                    key={activity.id}
                    time={relativeActivityTime(activity.occurred_at)}
                    title={activity.title}
                    xp={`+${activity.xp} XP`}
                  />
                ))}
              </div>
            </section>

            <section className="relative flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 text-center shadow-[0_0_20px_rgba(34,211,238,0.06)]">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="material-symbols-outlined text-3xl text-[#F59E0B]">
                  rocket_launch
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-white">Next Milestone</h3>
                <p className="mt-1 text-xs text-[#94A3B8]">
                  {milestoneMessage(progress?.next_milestone ?? null)}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </AppChrome>
  );
}

function JourneyStat({
  icon,
  label,
  marker,
  tone,
  value,
}: {
  icon: string;
  label: string;
  marker: ReactNode;
  tone: "amber" | "cyan";
  value: string;
}) {
  const toneClasses =
    tone === "amber"
      ? "text-[#F59E0B] group-hover:border-[#F59E0B]/50 group-hover:[&_.stat-icon-wrap]:bg-[#F59E0B]/10"
      : "text-[#22D3EE] group-hover:border-[#22D3EE]/50 group-hover:[&_.stat-icon-wrap]:bg-[#22D3EE]/10";

  return (
    <div
      className={`group rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 shadow-[0_0_20px_rgba(34,211,238,0.06)] transition-colors ${toneClasses}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="stat-icon-wrap flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1120] transition-colors">
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: tone === "amber" ? "'FILL' 1" : undefined,
            }}
          >
            {icon}
          </span>
        </div>
        {typeof marker === "string" ? (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
            {marker}
          </span>
        ) : (
          marker
        )}
      </div>
      <div className="mb-1 text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#94A3B8]">{label}</div>
    </div>
  );
}

function StreakDots() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
      ))}
    </div>
  );
}

function WeeklyGoalStat({ percent, value }: { percent: number; value: string }) {
  return (
    <div className="group rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 shadow-[0_0_20px_rgba(34,211,238,0.06)] transition-colors hover:border-[#6366F1]/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1120] transition-colors group-hover:bg-[#6366F1]/10">
          <span className="material-symbols-outlined text-[#6366F1]">
            task_alt
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
          Weekly Goal
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <circle
              className="stroke-[#0B1120]"
              cx="18"
              cy="18"
              fill="none"
              r="16"
              strokeWidth="3"
            />
            <circle
              className="stroke-[#6366F1] drop-shadow-[0_0_2px_#6366F1]"
              cx="18"
              cy="18"
              fill="none"
              r="16"
              strokeDasharray={`${percent}, 100`}
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
            {value}
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-white">{percent}%</div>
          <div className="text-[10px] text-[#94A3B8]">Visits completed</div>
        </div>
      </div>
    </div>
  );
}

function Badge({
  description,
  icon,
  name,
  tone = "locked",
  unlocked = false,
}: {
  description?: string;
  icon: string;
  name: string;
  tone?: "amber" | "cyan" | "locked";
  unlocked?: boolean;
}) {
  const toneClasses =
    tone === "amber"
      ? "border-[#F59E0B]/30 bg-[#F59E0B]/20 text-[#F59E0B]"
      : tone === "cyan"
        ? "border-[#22D3EE]/30 bg-[#22D3EE]/20 text-[#22D3EE]"
        : "border-[#1E293B] bg-[#1E293B]/20 text-[#94A3B8]";

  return (
    <div className={`flex flex-col items-center gap-3 ${unlocked ? "" : "opacity-40"}`}>
      <div
        className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border transition-all ${toneClasses}`}
      >
        <span
          className="material-symbols-outlined text-3xl"
          style={{ fontVariationSettings: unlocked ? "'FILL' 1" : undefined }}
        >
          {icon}
        </span>
      </div>
      <div className="text-center">
        <span
          className={`block text-[11px] font-bold leading-tight ${
            unlocked ? "text-white" : "text-[#94A3B8]"
          }`}
        >
          {name}
        </span>
        {description ? (
          <span className="mt-1 block text-[9px] leading-tight text-[#94A3B8]">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Activity({
  border = false,
  icon = "location_on",
  time,
  title,
  xp,
}: {
  border?: boolean;
  icon?: string;
  time: string;
  title: string;
  xp: string;
}) {
  return (
    <div
      className={`group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-[#0B1120] ${
        border ? "border-t border-[#1E293B] pt-4" : ""
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#1E293B] bg-[#0B1120]">
        <span className="material-symbols-outlined text-[#22D3EE]">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-[11px] text-[#94A3B8]">
          {time} <span className="text-[#22D3EE]">{xp}</span>
        </p>
      </div>
      <span className="material-symbols-outlined text-[#22D3EE] opacity-0 transition-opacity group-hover:opacity-100">
        arrow_forward_ios
      </span>
    </div>
  );
}

function achievementIcon(code: string) {
  const icons: Record<string, string> = {
    CAMPUS_REGULAR: "interests",
    FIRST_STEP: "explore",
    ONSITE_AMBASSADOR: "verified",
    REFLECTIVE_REGULAR: "military_tech",
    SPACE_EXPLORER: "map",
    THOUGHTFUL_EXPLORER: "groups",
  };
  return icons[code] ?? "military_tech";
}

function milestoneMessage(milestone: AchievementProgress | null) {
  if (!milestone) return "Every available milestone has been unlocked.";
  const requirement = milestone.requirements.find((item) => item.remaining > 0);
  if (!requirement) return `Unlock: ${milestone.achievement.name}.`;
  return `Unlock: ${milestone.achievement.name} with ${requirement.remaining} more ${requirement.metric}.`;
}

function relativeActivityTime(value: string) {
  const timestamp = new Date(value).getTime();
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays}d ago`;
}

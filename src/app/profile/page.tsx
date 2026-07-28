import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppChrome } from "@/components/AppChrome";
import { getInitials } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Profile & My Journey | OnSite",
};

export default async function ProfilePage() {
  const user = await requireAuth("/profile");
  const { progress } = await getDashboardData();
  const level = progress?.level ?? 1;
  const currentXp = progress?.current_level_xp ?? 0;
  const nextXp = progress?.next_level_xp ?? 200;
  const xpPercent = Math.min(100, Math.round((currentXp / nextXp) * 100));
  const achievements = progress?.achievements ?? [];
  const visits = progress?.visits ?? 0;
  const reflections = progress?.reflections ?? 0;
  const weeklyGoal = Math.min(visits, 5);
  const weeklyPercent = Math.min(100, Math.round((weeklyGoal / 5) * 100));

  return (
    <AppChrome activeHref="/profile" progress={progress} user={user}>
      <div className="text-white">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0B1120] shadow-2xl">
        <header className="relative z-10 pb-10 pt-12 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22D3EE]/20 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <span className="material-symbols-outlined text-4xl text-[#22D3EE]">
                location_on
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">OnSite</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Where Comfort Meets Connection
          </p>
        </header>

        <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-6 pb-12">
          <section className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 shadow-[0_0_20px_rgba(34,211,238,0.06)]">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#22D3EE]/30 bg-[#22D3EE]/10">
                  <span className="text-2xl font-bold text-[#22D3EE]">
                    {getInitials(user.name)}
                  </span>
                </div>
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
              value={visits > 0 ? "1 Day" : "0 Days"}
            />
            <WeeklyGoalStat percent={weeklyPercent} value={`${weeklyGoal}/5`} />
          </section>

          <section className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-8 shadow-[0_0_20px_rgba(34,211,238,0.06)]">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white">Achievement Badges</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Milestones unlocked during your campus exploration.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              <Badge
                description="Complete onboarding."
                icon="explore"
                name="New Explorer"
                tone="amber"
                unlocked
              />
              <Badge
                description="Visit 5 spaces."
                icon="map"
                name="Campus Wanderer"
                tone="cyan"
                unlocked={achievements.length > 1 || visits >= 5}
              />
              <Badge icon="groups" name="Community Connector" />
              <Badge icon="interests" name="Cultural Navigator" />
              <Badge icon="military_tech" name="Space Champion" />
              <Badge icon="verified" name="Ambassador" />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-6 shadow-[0_0_20px_rgba(34,211,238,0.06)] lg:col-span-2">
              <h3 className="mb-4 font-bold text-white">Recent Activity</h3>
              <div className="space-y-4">
                <Activity title="Visited Cyberjaya Community Library" xp="+20 XP" />
                <Activity
                  border
                  icon="rate_review"
                  title="Reflection: First Week Vibes"
                  xp="+15 XP"
                />
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
                  Unlock: Community Connector by visiting 3 more departments.
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
  title,
  xp,
}: {
  border?: boolean;
  icon?: string;
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
          Just now <span className="text-[#22D3EE]">{xp}</span>
        </p>
      </div>
      <span className="material-symbols-outlined text-[#22D3EE] opacity-0 transition-opacity group-hover:opacity-100">
        arrow_forward_ios
      </span>
    </div>
  );
}

function levelName(level: number) {
  if (level >= 5) return "Community Guide";
  if (level >= 3) return "Space Regular";
  if (level >= 2) return "Campus Wanderer";
  return "New Explorer";
}

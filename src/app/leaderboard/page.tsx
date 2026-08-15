import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";
import { getInitials } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Global Leaderboard",
};

type PodiumUser = {
  initials: string;
  level: string;
  name: string;
  rank: 1 | 2 | 3;
  reflections?: number;
  spaces: number;
  title: string;
  xp: string;
};

type LeaderboardUser = {
  initials: string;
  isCurrentUser?: boolean;
  level: string;
  name: string;
  rank: number;
  reflections: number;
  spaces: number;
  title: string;
  xp: string;
};

const tiers = [
  { level: "Level 1", title: "New Explorer", xp: "0 XP" },
  { level: "Level 2", title: "Campus Wanderer", xp: "200 XP" },
  { level: "Level 3", title: "Community Connector", xp: "350 XP" },
  { level: "Level 4", title: "Cultural Navigator", xp: "650 XP" },
  { level: "Level 5", title: "Third Space Champion", xp: "1000 XP" },
  { level: "Level 6", title: "OnSite Ambassador", xp: "1500 XP" },
];

export default async function LeaderboardPage() {
  const user = await requireAuth("/leaderboard");
  const [{ progress }, leaderboard] = await Promise.all([
    getDashboardData(),
    getLeaderboard(),
  ]);
  const podiumUsers = leaderboard.entries.slice(0, 3).map(toPodiumUser);
  const listUsers = leaderboard.entries.slice(3).map(toLeaderboardUser);
  const leaderboardMessage = leaderboard.error
    ? leaderboard.error
    : leaderboard.totalVisibleUsers === 0
      ? "No explorers are visible on the leaderboard yet."
      : !leaderboard.currentUserVisible
        ? "Your leaderboard visibility is turned off in Settings."
        : null;

  return (
    <AppChrome activeHref="/leaderboard" progress={progress} user={user}>
      <div className="overflow-x-hidden text-slate-50 selection:bg-[#22D3EE] selection:text-[#0B1120]">
      <style>{`
        @keyframes leaderboard-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="fixed left-[5%] top-[15%] -z-20 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/5 blur-[150px]" />
      <div className="fixed bottom-[10%] right-[5%] -z-20 h-[300px] w-[300px] rounded-full bg-[#22D3EE]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl pb-10 pt-6">
        <header className="relative mb-20 text-center">
          <div className="absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#22D3EE]/10 blur-[120px]" />
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-50 md:text-6xl">
            Leaderboard
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light text-slate-400">
            Celebrating the top explorers in the OnSite ecosystem. Your journey
            across the digital frontier, ranked in real-time.
          </p>
        </header>

        <section className="mb-20 grid grid-cols-1 items-end gap-8 md:grid-cols-3">
          {podiumUsers.map((podiumUser) => (
            <PodiumCard key={podiumUser.rank} user={podiumUser} />
          ))}
        </section>

        <section className="mx-auto max-w-4xl space-y-4">
          {listUsers.map((rankedUser) => (
            <RankRow key={rankedUser.rank} user={rankedUser} />
          ))}
          {leaderboardMessage ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {leaderboardMessage}
            </p>
          ) : null}
        </section>

        <footer className="mt-16 text-center">
          <div className="mx-auto mb-12 mt-24 max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-widest text-slate-50">
              Tier Progression
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  className="flex flex-col items-center rounded-xl border border-[#22D3EE]/10 bg-[#161E2E]/80 p-4 text-center backdrop-blur-xl"
                  key={tier.level}
                >
                  <span className="mb-1 text-xs font-bold uppercase text-[#22D3EE]">
                    {tier.level}
                  </span>
                  <div className="font-bold text-slate-50">{tier.title}</div>
                  <div className="mt-1 text-[10px] font-black text-[#22D3EE]/60">
                    {tier.xp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
      </div>
    </AppChrome>
  );
}

function PodiumCard({ user }: { user: PodiumUser }) {
  const isChampion = user.rank === 1;
  const orderClass =
    user.rank === 1 ? "order-1 md:order-2" : user.rank === 2 ? "order-2 md:order-1" : "order-3";

  return (
    <div
      className={`flex flex-col items-center ${orderClass}`}
      style={{ animation: isChampion ? "leaderboard-float 6s ease-in-out infinite" : undefined }}
    >
      <div className={`group relative ${isChampion ? "mb-8" : "mb-6"}`}>
        <div
          className={`absolute inset-0 rounded-full ${
            isChampion
              ? "animate-pulse bg-[#22D3EE]/40 blur-[40px]"
              : user.rank === 2
                ? "bg-[#22D3EE]/20 blur-xl transition-all group-hover:bg-[#22D3EE]/40"
                : "bg-[#22D3EE]/10 blur-xl"
          }`}
        />
        <div
          className={`relative z-10 flex items-center justify-center overflow-hidden rounded-full border-4 bg-[#161E2E]/80 font-bold text-[#22D3EE] backdrop-blur-xl ${
            isChampion
              ? "h-48 w-48 border-[#22D3EE] text-5xl font-black shadow-[0_0_40px_rgba(34,211,238,0.5)]"
              : "h-32 w-32 border-slate-700 text-3xl"
          }`}
        >
          {user.initials}
        </div>
        <div
          className={
            isChampion
              ? "absolute -bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border-4 border-[#0B1120] bg-[#22D3EE] px-6 py-1.5 text-xl font-black text-[#0B1120] shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              : "absolute -bottom-2 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0B1120] bg-slate-700 text-lg font-bold text-white shadow-lg"
          }
        >
          {isChampion ? (
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
          ) : null}
          {user.rank}
        </div>
      </div>

      <div className="text-center">
        <h3 className={`${isChampion ? "mb-1 text-3xl font-black" : "text-xl font-bold"} text-slate-50`}>
          {user.name}
        </h3>
        <p
          className={`font-bold uppercase text-[#22D3EE] ${
            isChampion ? "text-lg tracking-[0.2em]" : "text-sm tracking-widest"
          }`}
        >
          {user.level} - {user.title}
        </p>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#22D3EE]/60">
          XP: {user.xp}
        </div>
        {isChampion ? (
          <div className="mt-3 flex items-center justify-center gap-4">
            <ChampionStat label="Spaces" value={String(user.spaces)} />
            <ChampionStat label="Reflections" value={String(user.reflections ?? 0)} />
          </div>
        ) : (
          <div className="mt-2 text-sm text-slate-400">
            {user.spaces} Spaces Visited
          </div>
        )}
      </div>
    </div>
  );
}

function ChampionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-4 py-2">
      <span className="block text-[10px] font-bold uppercase tracking-tighter text-[#22D3EE]">
        {label}
      </span>
      <span className="text-xl font-bold text-slate-50">{value}</span>
    </div>
  );
}

function RankRow({ user }: { user: LeaderboardUser }) {
  if (user.isCurrentUser) {
    return (
      <div className="group flex cursor-pointer items-center gap-6 rounded-2xl border-2 border-[#22D3EE] bg-[#22D3EE]/5 px-6 py-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
        <div className="w-10 text-center text-xl font-black text-[#22D3EE]">
          {formatRank(user.rank)}
        </div>
        <Avatar className="border-[#22D3EE] bg-[#22D3EE]/20" initials={user.initials} />
        <div className="flex-1">
          <div className="text-lg font-bold text-slate-50">{user.name}</div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded bg-[#22D3EE] px-2 py-0.5 font-bold text-[#0B1120]">
              {user.level} - {user.title}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#22D3EE]" />
            <span className="font-bold text-[#22D3EE]">{user.xp} XP</span>
          </div>
        </div>
        <RankStats reflectionsClassName="text-slate-50" user={user} />
      </div>
    );
  }

  return (
    <div className="group flex cursor-pointer items-center gap-6 rounded-2xl border border-[#22D3EE]/10 bg-[#161E2E]/80 px-6 py-4 backdrop-blur-xl transition-all hover:bg-[#1e293b]/40">
      <div className="w-10 text-center text-xl font-black text-slate-400 transition-all group-hover:translate-x-1 group-hover:scale-110 group-hover:text-[#22D3EE]">
        {formatRank(user.rank)}
      </div>
      <Avatar initials={user.initials} />
      <div className="flex-1">
        <div className="text-lg font-bold text-slate-50">{user.name}</div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded border border-[#22D3EE]/10 bg-[#0f172a] px-2 py-0.5 text-[#22D3EE]">
            {user.level} - {user.title}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="font-bold text-[#22D3EE]/60">XP: {user.xp}</span>
        </div>
      </div>
      <RankStats reflectionsClassName="text-slate-400" user={user} />
    </div>
  );
}

function Avatar({ className = "border-[#334155]/20 bg-slate-800/50", initials }: { className?: string; initials: string }) {
  return (
    <div className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 font-bold text-[#22D3EE] ${className}`}>
      {initials}
    </div>
  );
}

function RankStats({
  reflectionsClassName,
  user,
}: {
  reflectionsClassName: string;
  user: LeaderboardUser;
}) {
  return (
    <div className="text-right">
      <div className="mb-1">
        <div className={`text-sm font-bold ${reflectionsClassName}`}>
          {user.reflections}
        </div>
        <div className="text-[8px] font-black uppercase tracking-widest text-[#22D3EE]/60">
          Reflections
        </div>
      </div>
      <div className="text-xl font-bold text-slate-50">{user.spaces}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE]">
        Spaces
      </div>
    </div>
  );
}

function formatRank(rank: number) {
  return rank.toString().padStart(2, "0");
}

function toPodiumUser(entry: LeaderboardEntry): PodiumUser {
  return {
    initials: getInitials(entry.name),
    level: `Level ${entry.level}`,
    name: displayName(entry),
    rank: entry.rank as 1 | 2 | 3,
    reflections: entry.reflections,
    spaces: entry.visits,
    title: entry.title,
    xp: String(entry.xp),
  };
}

function toLeaderboardUser(entry: LeaderboardEntry): LeaderboardUser {
  return {
    initials: getInitials(entry.name),
    isCurrentUser: entry.is_current_user,
    level: `Level ${entry.level}`,
    name: displayName(entry),
    rank: entry.rank,
    reflections: entry.reflections,
    spaces: entry.visits,
    title: entry.title,
    xp: String(entry.xp),
  };
}

function displayName(entry: LeaderboardEntry) {
  return entry.is_current_user ? `YOU (${entry.name})` : entry.name;
}

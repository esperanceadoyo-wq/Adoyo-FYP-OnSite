import type { Metadata } from "next";
import Image from "next/image";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Notifications & Community",
};

type FeedPost = {
  author: string;
  avatar?: string;
  body: string;
  comments: string;
  image?: string;
  imageAlt?: string;
  likes: string;
  time?: string;
  type?: "person" | "location";
};

type Alert = {
  icon: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
};

const feedPosts: FeedPost[] = [
  {
    author: "Sarah J.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAXKwjl4i1JuBRJLhDuqQvHgYFTcDIsvijyilb0zR3s8Af0Y2Xpo7g6WIbU2xhNVnxOm2Ib65FMiV28r-wUx-a6i5YKfO15Oj3daAVvggrd_9fSoN74qmfEYb4Bgc4HbgqMC6PfHpjIdc0bvJlqNLDeUYaypafT1qMn62HE9mUT_QyzFwefCDeF0hmsVQhUId-oOJJsRBC4OzlEWa0IIWnzx0ayUQAeGrvvQoiRMc1h1KNUdoMDWCli2SX4F_YaY8yrUyhUpfbSScD",
    body: 'Shared a new reflection: "The serenity at the Central Library today helped me finish my thesis proposal. Highly recommend the north wing!"',
    comments: "2 Comments",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGx6uGn8TuJ4YAByij0bF58q9zY1DDdAD3U0ac0BOkuSWZ9djMdS1aEQyhWUDQHQQd_VSOvPhJrwkuQgJXcMaL0vRP2uoHyv-UHnynv7d4IHIhcbjPSPwqToG_lrtGd8F8le6SOxWEi4GsR6SNZFN2p1N3z4d2exhmFvAERwSHWGdYldHzAzg00Bf6tjF3ONFtxYYAlbSvLRVHA-TqLH15v97c6yGch6YKWpfCjLcvwmyL558tPSYBRChV-MClPZLmoFouk39iU3J6",
    imageAlt:
      "A modern library interior with high ceilings, slate-blue furniture, and large windows at twilight.",
    likes: "5 Likes",
    time: "2h ago",
  },
  {
    author: "Central Library Check-in",
    body: "12 users checked in here in the last hour.",
    comments: "4 Comments",
    likes: "18 Likes",
    type: "location",
  },
];

const alertItems: Alert[] = [
  {
    body: "Congratulations! You've earned the 'Consistent Explorer' badge.",
    icon: "military_tech",
    time: "Just now",
    title: "Level 3 Unlocked!",
    unread: true,
  },
  {
    body: 'Marcus commented: "Totally agree with your point about the acoustics!"',
    icon: "reply",
    time: "15m ago",
    title: "New Reply to your Reflection",
    unread: true,
  },
  {
    body: "A new high-speed workspace is now available on the 2nd floor.",
    icon: "update",
    time: "2 hours ago",
    title: "Cyberjaya Library Update",
  },
  {
    body: '"Deep Work Session" starts in 30 minutes at The Hub.',
    icon: "calendar_today",
    time: "Yesterday",
    title: "Event Reminder",
  },
];

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5-VC3xPEEOi4zeq5Rx2zN8JLOoL0uOz2cX2Qm9Uj3TE_pwcHyP4y70DSqI9knQ1gT6qfgGp9bMQ9vHaVd_ryoMnnvpNr0-oIrvTKBJEQvmp01bsOsAXFQbGWWmFQRsbZlcuX3Z1azQiQoq4E-FHDNCSuqbeZ9UgIEisITWA9rQau1os9rrVB0FTYVcyB8L8N9UOTZOEjNMYn3O0rD4OV_RvqU2Hcn5noVHn6TcUsMoi-A3v4ec4TUWT20AKrsYnUJ9iBwFyujg4Vz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCcvgnMKTeM1VzO0H4DLJbqxnRippMpen4dZEwUgZA76IlEEFPpZm94oXNieh3zw2rXkQF8gweh3spQ4xwrkYp0p7twnHkEHMN8kGyMUQKUo6KPOjHNnThaff5WC4KssPBDpMsuUtCx2vN6H2lWnW8dJSOgH9s2__wmO2Wx4UVZlhGySpqWAxdPSOm-I4S1sK7zeTd1zJcmbOjzH0liaXVaK-yCIMtw0nSCB0xp4_TktrKfZIalKGMMoIpDmv6X4JoWYHF-4xzy9gkS",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFULz-XEI8eaor00PsE58idtTtKJCPFIjMgjVIWIEO0KhOTB1MvvvOqbPwUjFPQRCl9ZtIhjGmzEOnq6MeSe0-H9i1LD_w3Gi9GbZ25JsC0jkOUvOQu5DuGEe9gZAboGr0OP8aF-qvg3ujGxxMkGeWS5SHHZTtYvcvbd_QMCFlz0gtqvGId_U5XNkebVg3kdp_0k3P3h-diVoXnAYdAWxDloQiOvKuCg2d45ktPgBClHEBlghiKvulWhm2b-EYk4YG-qO0SKsb5I2p",
];

export default async function NotificationsPage() {
  const user = await requireAuth("/notifications");
  const { progress } = await getDashboardData();

  return (
    <AppChrome activeHref="/notifications" progress={progress} user={user}>
      <div className="text-slate-50 antialiased">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">
            Notifications & Community
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Community updates, replies, milestones, and recent alerts in one place.
          </p>
        </div>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-7">
            <SectionHeader action="View All" icon="groups" title="Community Feed" />
            <PostComposer />
            <div className="space-y-4">
              {feedPosts.map((post) => (
                <FeedCard key={post.author} post={post} />
              ))}
            </div>
          </section>

          <section className="space-y-6 lg:col-span-5">
            <SectionHeader
              action="Mark all read"
              actionClassName="text-[#2ab8cb] hover:underline"
              icon="notifications_active"
              title="Recent Alerts"
            />
            <div className="overflow-hidden rounded-xl border border-white/5 bg-[#161E2E]">
              {alertItems.map((alert) => (
                <AlertCard alert={alert} key={alert.title} />
              ))}
            </div>
            <MilestonesCard />
          </section>
        </div>
      </div>
      </div>
    </AppChrome>
  );
}

function SectionHeader({
  action,
  actionClassName = "text-slate-400 hover:text-[#2ab8cb]",
  icon,
  title,
}: {
  action: string;
  actionClassName?: string;
  icon: string;
  title: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between px-2">
      <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-50">
        <span className="material-symbols-outlined text-[#2ab8cb]">{icon}</span>
        {title}
      </h2>
      <button className={`text-xs font-medium transition-colors ${actionClassName}`}>
        {action}
      </button>
    </div>
  );
}

function PostComposer() {
  return (
    <article className="mb-6 rounded-xl border border-white/5 bg-[#161E2E] p-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2ab8cb]/30 bg-[#2ab8cb]/10 text-[#2ab8cb]">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="flex-grow">
          <textarea
            className="w-full resize-none rounded-lg border-none bg-[#1e293b] p-3 text-sm text-slate-50 placeholder:text-slate-400 focus:ring-1 focus:ring-[#2ab8cb]"
            placeholder="Share a reflection or update..."
            rows={2}
          />
          <div className="mt-3 flex items-center justify-between">
            <button className="flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-[#2ab8cb]">
              <span className="material-symbols-outlined text-lg">image</span>
              Add Picture
            </button>
            <button className="rounded-full bg-[#2ab8cb] px-6 py-1.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95">
              Post
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeedCard({ post }: { post: FeedPost }) {
  const isLocationPost = post.type === "location";

  return (
    <article className="group rounded-xl border border-white/5 bg-[#161E2E] p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex gap-4">
        <div className="shrink-0">
          {post.avatar ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#2ab8cb]/20">
              <Image alt={post.author} className="object-cover" fill sizes="48px" src={post.avatar} />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2ab8cb]/30 bg-[#2ab8cb]/10 text-[#2ab8cb]">
              <span className="material-symbols-outlined">
                {isLocationPost ? "location_on" : "person"}
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-50">
                {post.author}
                {post.time ? (
                  <span className="ml-1 text-sm font-normal text-slate-400">
                    - {post.time}
                  </span>
                ) : null}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {post.body}
              </p>
            </div>
            {isLocationPost ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2ab8cb]">
                Trending
              </span>
            ) : (
              <span className="material-symbols-outlined cursor-pointer text-slate-400 hover:text-[#2ab8cb]">
                more_horiz
              </span>
            )}
          </div>

          {post.image && post.imageAlt ? (
            <div className="relative mt-4 h-40 overflow-hidden rounded-lg">
              <Image
                alt={post.imageAlt}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                src={post.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ) : (
            <AvatarStack />
          )}

          <FeedActions comments={post.comments} likes={post.likes} share={!isLocationPost} />
        </div>
      </div>
    </article>
  );
}

function AvatarStack() {
  return (
    <div className="mt-3 flex -space-x-2 overflow-hidden">
      {avatars.map((avatar, index) => (
        <Image
          alt=""
          className="inline-block h-6 w-6 rounded-full object-cover ring-2 ring-[#161E2E]"
          height={24}
          key={avatar}
          src={avatar}
          width={24}
          priority={index === 0}
        />
      ))}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e293b] text-[10px] font-bold text-slate-400 ring-2 ring-[#161E2E]">
        +9
      </div>
    </div>
  );
}

function FeedActions({
  comments,
  likes,
  share,
}: {
  comments: string;
  likes: string;
  share: boolean;
}) {
  return (
    <div className="mt-4 flex items-center gap-6">
      <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-[#2ab8cb]">
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
          thumb_up
        </span>
        {likes}
      </button>
      <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-[#2ab8cb]">
        <span className="material-symbols-outlined text-lg">chat_bubble</span>
        {comments}
      </button>
      {share ? (
        <button className="ml-auto text-slate-400 transition-colors hover:text-[#2ab8cb]">
          <span className="material-symbols-outlined text-lg">share</span>
        </button>
      ) : null}
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  return (
    <article
      className={`relative flex cursor-pointer gap-4 p-4 transition-colors ${
        alert.unread
          ? "bg-[#2ab8cb]/5 hover:bg-[#2ab8cb]/10"
          : "opacity-80 hover:bg-white/5 hover:opacity-100"
      }`}
    >
      {alert.unread ? (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#2ab8cb]" />
      ) : null}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          alert.unread
            ? "bg-[#2ab8cb]/20 text-[#2ab8cb]"
            : "bg-[#334155]/20 text-slate-400"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: alert.icon === "military_tech" ? "'FILL' 1" : undefined }}
        >
          {alert.icon}
        </span>
      </div>
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <p className={`text-sm ${alert.unread ? "font-bold" : "font-medium"} text-slate-50`}>
            {alert.title}
          </p>
          {alert.unread ? (
            <div className="mt-1 h-2 w-2 rounded-full bg-[#2ab8cb] shadow-[0_0_8px_rgba(42,184,203,0.6)]" />
          ) : null}
        </div>
        <p className="mt-1 text-xs text-slate-400">{alert.body}</p>
        <span className={`mt-2 block text-[10px] font-medium ${alert.unread ? "text-[#2ab8cb]" : "text-slate-400"}`}>
          {alert.time}
        </span>
      </div>
    </article>
  );
}

function MilestonesCard() {
  return (
    <section className="rounded-xl border border-white/5 bg-[#161E2E] p-6 shadow-sm">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#2ab8cb]">
        <span className="material-symbols-outlined text-base">military_tech</span>
        Your Milestones
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-slate-400">
              <th className="pb-2 font-medium">Tier</th>
              <th className="pb-2 font-medium">XP Points</th>
              <th className="pb-2 font-medium">Badge Unlocked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <MilestoneRow badge="New Explorer" complete tier="Tier 1" xp="0-200" />
            <MilestoneRow badge="Campus Wanderer" complete tier="Tier 2" xp="201-500" />
            <MilestoneRow badge="Community Connector" tier="Tier 3" xp="501-1000" />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MilestoneRow({
  badge,
  complete = false,
  tier,
  xp,
}: {
  badge: string;
  complete?: boolean;
  tier: string;
  xp: string;
}) {
  return (
    <tr>
      <td className={`py-3 font-medium ${complete ? "text-slate-50" : "text-slate-50/50"}`}>
        {tier}
      </td>
      <td className={`py-3 ${complete ? "text-slate-400" : "text-slate-400/50"}`}>
        {xp}
      </td>
      <td className="py-3">
        <div className={`flex items-center gap-1.5 ${complete ? "text-[#2ab8cb]" : "text-slate-400/50"}`}>
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: complete ? "'FILL' 1" : undefined }}
          >
            {complete ? "check_circle" : "pending"}
          </span>
          {badge}
        </div>
      </td>
    </tr>
  );
}

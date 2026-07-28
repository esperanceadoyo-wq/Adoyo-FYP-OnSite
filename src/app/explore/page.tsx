import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { spacePath } from "@/lib/space-flow";

export const metadata: Metadata = {
  title: "Explore Spaces | OnSite",
};

type SpaceCard = {
  amenities: Array<{ icon: string; label: string }>;
  badge: string;
  badgeClassName: string;
  hours: string;
  image: string;
  imageAlt: string;
  quote: string;
  rating: string;
  tags: string[];
  tagClassName: string;
  title: string;
  zone: string;
};

type SpaceSection = {
  accentClassName: string;
  cards: SpaceCard[];
  description: string;
  title: string;
};

const sections: SpaceSection[] = [
  {
    accentClassName: "bg-emerald-500",
    description: "Quiet spaces ideal for relaxing, recharging, or focused study.",
    title: "Top Private",
    cards: [
      {
        amenities: [
          { icon: "wifi", label: "High" },
          { icon: "electric_bolt", label: "Plenty" },
          { icon: "volume_off", label: "Low" },
        ],
        badge: "Private",
        badgeClassName: "bg-emerald-600 text-white",
        hours: "09:00 - 18:00",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDfZmvkbJBJglQjbaezVPDEFfM0JP14UoNCXJtsQVuDzYfF3LFlB9-hTgSZ-YswvDPkhMU-RtuyP7b_MiriZ6dv_F5mFekqK7PtD4xsIRFjTAb_FIkh_Z8VP6AyhoEn1A1QvrtDCZ37gR2_AOTJEAHBdDvB0ei_lzOkgVqrVQ8gV4ct0BFLzQLrzVC4mqpfEqkJ8MLknHU_NJ6b_Go2i6oqM1TzBguVTBMaIwQUcb9-BwkEcLGVBGvfkQ",
        imageAlt: "A quiet, modern library interior with soft light and study areas.",
        quote:
          "An architectural masterpiece offering a serene sanctuary for deep focus and reading.",
        rating: "4.9",
        tags: ["Study", "Focused"],
        tagClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        title: "Cyberjaya Community Library",
        zone: "Quiet Zone",
      },
      {
        amenities: [
          { icon: "wifi", label: "Stable" },
          { icon: "local_cafe", label: "Yes" },
          { icon: "volume_up", label: "Ambient" },
        ],
        badge: "Private",
        badgeClassName: "bg-emerald-600 text-white",
        hours: "10:00 - 22:00",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLv1m9akX-ArVJICWVZy7hR-eVuTTdG9taRp3boiTq_j4okzPEti15m7a9DR-26-wo7Ga2qLo-1VLQK71u5wJjLDUxsPqfpLj4dwwERzTlS9bITHGI_o3fTEB1q024o_gIet-k8Yz1prZ8QSmac3g80NJyobepDlTrxzA_NnlXAJY_pdALnXwmNoXEBXgUR28vayg6kKcMkBsBR54VEr3WNH73lljKjLUnSWxCuGMr-9U4PRJ0vE7xYVQRaC",
        imageAlt: "A scenic library cafe with tall shelves and intimate reading nooks.",
        quote:
          "Stunning library-cafe hybrid with towering shelves and intimate reading nooks.",
        rating: "4.8",
        tags: ["Reading", "Aesthetic"],
        tagClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        title: "BookXcess @ Tamarind",
        zone: "Scenic Spot",
      },
      {
        amenities: [
          { icon: "signal_cellular_alt", label: "4G/5G" },
          { icon: "nature_people", label: "Park" },
          { icon: "notifications_off", label: "Silent" },
        ],
        badge: "Private",
        badgeClassName: "bg-emerald-600 text-white",
        hours: "06:00 - 20:00",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLtUUQV4ceShYWM5KQr4mLf6GwBZwWU6fehEGTBf-8S-g7F3BiwSyG7hhZFRFFZXcfO_sufH_bpBzTuPrC_2HpTKUvoKgit6s9QGaPPYdK20-UGOqhAKTAE0dkUHj3QU3vRcnz4RC1yUdRnlUZjrdz5qVh1lKp3usb5ai8rZwuhmXv-0Op9OC7z0Keg7M0JsV0DhATpYcctiGPvS8NXArSXXPyNhMLJckrXrHDc-THSJfdOeEnyojxYlgS1c",
        imageAlt: "A calm lakeside garden surrounded by greenery.",
        quote:
          "Nature's retreat for reflection and quiet walks amidst lush greenery and calm waters.",
        rating: "4.7",
        tags: ["Reflection", "Nature"],
        tagClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        title: "Cyberjaya Lake Gardens",
        zone: "Outdoor",
      },
    ],
  },
  {
    accentClassName: "bg-amber-500",
    description:
      "Comfortable spaces that balance productivity and light social interaction.",
    title: "Top Casual",
    cards: [
      {
        amenities: [
          { icon: "wifi_tethering", label: "Ultra" },
          { icon: "charger", label: "Dedicated" },
          { icon: "record_voice_over", label: "Moderate" },
        ],
        badge: "Casual",
        badgeClassName: "bg-amber-600 text-white",
        hours: "08:00 - 20:00",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLuJGYTKOjYoo9wE24A2LsVW2fLorfMLOOhMz8U6xebyCpMMKmn76iy6HTeMydlqH-OXxsi7JI6d4N4rNxTGt8HPVHQ428G4bZKXb27BmPomEiXL3lW8zxpLMAyPsOIwugjRntG_fLisoSPywDSleWU8sKzi72Avvu_mjJmtgPSm6t9hD30Vo8dbYcIiuNttKTw2aerJ0_xmKV6vT_IcbRiMTzZ4OOOVuvx6fwElcSLRrOY_EeAH5Y4Gd3N3",
        imageAlt: "A modern open co-working lounge with ergonomic desks.",
        quote:
          "Modern ergonomic desks and vibrant lighting designed for freelancers and digital nomads.",
        rating: "4.8",
        tags: ["Work", "Collab"],
        tagClassName: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        title: "Open Co-Working Lounge",
        zone: "Shared Space",
      },
      {
        amenities: [
          { icon: "local_cafe", label: "Top-Tier" },
          { icon: "settings_power", label: "Limited" },
          { icon: "music_note", label: "Jazz" },
        ],
        badge: "Casual",
        badgeClassName: "bg-amber-600 text-white",
        hours: "07:30 - 23:00",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLuerehpboM6OsXFhRcwv8b2uHd4FCqAZydnZdiYp9Nq5K7lHbNx12S67pSozxc0dlgGnH71y-WcTr1oxOxUMIg7CqDQ8qLZkhQEDtoEDUELS0hV4RA3nXQJ1kw8iC7Kpi-vu5k3wdjXYKv1GNpzPNjZZL-HrT7epa7lASCvDpE0axpilRdQiixtHrgAczNgEtm5MiF4swNnFUW7QbfBjg-uYak4V5i8iC4hakdSPt9asBv67Vpmacfc5TZL",
        imageAlt: "A specialty coffee shop with a focused, modern interior.",
        quote:
          "Tech-focused specialty coffee shop perfect for a quick meeting or afternoon grind.",
        rating: "4.6",
        tags: ["Caffeine", "Productive"],
        tagClassName: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        title: "Zus Coffee",
        zone: "Cafe",
      },
      {
        amenities: [
          { icon: "restaurant", label: "Full Menu" },
          { icon: "bolt", label: "Adequate" },
          { icon: "groups", label: "Chatty" },
        ],
        badge: "Casual",
        badgeClassName: "bg-amber-600 text-white",
        hours: "09:00 - 00:00",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLv_avmizEQMM4Ri-vxjToP6nSMxSLXGUu0RKram0mTKd_JZrBzyRym-cd-P8QfKSMqpis_i-jXTVfxvZutnPvTfBEIbJyAbRjTgF0_fQixt5Nn2_Nu8tNExo1zsRJ9NEXO66szjUYaJ3pXAncWRLgSKkUyiZWcGfG1G3y56upBiuuM2wj4RnoUO-oHgvpxOHgukZO2Z-nSgBpRKbWslWjiGip0HeI0ZRY270s6gjM4Euh6y5wD_tAdWJ8Bm",
        imageAlt: "A cozy industrial cafe with warm lighting and shared tables.",
        quote:
          "Cozy industrial interior with great local food and a relaxed, social work atmosphere.",
        rating: "4.5",
        tags: ["Social", "Dining"],
        tagClassName: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        title: "Richiamo Coffee Tamarind",
        zone: "Industrial Vibe",
      },
    ],
  },
  {
    accentClassName: "bg-blue-500",
    description:
      "Lively spaces perfect for meeting people, collaborating, and community engagement.",
    title: "Top Public",
    cards: [
      {
        amenities: [
          { icon: "shopping_bag", label: "Mall" },
          { icon: "meeting_room", label: "Tables" },
          { icon: "volume_up", label: "High" },
        ],
        badge: "Public",
        badgeClassName: "bg-blue-600 text-white",
        hours: "10:00 - 22:00",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLvkhvOybjjeGa_-tpJwTUcyFT2VdRUVxU0qG1HfyPkPBjiDsAaz0L59DFKB8RMRtQK8Ajb3ZoIwmqQPQHxvFKfayJ3lkGnwbIOGjR6z9eqkQv2AquOOt43QQOPPZvK9Jn3WR7UHa49J7Nd7lKC47-_2dlPow5f1nD8JsqbRr88T4sSg7n0MwyIVnzST_cDtMmgsKXgqUXn-W9AVJRRm9tV7kXt79tZ8lqnaHW-kYlZlH00rxh79p8hldsmU",
        imageAlt: "A busy coffee shop inside a shopping mall.",
        quote:
          "Bustling coffee hub in DPULZE Mall, ideal for casual catch-ups and people-watching.",
        rating: "4.4",
        tags: ["Collaborative", "Central"],
        tagClassName: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        title: "Coffee Bean & Tea Leaf",
        zone: "Mall Hub",
      },
      {
        amenities: [
          { icon: "eco", label: "Lush" },
          { icon: "chair", label: "Stairs" },
          { icon: "forum", label: "Active" },
        ],
        badge: "Public",
        badgeClassName: "bg-blue-600 text-white",
        hours: "24 Hours",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLufRyQ9iwiexYUcYeDSxgw6ay5lm9B5fJWnhMT4B2m0jETe-kjJbGip9vtUqqENdkcjfP9SE9HprB6DXx-CVuPniu75byIQu3s3N9IB_ldZuE0qMgbr_tQToaUvS3A6xJNzhs_Hnq6iVfVIbpNDC2tUBTYx5k_oq9Z5ljz6PX7xYDayIknmCSDSJkYHYJcQ3XEHfZlJqiby29A-x7DYPMUPi2A6-pkIkGqihRo3RSh-tMQxc0LEVjmqaEOL",
        imageAlt: "An open-air courtyard with amphitheater steps and greenery.",
        quote:
          "An open-air amphitheater style courtyard that brings the community together in the evenings.",
        rating: "4.7",
        tags: ["Community", "Open Air"],
        tagClassName: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        title: "Tamarind Square Courtyard",
        zone: "Community Step",
      },
      {
        amenities: [
          { icon: "campaign", label: "Live" },
          { icon: "stroller", label: "Family" },
          { icon: "celebration", label: "Lively" },
        ],
        badge: "Public",
        badgeClassName: "bg-blue-600 text-white",
        hours: "Event Basis",
        image:
          "https://lh3.googleusercontent.com/aida/AP1WRLvlUJfVfhHFNyAVdodJgFkvlpfJLtggXHlCZq5R-hrAc8wM9X4VvV1CjUFpvR9NJqHplD4L2WWlac0raN_MGAmoHVYu-BJhiM-iiYbGbKjwMD7m5fauzK4CIh7V0JfRsiEOHe8RfkrYCL7mdLRMFAZ5Ad8apaOx05tORf4XtV1Gpo9Si8Ad-KVkPdi-qRcvhWJv62nl3haoaZJEwnyFOQqUdj3C_owISDu6H8UztaiaFxn6i9MM1bfNQuSg",
        imageAlt: "A vibrant public plaza used for markets, concerts, and gatherings.",
        quote: "Vibrant public square hosting concerts, markets, and lively social gatherings.",
        rating: "4.5",
        tags: ["Events", "Engagement"],
        tagClassName: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        title: "Event Plaza Tamarind",
        zone: "Plaza",
      },
    ],
  },
];

export default async function ExplorePage() {
  const user = await requireAuth("/explore");
  const { progress } = await getDashboardData();

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
        <ExploreSection section={sections[0]} />
        <InspirationPanel />
        {sections.slice(1).map((section) => (
          <ExploreSection key={section.title} section={section} />
        ))}
      </div>
      </div>
    </AppChrome>
  );
}

function ExploreSection({ section }: { section: SpaceSection }) {
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
        {section.cards.map((card) => (
          <ExploreCard card={card} key={card.title} />
        ))}
      </div>
    </section>
  );
}

function ExploreCard({ card }: { card: SpaceCard }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-[#161E2E] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full">
        <Image
          alt={card.imageAlt}
          className="object-cover"
          fill
          sizes="360px"
          src={card.image}
        />
        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${card.badgeClassName}`}
        >
          {card.badge}
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-md">
          <span
            className="material-symbols-outlined text-sm text-yellow-400"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          {card.rating}
        </div>
      </div>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="mb-1.5 text-xl font-bold text-white">{card.title}</h3>
        <p className="mb-3 text-xs text-slate-400">
          {card.hours} - {card.zone}
        </p>
        <p className="mb-4 line-clamp-2 text-sm italic leading-relaxed text-slate-300">
          &quot;{card.quote}&quot;
        </p>
        <div className="mb-5 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-medium ${card.tagClassName}`}
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mb-6 flex items-center gap-6 border-t border-slate-700/50 pt-5">
          {card.amenities.map((amenity) => (
            <div className="flex flex-col items-center" key={`${card.title}-${amenity.label}`}>
              <span className="material-symbols-outlined text-xl text-slate-400">
                {amenity.icon}
              </span>
              <span className="mt-0.5 text-[10px] text-slate-500">
                {amenity.label}
              </span>
            </div>
          ))}
        </div>
        <Link
          className="mt-auto block w-full rounded-lg bg-[#22D3EE] py-3 text-center text-sm font-bold text-[#0B1120] transition-all hover:bg-[#06B6D4] active:scale-95"
          href={spacePath()}
        >
          View Details
        </Link>
      </div>
    </article>
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
          <h3 className="mb-4 max-w-2xl text-2xl font-light italic leading-snug tracking-tight text-white md:text-4xl">
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRouteMotion } from "@/components/RouteMotion";

const noiseOptions = ["Quiet", "Moderate", "Lively", "Very Active"];
const vibeOptions = ["Deep Focus", "Collaborative", "Casual", "Socializing"];
const tagOptions = [
  "Quiet",
  "Good for studying",
  "Good for meeting people",
  "Too noisy",
  "Comfortable environment",
];

const tagQuestions: Record<string, string> = {
  "Good for studying": "What specific aspect helped your focus today?",
  "Good for meeting people": "Did you make any meaningful connections?",
  "Too noisy": "At what time did the noise become distracting?",
  "Comfortable environment":
    "What was your favorite comfort feature (e.g., seating, lighting, temp)?",
};

const comfortRatings: Record<string, number> = {
  Quiet: 5,
  Moderate: 4,
  Lively: 3,
  "Very Active": 2,
};

const socialRatings: Record<string, number> = {
  "Deep Focus": 2,
  Collaborative: 4,
  Casual: 3,
  Socializing: 5,
};

export function ReflectionForm({
  moodBefore,
  spaceId,
  visitId,
}: {
  moodBefore: string | null;
  spaceId: number;
  visitId: number;
}) {
  const router = useRouter();
  const [noise, setNoise] = useState("");
  const [vibe, setVibe] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thoughts, setThoughts] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activePrompt =
    tags.length === 0
      ? ""
      : tagQuestions[tags[tags.length - 1]] || "Tell us more about your visit...";

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  async function submitReflection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noise || !vibe) {
      window.alert("Please select a comfort level and social interaction.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reflections", {
        body: JSON.stringify({
          comfort_rating: comfortRatings[noise],
          learning_value_rating: learningRating(tags),
          mood_after: null,
          mood_before: moodBefore,
          reflection_text: buildReflectionText(thoughts, tags, activePrompt, followUp),
          social_rating: socialRatings[vibe],
          space_id: spaceId,
          visit_id: visitId,
          would_return: null,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(data.error || "Your reflection could not be submitted.");
        return;
      }

      startRouteMotion();
      router.push("/profile");
    } catch {
      window.alert("The reflection service is temporarily unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex-1" onSubmit={submitReflection}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h1 className="pb-1 text-3xl font-bold leading-tight tracking-tight text-on-surface">
              Post-Visit Reflection
            </h1>
            <p className="text-base font-normal leading-normal text-[#94A3B8]">
              Tell us about your experience in this space.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Your Thoughts
            </p>
            <textarea
              className="min-h-[140px] w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-1 focus:ring-primary"
              maxLength={5000}
              onChange={(event) => setThoughts(event.target.value)}
              placeholder="What did you like or dislike about this space?"
              value={thoughts}
            />
          </div>

          {activePrompt ? (
            <div className="space-y-3 transition-all duration-300">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
                {activePrompt}
              </p>
              <textarea
                className="min-h-[100px] w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-1 focus:ring-primary"
                onChange={(event) => setFollowUp(event.target.value)}
                placeholder="Type your answer here..."
                value={followUp}
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-8">
          <SelectionGroup
            label="Comfort Level"
            onSelect={setNoise}
            options={noiseOptions}
            selected={noise}
          />
          <SelectionGroup
            label="Social Interaction"
            onSelect={setVibe}
            options={vibeOptions}
            selected={vibe}
          />

          <div className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Quick Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <PillButton
                  active={tags.includes(tag)}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </PillButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <button
          aria-busy={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] py-5 font-bold text-[#0B1120] shadow-lg transition-all hover:brightness-110 active:scale-[0.99]"
          disabled={isSubmitting}
          type="submit"
        >
          Submit Feedback
        </button>
      </div>
    </form>
  );
}

function SelectionGroup({
  label,
  onSelect,
  options,
  selected,
}: {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  selected: string;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-low p-5">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <PillButton
            active={selected === option}
            key={option}
            onClick={() => onSelect(selected === option ? "" : option)}
          >
            {option}
          </PillButton>
        ))}
      </div>
    </div>
  );
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
        active
          ? "border-[#22D3EE] bg-[#22D3EE] text-[#0B1120] shadow-[0_0_12px_rgba(34,211,238,0.3)]"
          : "border-transparent bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function learningRating(tags: string[]) {
  if (tags.includes("Good for studying")) return 5;
  if (tags.includes("Too noisy")) return 2;
  if (tags.includes("Comfortable environment")) return 4;
  return 3;
}

function buildReflectionText(
  thoughts: string,
  tags: string[],
  activePrompt: string,
  followUp: string,
) {
  const sections = [thoughts.trim()];
  if (tags.length) sections.push(`Tags: ${tags.join(", ")}`);
  if (activePrompt && followUp.trim()) {
    sections.push(`${activePrompt}\n${followUp.trim()}`);
  }
  return sections.filter(Boolean).join("\n\n") || null;
}

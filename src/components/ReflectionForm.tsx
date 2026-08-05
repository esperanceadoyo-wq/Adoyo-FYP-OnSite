"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export function ReflectionForm({ spaceName }: { spaceName: string }) {
  const router = useRouter();
  const [noise, setNoise] = useState("");
  const [vibe, setVibe] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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

  return (
    <form
      className="flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/profile");
      }}
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h1 className="pb-1 text-3xl font-bold leading-tight tracking-tight text-white">
              Post-Visit Reflection
            </h1>
            <p className="text-base font-normal leading-normal text-[#94A3B8]">
              Tell us about your experience at {spaceName}.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Your Thoughts
            </p>
            <textarea
              className="min-h-[140px] w-full resize-none rounded-xl border border-[#1E293B] bg-[#0B1120] p-4 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="What did you like or dislike about this space?"
            />
          </div>

          {activePrompt ? (
            <div className="space-y-3 transition-all duration-300">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
                {activePrompt}
              </p>
              <textarea
                className="min-h-[100px] w-full resize-none rounded-xl border border-[#1E293B] bg-[#0B1120] p-4 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Type your answer here..."
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

          <div className="space-y-4 rounded-xl border border-[#1E293B] bg-[#161E2E] p-5">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22D3EE] py-5 font-bold text-[#0B1120] shadow-lg transition-all hover:brightness-110 active:scale-[0.99]"
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
    <div className="space-y-4 rounded-xl border border-[#1E293B] bg-[#161E2E] p-5">
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
          : "border-transparent bg-[#1E293B] text-white hover:bg-[#334155]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

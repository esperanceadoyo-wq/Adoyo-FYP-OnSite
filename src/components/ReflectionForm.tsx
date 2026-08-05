"use client";

import Link from "next/link";
import { useState } from "react";

const moodOptions = [
  { label: "Calm", value: "calm" },
  { label: "Focused", value: "focused" },
  { label: "Energized", value: "energized" },
  { label: "Connected", value: "connected" },
  { label: "Tired", value: "tired" },
];

type ReflectionResponse = {
  error?: string;
  reflection?: { id: number };
};

export function ReflectionForm({
  moodBefore,
  spaceId,
  spaceName,
  visitId,
}: {
  moodBefore: string | null;
  spaceId: number;
  spaceName: string;
  visitId: number;
}) {
  const [comfortRating, setComfortRating] = useState<number | null>(null);
  const [socialRating, setSocialRating] = useState<number | null>(null);
  const [learningRating, setLearningRating] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reflectionId, setReflectionId] = useState<number | null>(null);

  async function submitReflection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      comfortRating === null ||
      socialRating === null ||
      learningRating === null ||
      wouldReturn === null
    ) {
      setError("Complete all three ratings and choose whether you would return.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reflections", {
        body: JSON.stringify({
          comfort_rating: comfortRating,
          learning_value_rating: learningRating,
          mood_after: moodAfter || null,
          mood_before: moodBefore,
          reflection_text: reflectionText.trim() || null,
          social_rating: socialRating,
          space_id: spaceId,
          visit_id: visitId,
          would_return: wouldReturn,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as ReflectionResponse;

      if (!response.ok || !data.reflection) {
        setError(data.error || "Your reflection could not be submitted.");
        return;
      }

      setReflectionId(data.reflection.id);
    } catch {
      setError("The reflection service is temporarily unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (reflectionId !== null) {
    return (
      <section className="flex min-h-96 flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-white">
          Reflection submitted
        </h1>
        <p className="mt-3 max-w-md leading-relaxed text-[#94A3B8]">
          Your reflection for {spaceName} has been recorded and your progress has
          been updated.
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-primary">
          Reflection #{reflectionId}
        </p>
        <div className="mt-8 flex w-full max-w-sm gap-3">
          <Link
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#334155] font-bold text-white"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary font-bold text-[#0B1120]"
            href="/profile"
          >
            View Progress
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form className="flex-1" onSubmit={submitReflection}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h1 className="pb-1 text-3xl font-bold leading-tight text-white">
              Post-Visit Reflection
            </h1>
            <p className="text-base text-[#94A3B8]">
              Tell us about your experience at {spaceName}.
            </p>
          </div>

          <RatingControl
            label="Comfort Level"
            onChange={setComfortRating}
            selected={comfortRating}
          />
          <RatingControl
            label="Social Experience"
            onChange={setSocialRating}
            selected={socialRating}
          />
          <RatingControl
            label="Learning Value"
            onChange={setLearningRating}
            selected={learningRating}
          />
        </div>

        <div className="space-y-6">
          <label className="block space-y-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              How do you feel now?
            </span>
            <select
              className="h-12 w-full rounded-xl border border-[#334155] bg-[#161E2E] px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
              onChange={(event) => setMoodAfter(event.target.value)}
              value={moodAfter}
            >
              <option value="">Select a mood</option>
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Your Thoughts
            </span>
            <textarea
              className="min-h-36 w-full resize-none rounded-xl border border-[#334155] bg-[#161E2E] p-4 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
              maxLength={5000}
              onChange={(event) => setReflectionText(event.target.value)}
              placeholder="What helped, what felt difficult, or what would you change?"
              value={reflectionText}
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Would you return?
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                active={wouldReturn === true}
                label="Yes"
                onClick={() => setWouldReturn(true)}
              />
              <ChoiceButton
                active={wouldReturn === false}
                label="No"
                onClick={() => setWouldReturn(false)}
              />
            </div>
          </fieldset>
        </div>
      </div>

      {error ? (
        <p aria-live="polite" className="mt-6 text-center text-sm font-medium text-error">
          {error}
        </p>
      ) : null}

      <button
        className="mt-8 flex w-full items-center justify-center rounded-xl bg-primary py-4 font-bold text-[#0B1120] shadow-lg transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Submitting reflection..." : "Submit Reflection"}
      </button>
    </form>
  );
}

function RatingControl({
  label,
  onChange,
  selected,
}: {
  label: string;
  onChange: (value: number) => void;
  selected: number | null;
}) {
  return (
    <fieldset className="rounded-xl border border-[#1E293B] bg-[#161E2E] p-5">
      <legend className="px-1 text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            aria-label={`${label}: ${value} out of 5`}
            aria-pressed={selected === value}
            className={`h-10 rounded-lg border text-sm font-bold transition-colors ${
              selected === value
                ? "border-primary bg-primary text-[#0B1120]"
                : "border-[#334155] bg-[#0B1120] text-white hover:border-primary"
            }`}
            key={value}
            onClick={() => onChange(value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </fieldset>
  );
}

function ChoiceButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`h-11 rounded-xl border text-sm font-bold transition-colors ${
        active
          ? "border-primary bg-primary text-[#0B1120]"
          : "border-[#334155] bg-[#161E2E] text-white hover:border-primary"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

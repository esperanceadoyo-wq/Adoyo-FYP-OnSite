"use client";

import { useState } from "react";

export function SaveSpaceButton({
  initialSaved,
  spaceId,
}: {
  initialSaved: boolean;
  spaceId: number;
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isSaving, setIsSaving] = useState(false);

  async function toggleSaved() {
    setIsSaving(true);
    try {
      const response = await fetch(
        isSaved ? `/api/saved-spaces/${spaceId}` : "/api/saved-spaces",
        isSaved
          ? { method: "DELETE" }
          : {
              body: JSON.stringify({ space_id: spaceId }),
              headers: { "content-type": "application/json" },
              method: "POST",
            },
      );
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(data.error || "This space could not be updated.");
        return;
      }

      setIsSaved((current) => !current);
    } catch {
      window.alert("Could not reach the backend. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      aria-pressed={isSaved}
      className="flex items-center gap-2 rounded-xl border border-primary px-8 py-3 font-bold text-primary transition-all hover:bg-primary/10 disabled:opacity-60"
      disabled={isSaving}
      onClick={toggleSaved}
      type="button"
    >
      <span className="material-symbols-outlined">bookmark</span>
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}

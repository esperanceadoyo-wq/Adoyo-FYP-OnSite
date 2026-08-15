import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { getSavedSpaces } from "@/lib/saved-spaces";
import { requireAuth } from "@/lib/server-auth";
import { SavedPageClient } from "./saved-page-client";

export const metadata: Metadata = {
  title: "Saved Pages",
};

export default async function SavedPage() {
  const user = await requireAuth("/saved");
  const [{ progress }, savedResult] = await Promise.all([
    getDashboardData(),
    getSavedSpaces(),
  ]);

  return (
    <AppChrome activeHref="/saved" progress={progress} user={user}>
      <SavedPageClient
        initialError={savedResult.error}
        initialItems={savedResult.savedSpaces}
      />
    </AppChrome>
  );
}

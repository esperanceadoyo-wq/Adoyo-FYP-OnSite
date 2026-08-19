import type { Metadata } from "next";
import { AppChrome } from "@/features/navigation/components/AppChrome";
import { getDashboardData } from "@/features/dashboard/dashboard-data";
import { getSavedSpaces } from "@/features/saved/saved-spaces";
import { requireAuth } from "@/features/auth/server-auth";
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

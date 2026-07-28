import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { SavedPageClient } from "./saved-page-client";

export const metadata: Metadata = {
  title: "Saved Pages | OnSite",
};

export default async function SavedPage() {
  const user = await requireAuth("/saved");
  const { progress } = await getDashboardData();

  return (
    <AppChrome activeHref="/saved" progress={progress} user={user}>
      <SavedPageClient />
    </AppChrome>
  );
}

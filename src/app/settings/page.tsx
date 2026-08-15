import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { SettingsPageClient } from "./settings-page-client";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requireAuth("/settings");
  const { profile, progress } = await getDashboardData();

  return (
    <AppChrome activeHref="/settings" progress={progress} user={user}>
      <SettingsPageClient
        activityVisible={profile?.activity_visible ?? false}
        email={user.email}
        leaderboardVisible={profile?.leaderboard_visible ?? true}
        locationConsent={profile?.location_consent ?? false}
        name={user.name}
      />
    </AppChrome>
  );
}

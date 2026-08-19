import type { Metadata } from "next";
import { AppChrome } from "@/features/navigation/components/AppChrome";
import { getDashboardData } from "@/features/dashboard/dashboard-data";
import { requireAuth } from "@/features/auth/server-auth";
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

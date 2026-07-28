import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { SettingsPageClient } from "./settings-page-client";

export const metadata: Metadata = {
  title: "Settings | OnSite",
};

export default async function SettingsPage() {
  const user = await requireAuth("/settings");
  const { progress } = await getDashboardData();

  return (
    <AppChrome activeHref="/settings" progress={progress} user={user}>
      <SettingsPageClient email={user.email} name={user.name} />
    </AppChrome>
  );
}

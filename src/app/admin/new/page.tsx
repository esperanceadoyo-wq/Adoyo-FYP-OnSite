import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAuth } from "@/lib/server-auth";
import { AddLocationForm } from "./add-location-form";

export const metadata: Metadata = {
  title: "Add New Space | OnSite",
};

export default async function AddNewLocationPage() {
  const user = await requireAuth("/admin/new");
  const { progress } = await getDashboardData();

  return (
    <AppChrome activeHref="/admin" progress={progress} user={user}>
      <AddLocationForm />
    </AppChrome>
  );
}

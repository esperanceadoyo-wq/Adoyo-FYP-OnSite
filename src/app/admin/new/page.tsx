import type { Metadata } from "next";
import { AppChrome } from "@/features/navigation/components/AppChrome";
import { getDashboardData } from "@/features/dashboard/dashboard-data";
import { requireAdmin } from "@/features/auth/server-auth";
import { AddLocationForm } from "./add-location-form";

export const metadata: Metadata = {
  title: "Add New Space",
};

export default async function AddNewLocationPage() {
  const user = await requireAdmin("/admin/new");
  const { progress } = await getDashboardData();

  return (
    <AppChrome activeHref="/admin" progress={progress} user={user}>
      <AddLocationForm />
    </AppChrome>
  );
}

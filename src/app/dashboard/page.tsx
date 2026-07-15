import type { Metadata } from "next";
import { StaticRoute } from "@/components/StaticRoute";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <StaticRoute pageKey="dashboard" />;
}

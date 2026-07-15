import type { Metadata } from "next";
import { StaticRoute } from "@/components/StaticRoute";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return <StaticRoute pageKey="privacy" />;
}

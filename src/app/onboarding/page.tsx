import type { Metadata } from "next";
import { StaticRoute } from "@/components/StaticRoute";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function OnboardingPage() {
  return <StaticRoute pageKey="onboarding" />;
}

import type { Metadata } from "next";
import { StaticRoute } from "@/components/StaticRoute";

export const metadata: Metadata = {
  title: "About OnSite - Our Story",
};

export default function AboutPage() {
  return <StaticRoute pageKey="about" />;
}

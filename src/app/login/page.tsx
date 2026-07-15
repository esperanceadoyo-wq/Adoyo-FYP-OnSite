import type { Metadata } from "next";
import { StaticRoute } from "@/components/StaticRoute";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return <StaticRoute pageKey="login" />;
}

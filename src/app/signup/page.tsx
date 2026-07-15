import type { Metadata } from "next";
import { StaticRoute } from "@/components/StaticRoute";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return <StaticRoute pageKey="signup" />;
}

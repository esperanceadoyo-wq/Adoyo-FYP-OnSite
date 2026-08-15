import type { Metadata } from "next";
import { AuthRecoveryShell } from "@/components/AuthRecoveryShell";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthRecoveryShell
      description="Enter your account email and we will prepare a secure reset link."
      icon="lock_reset"
      title="Reset your password"
    >
      <ForgotPasswordForm />
    </AuthRecoveryShell>
  );
}

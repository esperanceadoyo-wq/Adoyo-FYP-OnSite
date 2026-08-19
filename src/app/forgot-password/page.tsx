import type { Metadata } from "next";
import { AuthRecoveryShell } from "@/features/auth/components/AuthRecoveryShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

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

import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRecoveryShell } from "@/components/AuthRecoveryShell";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <AuthRecoveryShell
      description="Choose a strong new password for your OnSite account."
      icon="password"
      title="Choose a new password"
    >
      <Suspense fallback={<p className="text-center text-sm text-slate-400">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthRecoveryShell>
  );
}

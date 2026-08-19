"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { passwordRules, validatePassword } from "@/features/auth/auth";

type ResetResponse = { error?: string; message?: string };

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("This reset link is missing its security token.");
      return;
    }
    if (!validatePassword(password) || password !== confirmation) {
      setError("Use a valid password and make sure both entries match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        body: JSON.stringify({ password, token }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as ResetResponse;
      if (!response.ok) {
        setError(data.error || "We could not reset your password.");
        return;
      }
      setSuccess(data.message || "Your password has been updated.");
    } catch {
      setError("Could not reach the auth server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          {success}
        </p>
        <a className="block w-full rounded-xl bg-primary py-4 font-bold text-white" href="/login">
          Return to Login
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <PasswordInput
        label="New Password"
        onChange={setPassword}
        onToggle={() => setShowPassword((current) => !current)}
        show={showPassword}
        value={password}
      />
      <PasswordInput
        label="Confirm New Password"
        onChange={setConfirmation}
        onToggle={() => setShowConfirmation((current) => !current)}
        show={showConfirmation}
        value={confirmation}
      />
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {passwordRules.map((rule) => (
          <p className={`text-xs font-medium ${rule.test(password) ? "text-primary" : "text-slate-400"}`} key={rule.label}>
            {rule.test(password) ? "[x]" : "[ ]"} {rule.label}
          </p>
        ))}
      </div>
      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">{error}</p>
      ) : null}
      <button className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Updating password..." : "Update Password"}
      </button>
    </form>
  );
}

function PasswordInput({ label, onChange, onToggle, show, value }: { label: string; onChange: (value: string) => void; onToggle: () => void; show: boolean; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <div className="relative flex items-center">
        <input autoComplete="new-password" className="form-input h-14 w-full rounded-xl border border-slate-200 bg-white p-[15px] pr-12 text-base text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" onChange={(event) => onChange(event.target.value)} required type={show ? "text" : "password"} value={value} />
        <button aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={show} className="absolute right-4 text-slate-400 hover:text-primary" onClick={onToggle} type="button">
          <span className="material-symbols-outlined">{show ? "visibility_off" : "visibility"}</span>
        </button>
      </div>
    </div>
  );
}

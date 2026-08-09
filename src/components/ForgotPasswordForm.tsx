"use client";

import { useState } from "react";
import { validateEmail } from "@/lib/auth";

type ForgotPasswordResponse = {
  error?: string;
  message?: string;
  reset_path?: string;
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetPath, setResetPath] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");
    setResetPath("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        body: JSON.stringify({ email }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as ForgotPasswordResponse;

      if (!response.ok) {
        setError(data.error || "We could not start the password reset.");
        return;
      }

      setMessage(data.message || "Password reset instructions are ready.");
      setResetPath(data.reset_path || "");
    } catch {
      setError("Could not reach the auth server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <input
          autoComplete="email"
          className="form-input h-14 w-full rounded-xl border border-slate-200 bg-white p-[15px] text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          placeholder="name@company.com"
          required
          type="email"
          value={email}
        />
      </div>

      {error ? <StatusMessage error>{error}</StatusMessage> : null}
      {message ? <StatusMessage>{message}</StatusMessage> : null}

      {resetPath ? (
        <a
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-3 font-bold text-primary transition-colors hover:bg-primary/20"
          href={resetPath}
        >
          Continue to reset password
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </a>
      ) : null}

      <button
        className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Preparing reset..." : "Reset Password"}
      </button>
    </form>
  );
}

function StatusMessage({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <p
      className={`rounded-xl border px-3 py-2 text-sm font-medium ${
        error
          ? "border-red-500/30 bg-red-500/10 text-red-500"
          : "border-primary/30 bg-primary/10 text-slate-700 dark:text-slate-200"
      }`}
    >
      {children}
    </p>
  );
}

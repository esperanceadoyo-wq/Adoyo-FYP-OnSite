"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_NOTICE_KEY } from "@/components/AuthWelcomeToast";
import { PasswordVisibilityButton } from "@/components/PasswordVisibilityButton";
import { startRouteMotion } from "@/components/RouteMotion";
import { validateEmail, type AuthResponse } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateEmail(email) || password.length === 0) {
      setError("Enter a valid email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email, password }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as AuthResponse;

      if (!response.ok || !data.user) {
        setError(data.error || "We could not sign you in.");
        return;
      }

      sessionStorage.setItem(
        AUTH_NOTICE_KEY,
        JSON.stringify({ message: `Welcome back, ${data.user.name}!` }),
      );
      window.dispatchEvent(new Event(AUTH_NOTICE_KEY));
      startRouteMotion();
      router.push(searchParams.get("next") || "/dashboard", {
        transitionTypes: ["auth-success"],
      });
      router.refresh();
    } catch {
      setError("Could not reach the auth server. Please start the backend and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5 px-8 py-6" method="POST" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col">
        <label className="ml-1 pb-2 text-sm font-semibold leading-normal text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <input
          autoComplete="email"
          className="form-input flex h-14 w-full rounded-xl border border-slate-200 bg-white p-[15px] text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
          name="email"
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

      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between pb-2">
          <label className="ml-1 text-sm font-semibold leading-normal text-slate-700 dark:text-slate-300">
            Password
          </label>
          <a
            className="text-sm font-semibold text-primary hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative flex w-full items-center">
          <input
            autoComplete="current-password"
            className="form-input flex h-14 w-full rounded-xl border border-slate-200 bg-white p-[15px] pr-20 text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
            name="password"
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <PasswordVisibilityButton
            isVisible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
          {error}
        </p>
      ) : null}

      <div className="pt-4">
        <button
          className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-primary/20"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Log In"}
        </button>
      </div>
    </form>
  );
}

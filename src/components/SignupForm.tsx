"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_NOTICE_KEY } from "@/components/AuthWelcomeToast";
import { PasswordVisibilityButton } from "@/components/PasswordVisibilityButton";
import { startRouteMotion } from "@/components/RouteMotion";
import {
  passwordRules,
  validateEmail,
  validateName,
  validatePassword,
  type AuthResponse,
} from "@/lib/auth";

type SignupFields = {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
};

const initialFields: SignupFields = {
  confirmPassword: "",
  email: "",
  name: "",
  password: "",
};

export function SignupForm() {
  const router = useRouter();
  const [fields, setFields] = useState(initialFields);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch =
    fields.confirmPassword.length === 0 ||
    fields.password === fields.confirmPassword;
  const isValid = useMemo(
    () =>
      validateName(fields.name) &&
      validateEmail(fields.email) &&
      validatePassword(fields.password) &&
      fields.password === fields.confirmPassword,
    [fields],
  );

  function updateField(field: keyof SignupFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      setError("Please complete the highlighted requirements before signing up.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        body: JSON.stringify({
          email: fields.email,
          name: fields.name,
          password: fields.password,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as AuthResponse;

      if (!response.ok || !data.user) {
        setError(data.error || "We could not create your account.");
        return;
      }

      sessionStorage.setItem(
        AUTH_NOTICE_KEY,
        JSON.stringify({ message: `Welcome to OnSite, ${data.user.name}!` }),
      );
      window.dispatchEvent(new Event(AUTH_NOTICE_KEY));
      startRouteMotion();
      router.push(`/onboarding?name=${encodeURIComponent(data.user.name)}`, {
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
    <form className="space-y-4" method="POST" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Full Name
        </label>
        <input
          autoComplete="name"
          className="form-input h-12 w-full rounded-xl border border-slate-200 bg-white p-3 text-base font-normal text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
          name="full_name"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="John Doe"
          required
          type="text"
          value={fields.name}
        />
        {fields.name && !validateName(fields.name) ? (
          <p className="mt-1 text-xs font-medium text-red-500">
            Name must be at least 2 characters.
          </p>
        ) : null}
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <input
          autoComplete="email"
          className="form-input h-12 w-full rounded-xl border border-slate-200 bg-white p-3 text-base font-normal text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="name@university.edu"
          required
          type="email"
          value={fields.email}
        />
        {fields.email && !validateEmail(fields.email) ? (
          <p className="mt-1 text-xs font-medium text-red-500">
            Enter a valid email address.
          </p>
        ) : null}
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            autoComplete="new-password"
            className="form-input h-12 w-full rounded-xl border border-slate-200 bg-white p-3 pr-20 text-base font-normal text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            name="password"
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Create a password"
            required
            type={showPassword ? "text" : "password"}
            value={fields.password}
          />
          <PasswordVisibilityButton
            isVisible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
        </div>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {passwordRules.map((rule) => {
            const passed = rule.test(fields.password);

            return (
              <p
                className={`text-xs font-medium ${
                  passed ? "text-primary" : "text-slate-400 dark:text-slate-500"
                }`}
                key={rule.label}
              >
                {passed ? "[x]" : "[ ]"} {rule.label}
              </p>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Confirm Password
        </label>
        <div className="relative flex items-center">
          <input
            autoComplete="new-password"
            className="form-input h-12 w-full rounded-xl border border-slate-200 bg-white p-3 pr-20 text-base font-normal text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            name="confirm_password"
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder="Confirm your password"
            required
            type={showConfirmPassword ? "text" : "password"}
            value={fields.confirmPassword}
          />
          <PasswordVisibilityButton
            isVisible={showConfirmPassword}
            label="confirmed password"
            onToggle={() => setShowConfirmPassword((current) => !current)}
          />
        </div>
        {!passwordsMatch ? (
          <p className="mt-1 text-xs font-medium text-red-500">
            Passwords must match.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
          {error}
        </p>
      ) : null}

      <div className="pt-2">
        <button
          className="w-full rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
}

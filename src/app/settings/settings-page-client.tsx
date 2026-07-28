"use client";

import { useState } from "react";

export function SettingsPageClient({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="relative overflow-hidden text-[#F8FAFC] antialiased">
      <div className="pointer-events-none fixed right-[-10%] top-[-10%] -z-0 h-[500px] w-[500px] rounded-full bg-[#22D3EE]/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] -z-0 h-[400px] w-[400px] rounded-full bg-[#22D3EE]/5 blur-[100px]" />

      <div className="relative z-10 flex w-full justify-center">
        <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
            Settings
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Manage account details, visual preferences, and privacy controls.
          </p>
        </div>
        <section className="rounded-2xl bg-[#161E2E] p-6 shadow-lg">
          <SectionHeader icon="account_circle" title="Account Settings" />
          <div className="space-y-5">
            <Field label="Account Name">
              <input
                className={inputClassName}
                defaultValue={name}
                placeholder="Enter display name"
                type="text"
              />
            </Field>
            <Field label="Email Address">
              <input
                className={inputClassName}
                defaultValue={email}
                placeholder="Enter email address"
                type="email"
              />
            </Field>
            <Field label="Change Password">
              <input
                className={inputClassName}
                placeholder="Enter new password"
                type="password"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl bg-[#161E2E] p-6 shadow-lg">
          <SectionHeader icon="palette" title="Preferences" />
          <div className="flex flex-col gap-4 rounded-xl bg-[#0B1120]/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-[#F8FAFC]">Visual Theme</p>
              <p className="text-sm text-[#94A3B8]">
                Switch between Light and Dark mode
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#334155] bg-[#0B1120] p-1">
              <ThemeButton
                active={theme === "light"}
                icon="light_mode"
                label="Light"
                onClick={() => setTheme("light")}
              />
              <ThemeButton
                active={theme === "dark"}
                icon="dark_mode"
                label="Dark"
                onClick={() => setTheme("dark")}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#161E2E] p-6 shadow-lg">
          <SectionHeader icon="shield" title="Privacy Settings" />
          <div className="space-y-4">
            <ToggleRow
              defaultChecked
              description="Allow your ranking and XP to be visible to the community."
              id="leaderboard"
              title="Show on Leaderboard"
            />
            <div className="h-px bg-[#334155]/30" />
            <ToggleRow
              description="Let others see when you are currently active on the platform."
              id="activity"
              title="Show activity status"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-4">
          <button className="w-full rounded-xl bg-[#22D3EE] py-4 font-bold text-[#0B1120] shadow-[0_8px_30px_rgb(34,211,238,0.2)] transition-all hover:bg-[#22D3EE]/90 active:scale-[0.98]">
            Save Changes
          </button>
          <button className="w-full rounded-xl border border-[#334155] bg-transparent py-3 font-medium text-[#94A3B8] transition-all hover:bg-white/5">
            Reset to Default
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-[#334155] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition-all placeholder:text-slate-500 focus:border-[#22D3EE] focus:shadow-[0_0_0_2px_rgba(34,211,238,0.2)]";

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-[#22D3EE]">{icon}</span>
      <h2 className="text-lg font-semibold text-[#F8FAFC]">{title}</h2>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ThemeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
        active
          ? "bg-[#22D3EE] text-[#0B1120] shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          : "text-[#94A3B8]"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </button>
  );
}

function ToggleRow({
  defaultChecked = false,
  description,
  id,
  title,
}: {
  defaultChecked?: boolean;
  description: string;
  id: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="max-w-[80%]">
        <p className="font-medium text-[#F8FAFC]">{title}</p>
        <p className="text-sm text-[#94A3B8]">{description}</p>
      </div>
      <label className="relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center">
        <input
          className="peer sr-only"
          defaultChecked={defaultChecked}
          id={id}
          type="checkbox"
        />
        <span className="absolute inset-0 rounded-full bg-[#334155] transition-colors duration-300 peer-checked:bg-[#22D3EE]" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[#F8FAFC] transition-transform duration-300 peer-checked:translate-x-6 peer-checked:bg-[#0B1120]" />
      </label>
    </div>
  );
}

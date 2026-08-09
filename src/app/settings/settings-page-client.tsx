"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { applyTheme, useTheme } from "@/lib/theme";

export function SettingsPageClient({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const theme = useTheme();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarStatus, setAvatarStatus] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  function selectAvatar(file: File | undefined) {
    setAvatarStatus("");
    setAvatarError(false);
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarStatus("Choose a JPG, PNG, or WebP image.");
      setAvatarError(true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarStatus("Profile pictures must be 5 MB or smaller.");
      setAvatarError(true);
      return;
    }

    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function uploadAvatar() {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    setAvatarStatus("Uploading profile picture...");
    setAvatarError(false);

    try {
      const body = new FormData();
      body.append("avatar", avatarFile);
      const response = await fetch("/api/profile/avatar", { body, method: "POST" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setAvatarStatus(data.error || "Could not upload the profile picture.");
        setAvatarError(true);
        return;
      }

      setAvatarStatus("Profile picture updated.");
      window.setTimeout(() => window.location.reload(), 400);
    } catch {
      setAvatarStatus("Could not reach the backend. Please try again.");
      setAvatarError(true);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <div className="relative overflow-hidden text-on-background antialiased">
      <div className="relative z-10 flex w-full justify-center">
        <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Settings
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Manage account details, visual preferences, and privacy controls.
          </p>
        </div>
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <SectionHeader icon="account_circle" title="Account Settings" />
          <div className="space-y-5">
            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <UserAvatar
                  className="h-20 w-20 rounded-full border-2 border-primary/50 text-xl"
                  key={avatarPreview || "saved-avatar"}
                  name={name}
                  sizes="80px"
                  src={avatarPreview || undefined}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-on-surface">Change Profile Picture</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Upload a JPG, PNG, or WebP image up to 5 MB.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label
                      className="cursor-pointer rounded-lg border border-primary/50 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                      htmlFor="profile-picture"
                    >
                      Choose Image
                    </label>
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      id="profile-picture"
                      onChange={(event) => selectAvatar(event.target.files?.[0])}
                      type="file"
                    />
                    {avatarFile ? (
                      <button
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary disabled:opacity-60"
                        disabled={isUploadingAvatar}
                        onClick={uploadAvatar}
                        type="button"
                      >
                        {isUploadingAvatar ? "Uploading..." : "Upload Picture"}
                      </button>
                    ) : null}
                  </div>
                  {avatarStatus ? (
                    <p
                      aria-live="polite"
                      className={`mt-2 text-sm font-medium ${
                        avatarError ? "text-error" : "text-primary"
                      }`}
                    >
                      {avatarStatus}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
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

        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <SectionHeader icon="palette" title="Preferences" />
          <div className="flex flex-col gap-4 rounded-xl bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-on-surface">Visual Theme</p>
              <p className="text-sm text-on-surface-variant">
                Switch between Light and Dark mode
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-outline bg-surface-container-lowest p-1">
              <ThemeButton
                active={theme === "light"}
                icon="light_mode"
                label="Light"
                onClick={() => applyTheme("light")}
              />
              <ThemeButton
                active={theme === "dark"}
                icon="dark_mode"
                label="Dark"
                onClick={() => applyTheme("dark")}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <SectionHeader icon="shield" title="Privacy Settings" />
          <div className="space-y-4">
            <ToggleRow
              defaultChecked
              description="Allow your ranking and XP to be visible to the community."
              id="leaderboard"
              title="Show on Leaderboard"
            />
            <div className="h-px bg-outline-variant" />
            <ToggleRow
              description="Let others see when you are currently active on the platform."
              id="activity"
              title="Show activity status"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-4">
          <button className="w-full rounded-xl bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]">
            Save Changes
          </button>
          <button className="w-full rounded-xl border border-outline bg-transparent py-3 font-medium text-on-surface-variant transition-all hover:bg-surface-container-low">
            Reset to Default
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20";

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
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
      <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
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
          ? "bg-primary text-on-primary shadow-md shadow-primary/20"
          : "text-on-surface-variant"
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
        <p className="font-medium text-on-surface">{title}</p>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      <label className="relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center">
        <input
          className="peer sr-only"
          defaultChecked={defaultChecked}
          id={id}
          type="checkbox"
        />
        <span className="absolute inset-0 rounded-full bg-outline transition-colors duration-300 peer-checked:bg-primary" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface-container-lowest shadow-sm transition-transform duration-300 peer-checked:translate-x-6" />
      </label>
    </div>
  );
}

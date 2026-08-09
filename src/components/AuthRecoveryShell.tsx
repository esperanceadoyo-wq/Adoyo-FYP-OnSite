import type { ReactNode } from "react";
import { PageShell } from "@/components/PageShell";

type AuthRecoveryShellProps = {
  children: ReactNode;
  description: string;
  icon: string;
  title: string;
};

export function AuthRecoveryShell({
  children,
  description,
  icon,
  title,
}: AuthRecoveryShellProps) {
  return (
    <PageShell bodyClassName="page-login flex min-h-screen items-center justify-center p-4 font-display">
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-transparent bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl">
        <button
          aria-label="Toggle dark mode"
          className="theme-toggle"
          id="theme-toggle-btn"
          type="button"
        >
          <span className="material-symbols-outlined icon-sun text-slate-500">light_mode</span>
          <span className="material-symbols-outlined icon-moon text-slate-300">dark_mode</span>
        </button>

        <div className="px-8 pt-6">
          <a
            className="flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
            href="/login"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to login
          </a>
        </div>

        <div className="px-8 pb-2 pt-8 text-center">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 54 }}>
            {icon}
          </span>
          <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="px-8 pb-8 pt-5">{children}</div>
      </div>
    </PageShell>
  );
}

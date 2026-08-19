import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { PageShell } from "@/shared/components/PageShell";

export const metadata: Metadata = {
  title: "Log In",
};

export default function Page() {
  return (
    <PageShell bodyClassName={"page-login font-display min-h-screen flex items-center justify-center p-4"}>
      <>
      <div className={"relative w-full max-w-[480px] bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden"}>

        <button className={"theme-toggle"} id={"theme-toggle-btn"} aria-label={"Toggle dark mode"} type={"button"}>

          <span className={"material-symbols-outlined icon-sun text-slate-500"}>light_mode</span>

          <span className={"material-symbols-outlined icon-moon text-slate-300"}>dark_mode</span>

        </button>

        <div className={"px-8 pt-6"}>
          <a data-navigate="/" href={"/"} className={"flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors text-sm font-medium"}>
            <span className={"material-symbols-outlined text-base"}>arrow_back</span>Back
          </a>
        </div>

        <div className={"flex flex-col items-center pt-8 pb-2"}>

          <div className={"flex h-20 items-center justify-center"}>
            <BrandLogo className="h-14 w-52" priority />
          </div>

        </div>

        <div className={"px-8 pt-4 pb-4 text-center"}>

          <h1 className={"text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2"}>Welcome Back</h1>

          <p className={"text-slate-600 dark:text-slate-400 text-base font-normal leading-normal"}>Enter your credentials to access your OnSite account</p>

          <div className={"mt-4 flex justify-center"}>
            <span className={"material-symbols-outlined text-primary"} style={{ fontSize: "64px" }}>admin_panel_settings</span>
          </div>
        </div>

        <Suspense fallback={<div className="px-8 py-6 text-sm text-slate-400">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className={"px-8"}>
          <div className={"flex items-center gap-4 py-2"}>

            <div className={"h-px bg-slate-200 dark:bg-slate-800 flex-1"}></div>

            <span className={"text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider"}>Or</span>

            <div className={"h-px bg-slate-200 dark:bg-slate-800 flex-1"}></div>

          </div>

          <div className={"text-center pb-4"}>

            <p className={"text-slate-600 dark:text-slate-400 text-sm"}>
                    Don&apos;t have an account? 
                    
              <a className={"text-primary font-bold hover:underline ml-1"} data-navigate="/signup" href={"/signup"}>Create account</a>

            </p>

          </div>
        </div>

      </div>
      </>
    </PageShell>
  );
}

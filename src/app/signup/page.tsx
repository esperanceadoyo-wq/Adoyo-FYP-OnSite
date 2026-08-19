import type { Metadata } from "next";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { PageShell } from "@/shared/components/PageShell";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <PageShell bodyClassName={"page-signup flex items-center justify-center min-h-screen p-4"}>
      <>
      <div className={"w-full max-w-md relative"}>

        <div className={"glass-card rounded-[2rem] shadow-2xl p-8 md:p-10 border border-white/20 dark:border-white/10 relative"}>

          <button className={"theme-toggle"} id={"theme-toggle-btn"} aria-label={"Toggle dark mode"} type={"button"}>

            <span className={"material-symbols-outlined icon-sun text-slate-500"}>light_mode</span>

            <span className={"material-symbols-outlined icon-moon text-slate-300"}>dark_mode</span>

          </button>

          <div className={"pb-4"}>
            <a data-navigate="/" href={"/"} className={"flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors text-sm font-medium"}>
              <span className={"material-symbols-outlined text-base"}>arrow_back</span>Back
            </a>
          </div>

          <div className={"text-center pb-6"}>

            <div className="mb-3 flex justify-center">
              <BrandLogo className="h-12 w-44" priority />
            </div>

            <h1 className={"text-slate-900 dark:text-white tracking-tight text-3xl font-bold"}>Create Account</h1>

            <p className={"text-slate-600 dark:text-slate-400 text-sm mt-1"}>Join the OnSite international student community</p>

          </div>

          <SignupForm />

          <div className={"text-center pt-4 mt-4 border-t border-slate-100 dark:border-slate-800"}>

            <p className={"text-slate-600 dark:text-slate-400 text-sm"}>
Already have an account? 
              <a className={"text-primary font-bold hover:underline ml-1"} data-navigate="/login" href={"/login"}>Log In</a>

            </p>

          </div>

        </div>

      </div>
      </>
    </PageShell>
  );
}

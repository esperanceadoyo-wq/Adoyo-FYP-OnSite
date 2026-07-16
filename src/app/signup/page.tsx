import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Sign Up | OnSite",
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
            <a href={"/"} className={"flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors text-sm font-medium"}>
              <span className={"material-symbols-outlined text-base"}>arrow_back</span>Back
            </a>
          </div>

          <div className={"text-center pb-6"}>

            <h1 className={"text-slate-900 dark:text-white tracking-tight text-3xl font-bold"}>Create Account</h1>

            <p className={"text-slate-600 dark:text-slate-400 text-sm mt-1"}>Join the OnSite international student community</p>

          </div>

          <form action={"/api/signup"} className={"space-y-4"} method={"POST"}>

            <div>

              <label className={"text-slate-700 dark:text-slate-300 text-sm font-semibold block mb-1"}>Full Name</label>

              <input className={"form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 h-12 p-3 text-base font-normal"} name={"full_name"} placeholder={"John Doe"} type={"text"} required />

            </div>

            <div>

              <label className={"text-slate-700 dark:text-slate-300 text-sm font-semibold block mb-1"}>Email Address</label>

              <input className={"form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 h-12 p-3 text-base font-normal"} name={"email"} placeholder={"name@university.edu"} type={"email"} required />

            </div>

            <div>

              <label className={"text-slate-700 dark:text-slate-300 text-sm font-semibold block mb-1"}>Password</label>

              <input className={"form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 h-12 p-3 text-base font-normal"} name={"password"} placeholder={"Create a password"} type={"password"} required />

            </div>

            <div className={"pt-2"}>

              <button className={"w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"} type={"submit"}>Sign Up</button>

            </div>

            <div className={"text-center pt-4 border-t border-slate-100 dark:border-slate-800"}>

              <p className={"text-slate-600 dark:text-slate-400 text-sm"}>
Already have an account? 
                <a className={"text-primary font-bold hover:underline ml-1"} href={"/login"}>Log In</a>

              </p>

            </div>

          </form>

        </div>

      </div>
      </>
    </PageShell>
  );
}

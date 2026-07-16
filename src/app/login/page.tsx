import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

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
          <a href={"/"} className={"flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors text-sm font-medium"}>
            <span className={"material-symbols-outlined text-base"}>arrow_back</span>Back
          </a>
        </div>

        <div className={"flex flex-col items-center pt-8 pb-2"}>

          <div className={"h-20 flex items-center justify-center"}>

            <img alt={"OnSite Logo"} className={"h-full w-auto object-contain dark:brightness-0 dark:invert"} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuBmDSy1WO0E9VNmeVRPytnlrv89Ddu3GvXdbuCd0gVMEmZtRQwVg7ZTvPXr-W8FEEKi9gXjzibjPeezrygpWJhNtf9AY9HJa9YqR9VAuEVMZiViT4oMjK_SsjqKYrkhhDdkzJpvQKnNXXb4Bu8K7LWxbppKfH6xDiPXPjDIWQSG9zoaklsixDShOSV4Mp3nbj9GLTNlkqbc7VnReGPL0MjBbrQYw_o0F0R1wjFWG1MR6aTEf9S9NYCg8b9rVEF0oOkcjrg"} />

          </div>

        </div>

        <div className={"px-8 pt-4 pb-4 text-center"}>

          <h1 className={"text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2"}>Welcome Back</h1>

          <p className={"text-slate-600 dark:text-slate-400 text-base font-normal leading-normal"}>Enter your credentials to access your OnSite account</p>

          <div className={"mt-4 flex justify-center"}>
            <span className={"material-symbols-outlined text-primary"} style={{ fontSize: "64px" }}>admin_panel_settings</span>
          </div>
        </div>

        <form data-action={"login"} action={"#"} className={"px-8 py-6 space-y-5"} method={"POST"}>

          <div className={"flex flex-col w-full"}>

            <label className={"text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 ml-1"}>Email Address</label>

            <input className={"form-input flex w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal"} placeholder={"name@company.com"} type={"email"} />

          </div>

          <div className={"flex flex-col w-full"}>

            <label className={"text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 ml-1"}>Password</label>

            <div className={"relative flex w-full items-center"}>

              <input className={"form-input flex w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] pr-12 text-base font-normal"} placeholder={"Enter your password"} type={"password"} />

              <button className={"absolute right-4 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors"} type={"button"}>

                <span className={"material-symbols-outlined"}>visibility</span>

              </button>

            </div>

            <div className={"flex items-center mt-2"}>
              <input id={"remember-me"} type={"checkbox"} className={"w-4 h-4 text-primary bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded focus:ring-primary/20"} />
              <label htmlFor={"remember-me"} className={"ml-2 text-sm text-slate-400 font-medium"}>Remember me</label>
            </div>
            <div className={"flex justify-end mt-2"}>

            </div>

          </div>

          <div className={"pt-4"}>

            <button className={"w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 dark:shadow-primary/20 active:scale-[0.98]"} type={"submit"}>
                    Log In
                
            </button>

          </div>

          <div className={"flex items-center gap-4 py-2"}>

            <div className={"h-px bg-slate-200 dark:bg-slate-800 flex-1"}></div>

            <span className={"text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider"}>Or</span>

            <div className={"h-px bg-slate-200 dark:bg-slate-800 flex-1"}></div>

          </div>

          <div className={"text-center pb-4"}>

            <p className={"text-slate-600 dark:text-slate-400 text-sm"}>
                    Don&apos;t have an account? 
                    
              <a className={"text-primary font-bold hover:underline ml-1"} href={"/signup"}>Create account</a>

            </p>

          </div>

        </form>

      </div>
      </>
    </PageShell>
  );
}

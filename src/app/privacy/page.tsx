import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy | OnSite",
};

export default function Page() {
  return (
    <PageShell bodyClassName={"page-privacy min-h-screen bg-background text-on-background selection:bg-primary selection:text-on-primary"}>
      <>
      <header className={"fixed top-0 w-full z-50 backdrop-blur-md border-b border-outline/10 bg-background/80"}>

        <div className={"flex justify-between items-center px-6 py-4 max-w-7xl mx-auto"}>

          <div className={"text-xl font-bold text-on-surface"}>
                OnSite
            
          </div>

          <div className={"flex items-center gap-2"}>

            <button className={"theme-toggle"} id={"theme-toggle-btn"} aria-label={"Toggle dark mode"} type={"button"}>

              <span className={"material-symbols-outlined icon-sun text-slate-500"}>light_mode</span>

              <span className={"material-symbols-outlined icon-moon text-slate-300"}>dark_mode</span>

            </button>

            <button className={"flex items-center gap-2 text-primary font-body text-sm hover:opacity-80 transition-opacity active:scale-95"} data-action={"back"}>

              <span className={"material-symbols-outlined"}>arrow_back</span>

              <span>Back</span>

            </button>

          </div>

        </div>

      </header>
      <main className={"pt-32 pb-24 px-6 max-w-3xl mx-auto"}>

        <section className={"mb-16"}>

          <h1 className={"text-4xl font-extrabold tracking-tight mb-4 text-on-surface"}>Privacy Policy</h1>

          <p className={"text-on-surface-variant text-lg"}>Last updated: July 5, 2026</p>

          <div className={"h-1 w-20 bg-primary mt-6 rounded-full"}></div>

        </section>

        <div className={"prose-teal"}>

          <section id={"collection"}>

            <h2>

              <span className={"material-symbols-outlined text-primary"}>database</span>
                    Information Collection
                
            </h2>

            <p>
                    We collect information that you provide directly to us when you create an account, participate in any interactive features of the OnSite Learning Platform, or communicate with us. This may include your name, email address, educational background, and professional interests.
                
            </p>

            <p>
                    When you access our platform, we automatically collect certain information about your device and how you interact with our services, including IP addresses, browser types, and usage patterns through cookies and similar tracking technologies.
                
            </p>

          </section>

          <section className={"mt-12"} id={"usage"}>

            <h2>

              <span className={"material-symbols-outlined text-primary"}>analytics</span>
                    Data Usage
                
            </h2>

            <p>
                    OnSite uses the collected data to provide, maintain, and improve our learning services. This includes personalizing your educational experience, processing transactions, and sending you technical notices or administrative messages.
                
            </p>

            <p>
                    We also use information to monitor and analyze trends, usage, and activities in connection with our services to ensure the highest quality of platform performance. Your data helps us train our proprietary support models to offer more accurate guidance during your learning journey.
                
            </p>

          </section>

          <section className={"mt-12"} id={"rights"}>

            <h2>

              <span className={"material-symbols-outlined text-primary"}>verified_user</span>
                    Your Rights
                
            </h2>

            <p>
                    You have the right to access, update, or delete the personal information we hold about you. You may also object to the processing of your data or request that we restrict the processing of your personal information in certain circumstances.
                
            </p>

            <p>
                    To exercise these rights, please contact our privacy team. We respond to all requests we receive from individuals wishing to exercise their data protection rights in accordance with applicable data protection laws.
                
            </p>

          </section>

          <section className={"mt-12"} id={"security"}>

            <h2>

              <span className={"material-symbols-outlined text-primary"}>security</span>
                    Security
                
            </h2>

            <p>
                    OnSite takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction. We employ industry-standard encryption for data at rest and in transit.
                
            </p>

            <p>
                    While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. We encourage all users to use strong passwords and keep their login credentials confidential to assist in maintaining account security.
                
            </p>

          </section>

        </div>

      </main>
      <section className={"max-w-3xl mx-auto px-6 mb-12"}>

        <div className={"h-px w-full bg-outline/20 mb-8"}></div>

        <h2 className={"text-xl font-bold text-primary mb-4 flex items-center gap-2"}>

          <span className={"material-symbols-outlined"}>code</span>
            Contact Developer
        
        </h2>

        <div className={"flex flex-col gap-1"}>

          <p className={"text-on-surface font-semibold"}>Adoyo Christine</p>

          <p className={"text-on-surface-variant"}>esperanceadoyo@gmail.com</p>

        </div>

      </section>
      <footer className={"w-full py-12 bg-background border-t border-outline/10"}>

        <div className={"flex flex-col md:flex-row items-center px-8 max-w-4xl mx-auto gap-4 justify-center"}>

          <div className={"text-lg font-bold text-on-surface"}>OnSite</div>

          <div className={"font-body text-xs text-on-surface-variant text-center"}>
                &copy; 2026 OnSite Learning Platforms. All rights reserved.
            
          </div>

        </div>

      </footer>
      </>
    </PageShell>
  );
}

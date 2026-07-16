import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About OnSite - Our Story",
};

export default function Page() {
  return (
    <PageShell
      bodyClassName={
        "page-about min-h-screen flex flex-col selection:bg-primary/30 bg-white dark:bg-on-background text-on-surface dark:text-on-primary"
      }
    >
      <>
        <header
          className={
            "fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 glass-nav shadow-sm"
          }
        >
          <div className={"flex items-center gap-3"}>
            <img
              alt={"OnSite Logo"}
              className={"h-10 w-auto object-contain"}
              src={
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAT0yxYTSQPCwMFy_60nHvvBwJ0iR1AszLo24KR9LWrY3juVuddxI8EIyODYE7IyySlLINRn1A-LWoV5KlUXeDwoEs0rEAFbzcLOYQ29p4rvODmmVyNhcmiOuuaf6o8Q4-dZ-SzUPrebk4ODorFxGLwuThwxPxbNL3f8OKq6l1IKoPSMF3b8o39MqcchIPKyejH1NPmv9tO-LxheZJuZWsIjpFZFs4viT5WnJk579syq-b2uKUj9wI3Xe8CkPxaIu7YwQ8"
              }
            />

            <span
              className={
                "font-display font-bold text-xl text-on-surface dark:text-white"
              }
            >
              OnSite
            </span>
          </div>

          <div className={"flex items-center gap-2"}>
            <button
              className={"theme-toggle"}
              id={"theme-toggle-btn"}
              aria-label={"Toggle dark mode"}
              type={"button"}
            >
              <span
                className={"material-symbols-outlined icon-sun text-slate-500"}
              >
                light_mode
              </span>

              <span
                className={"material-symbols-outlined icon-moon text-slate-300"}
              >
                dark_mode
              </span>
            </button>

            <button
              className={
                "flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant dark:text-white/70 hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors active:scale-95 group"
              }
              data-navigate={"/"}
            >
              <span
                className={
                  "material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform"
                }
              >
                arrow_back
              </span>

              <span className={"font-body text-sm font-medium"}>Back</span>
            </button>
          </div>
        </header>
        <main className={"flex-grow pt-32 pb-24 px-6 max-w-6xl mx-auto w-full"}>
          <section className={"mb-20 text-center md:text-left"}>
            <h1
              className={
                "font-display font-extrabold text-5xl md:text-6xl text-on-surface dark:text-white tracking-tight mb-6"
              }
            >
              Our
              <span className={"text-primary"}> Story</span>.
            </h1>

            <p
              className={
                "font-body text-xl md:text-2xl text-on-surface-variant dark:text-white/80 leading-relaxed max-w-3xl"
              }
            >
              OnSite was born from a simple observation: international students
              aren&apos;t just moving to a new city; they are building a new
              life. We bridge the gap between uncertainty and belonging.
            </p>
          </section>

          <div className={"grid grid-cols-1 md:grid-cols-12 gap-6"}>
            <div
              className={
                "md:col-span-8 bento-card rounded-xl shadow-sm p-8 md:p-12 flex flex-col justify-center border border-surface-container-highest dark:border-white/5"
              }
            >
              <div
                className={
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-primary text-xs font-bold uppercase tracking-wider mb-6 w-fit"
                }
              >
                Our Mission
              </div>

              <h2
                className={
                  "font-display font-bold text-3xl text-on-surface dark:text-white mb-6"
                }
              >
                Empowering the Global Student.
              </h2>

              <div
                className={
                  "space-y-4 font-body text-lg text-on-surface-variant dark:text-white/70 leading-relaxed"
                }
              >
                <p>
                  Leaving home is the greatest adventure of a lifetime. Yet, for
                  many international students, the initial weeks are clouded by
                  the logistical hurdles of finding a safe place to stay,
                  navigating local customs, and seeking a genuine community.
                </p>

                <p>
                  OnSite is the platform that handles the friction. We provide
                  the tools for international students to find comfort and
                  connection from day one, ensuring that their focus remains on
                  what matters: their education and personal growth.
                </p>
              </div>
            </div>

            <div
              className={
                "md:col-span-4 rounded-xl overflow-hidden shadow-sm h-64 md:h-auto min-h-[300px] relative"
              }
            >
              <div
                className={"absolute inset-0 bg-cover bg-center"}
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_HXSWuY1qcm0KxzNJBpdmotLnJ7KPSZDy9_7-7sxSKofYFhbqnAelOYok3CrqMLh7hWlz0CUBWOyGnsVuoHrsLsPtZsDKKyS3j-68ONwdPYrGknZlMUoGxa-cnotCoWCxL9ufX7ri3Czq1hWAmOBmgLHBap5tj-osHHhLXtH1hwhamyHOWlG3hmlku8P5hFRhww_scU8NiB3Voy52l9aQr4PcCci6MwZGfZqNLGJzvpExtPJa-2sTlQ')",
                }}
              ></div>

              <div
                className={
                  "absolute inset-0 bg-gradient-to-t from-on-background/40 to-transparent"
                }
              ></div>

              <div className={"absolute bottom-6 left-6 right-6"}>
                <p className={"text-white font-medium text-lg leading-snug"}>
                  Designing the future of international living.
                </p>
              </div>
            </div>

            <div className={"md:col-span-12 mt-12 mb-4"}>
              <h3
                className={
                  "font-display font-bold text-2xl text-on-surface dark:text-white"
                }
              >
                Our Core Values
              </h3>
            </div>

            <div
              className={
                "md:col-span-4 bento-card rounded-xl shadow-sm p-8 border border-surface-container-highest dark:border-white/5"
              }
            >
              <div
                className={
                  "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6"
                }
              >
                <span
                  className={"material-symbols-outlined"}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  groups
                </span>
              </div>

              <h4
                className={
                  "font-display font-bold text-xl text-on-surface dark:text-white mb-3"
                }
              >
                Community
              </h4>

              <p
                className={
                  "font-body text-on-surface-variant dark:text-white/70 leading-relaxed"
                }
              >
                We believe that belonging is a basic human need. We build
                bridges between diverse cultures to foster lifelong friendships.
              </p>
            </div>

            <div
              className={
                "md:col-span-4 bento-card rounded-xl shadow-sm p-8 border border-surface-container-highest dark:border-white/5"
              }
            >
              <div
                className={
                  "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6"
                }
              >
                <span
                  className={"material-symbols-outlined"}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>

              <h4
                className={
                  "font-display font-bold text-xl text-on-surface dark:text-white mb-3"
                }
              >
                Security
              </h4>

              <p
                className={
                  "font-body text-on-surface-variant dark:text-white/70 leading-relaxed"
                }
              >
                Safety is our baseline. Every host and every listing on our
                platform undergoes a rigorous verification process.
              </p>
            </div>

            <div
              className={
                "md:col-span-4 bento-card rounded-xl shadow-sm p-8 border border-surface-container-highest dark:border-white/5"
              }
            >
              <div
                className={
                  "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6"
                }
              >
                <span
                  className={"material-symbols-outlined"}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>

              <h4
                className={
                  "font-display font-bold text-xl text-on-surface dark:text-white mb-3"
                }
              >
                Clarity
              </h4>

              <p
                className={
                  "font-body text-on-surface-variant dark:text-white/70 leading-relaxed"
                }
              >
                No hidden fees. No complex jargon. Just clear information to
                help you make the best decisions for your future.
              </p>
            </div>
          </div>
        </main>
        <footer
          className={
            "mt-auto py-12 px-6 border-t border-surface-container-highest dark:border-white/10"
          }
        >
          <div
            className={
              "max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6"
            }
          >
            <div
              className={
                "flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
              }
            >
              <img
                alt={"OnSite Logo"}
                className={"h-6 w-auto"}
                src={
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgC8efvrDN-Z6nbFXMw6ssCwDvsR4qtiypJAswdWdC75Kzj-qAei6S7SPz1oCthI2zlIxMsbFB8gWPG1lWrGb9vPwIeSU7vRmBs8L67kbMmNM4KGq5WYVwiGygpxQjNVLw8I29f0ZaRJY0qLaoMQbxouugLx0uWLJZvSH1xZq5JwZeoS-0rRYwqGecXJVSlFZp0lxSYjrajhpwopvmPzoTwnGYrh8XSXyCDQ5ISMDOYd-tQgVpoUgve6H7Wlip1pzYNWY"
                }
              />

              <span
                className={
                  "font-display font-bold text-sm text-on-surface dark:text-white"
                }
              >
                OnSite
              </span>
            </div>

            <p
              className={
                "font-body text-xs text-on-surface-variant dark:text-white/40 tracking-wider"
              }
            >
              &copy; 2026 OnSite Learning Platforms. All rights reserved.
            </p>
          </div>
        </footer>
      </>
    </PageShell>
  );
}

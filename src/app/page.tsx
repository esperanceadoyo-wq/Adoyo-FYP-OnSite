import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "OnSite | Where Comfort Meets Connection",
};

export default function Page() {
  return (
    <PageShell bodyClassName={"page-home bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 antialiased overflow-x-hidden"}>
      <>
      <header className={"fixed top-0 left-0 w-full z-50 glass-nav shadow-sm dark:border-b dark:border-slate-800"}>

        <nav className={"flex items-center w-full px-6 py-4 max-w-7xl mx-auto justify-center"}>

          <div className={"flex items-center justify-between w-full"}>

            <div className={"flex items-center gap-8"}>

              <a className={"block"} href={"/"}>

                <img alt={"OnSite Logo"} className={"h-20 w-auto object-contain logo-filter"} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuCIZh21qx7r-BIZvnEGbyfIJ-1HwPfJ10xkTyWuWnG-JFoNYzh_zjkLyljTgScVsebRuVQ4peABcooXkp-O5BRaZuWq9VTQKuJZ0K1mRd0F4ErUQvd5sMMr-gEBTiXuKpoM0xPs9C-GuhS9WF1fcPdFRKnbSBtHr6nlDp3JgB8Ux_tr_F7fy0N0qLHfu7L6f4vsVW06LIIRQrD4gAkqfzS2PnEyi9CoUWTXHoL5SGkb8M-e6b8Lc8UEfny8pBjFvRnBh6w"} />

              </a>

              <div className={"hidden md:flex items-center gap-6"}>

                <a className={"text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"} href={"/about"}>About</a>

                <a className={"text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"} href={"/privacy"}>Privacy</a>

              </div>

            </div>

            <div className={"flex items-center gap-2"}>

              <button className={"theme-toggle"} id={"theme-toggle-btn"} aria-label={"Toggle dark mode"} type={"button"}>

                <span className={"material-symbols-outlined icon-sun text-slate-700 dark:text-slate-300"}>light_mode</span>

                <span className={"material-symbols-outlined icon-moon text-slate-300"}>dark_mode</span>

              </button>

              <a href={"/login"} className={"text-sm font-bold text-slate-900 dark:text-slate-200 px-4 py-2 hover:text-primary transition-colors inline-block align-middle mt-2"}>Log In</a>

              <a href={"/signup"} className={"bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 inline-block text-center"}>Sign Up</a>

            </div>

          </div>

        </nav>

      </header>
      <main className={"pt-24"}>

        <section className={"relative max-w-7xl mx-auto px-6 py-8 md:py-12 grid md:grid-cols-2 gap-12 items-center"}>

          <div className={"z-10"}>

            <span className={"inline-block px-4 py-1.5 rounded-full bg-primary-container dark:bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase mb-6"}>Built for International Students</span>

            <h1 className={"text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6"}>
                Where 
              <span className={"text-primary"}>Comfort</span> Meets Connection
            
            </h1>

            <p className={"text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed"}>
                Discover handpicked learning spaces tailored to your journey. Real-time recommendations for international students seeking the perfect environment to excel.
            
            </p>

            <div className={"flex flex-wrap gap-4"}>

              <a href={"/signup"} className={"bg-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 text-center"}>Get Started</a>

              <a href={"/about"} className={"bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center"}>Learn More</a>

            </div>

            <div className={"mt-12 flex items-center gap-4"}>

              <div className={"flex -space-x-3"}>

                <div className={"w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden"}>

                  <img alt={""} className={"w-full h-full object-cover"} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuBly18MowTvCyfqnj7ZUaKuSpgb-X0LVXy8_OboW1u3hYhktYfQcG0ZfDY6TU9f7Wk0gulG9Ma_aB47sotEwAQ_8UwHoerJfbNitkxMF_G1gx_rrs4lh0hK6ZQ8RFL4amQkjNXsPtfFBfqr9LrTUE4YZ3OBzSrKIUrmYQhXBjSKoez60DaQiFlQymUzXb0bJlNo-EuceySnw9DoymH2gcIHo_3C8pRxvBBryoW3O9YBhXJlgjL3RsACeg"} />

                </div>

                <div className={"w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden"}>

                  <img alt={""} className={"w-full h-full object-cover"} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuAp_-MYVbaX97cx5SlI1z_n1GaebXdWj2BOKRqeB7F3QevQFubAwZ6M-eV5G6voAb1y_Ikgm1lYt1xq8zKu0GC_pgQrWyy3X76yDfBmCeaq17dijjrfKOB0xWQfLeYAbER0b3srJIlGDib9xCy4q-dqQIpxTkrnevpWMWC24o76a7najwAPseRnrY9RLqwN6WB6Us6CfDq0nwqBSLmPcdv_sZcmxudY3sRvzRVvbQ2tP6_CWUTavUxG0A"} />

                </div>

                <div className={"w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden"}>

                  <img alt={""} className={"w-full h-full object-cover"} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuBkO9MftJ7vZr0eyPe8VBMSy61IX7nslVzFVQzw2RJlkjcunoXsz5aS1Bh-FjygnR4YRKdqn61xNUCvgvNeOzVB3LXnQCOMThUqBmRxSoi195fr2xtmNZpVs9t7QFZayrRZ7_A8qzvlWW7hhUVhpdqBjh2tyM12peJnuX0YwbKJ1TdZK_AyPPoVM6x4GWsGbeQ3sCDH3umjg-8agFffD8LGQguin5MawDathMs54oRFLbcoGyoIviSCrA"} />

                </div>

              </div>

              <p className={"text-sm text-slate-500 font-medium"}>
                <span className={"text-slate-900 dark:text-slate-200 font-bold"}>1,200+</span> Students found their spot today
              </p>

            </div>

          </div>

          <div className={"relative group"}>

            <div className={"absolute -inset-4 bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors duration-500"}></div>

            <div className={"relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 dark:border dark:border-slate-800 aspect-square md:aspect-[4/5]"}>

              <img alt={"Student study space"} className={"w-full h-full object-cover"} src={"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"} />

              <div className={"absolute top-8 left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 dark:border-slate-700/50 animate-bounce transition-all duration-1000"} style={{ animationDuration: "3s" }}>

                <div className={"flex items-center gap-3"}>

                  <div className={"w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"}>

                    <span className={"material-symbols-outlined"} style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>

                  </div>

                  <div>

                    <p className={"text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500"}>Live Status</p>

                    <p className={"text-sm font-bold text-slate-900 dark:text-white"}>BookXcess @ Tamarind Square</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className={"max-w-7xl mx-auto px-6 py-12"}>

          <div className={"text-center mb-16"}>

            <h2 className={"text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"}>Why OnSite?</h2>

            <p className={"text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto"}>We focus on the intersections of productivity, wellness, and international community, ensuring your study environment supports your success.</p>

          </div>

          <div className={"grid md:grid-cols-3 gap-8"}>

            <div className={"bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 bento-card flex flex-col items-center text-center"}>

              <div className={"w-20 h-20 bg-primary-container dark:bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8"}>

                <span className={"material-symbols-outlined text-4xl"} style={{ fontVariationSettings: "'wght' 500" }}>public</span>

              </div>

              <h3 className={"text-2xl font-bold text-slate-900 dark:text-white mb-4"}>Global Connection</h3>

              <p className={"text-slate-500 dark:text-slate-400 leading-relaxed"}>Join a network of international scholars from over 120 countries, all navigating the same journey as you.</p>

            </div>

            <div className={"bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 bento-card flex flex-col items-center text-center"}>

              <div className={"w-20 h-20 bg-tertiary-fixed dark:bg-tertiary/10 rounded-3xl flex items-center justify-center text-tertiary mb-8"}>

                <span className={"material-symbols-outlined text-4xl"} style={{ fontVariationSettings: "'wght' 500" }}>verified_user</span>

              </div>

              <h3 className={"text-2xl font-bold text-slate-900 dark:text-white mb-4"}>Verified Spaces</h3>

              <p className={"text-slate-500 dark:text-slate-400 leading-relaxed"}>Every location is vetted by our team for safety, connectivity, and study-appropriate atmosphere.</p>

            </div>

            <div className={"bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 bento-card flex flex-col items-center text-center"}>

              <div className={"w-20 h-20 bg-primary-container dark:bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8"}>

                <span className={"material-symbols-outlined text-4xl"} style={{ fontVariationSettings: "'wght' 500" }}>speed</span>

              </div>

              <h3 className={"text-2xl font-bold text-slate-900 dark:text-white mb-4"}>Real-time Data</h3>

              <p className={"text-slate-500 dark:text-slate-400 leading-relaxed"}>Get instant updates on noise levels, seat availability, and Wi-Fi speed before you even leave home.</p>

            </div>

          </div>

        </section>

        <section className={"bg-slate-50 dark:bg-slate-900/50 py-12"}>

          <div className={"max-w-7xl mx-auto px-6"}>

            <div className={"text-center mb-16"}>

              <h2 className={"text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"}>How it Works</h2>

              <p className={"text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto"}>Three simple steps to transform your daily study routine and boost your integration journey.</p>

            </div>

            <div className={"grid md:grid-cols-3 gap-8"}>

              <div className={"bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg bento-card relative overflow-hidden"}>

                <div className={"flex justify-between items-start mb-8"}>

                  <div className={"text-5xl font-black text-primary/10"}>01</div>

                  <div className={"w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary"}>

                    <span className={"material-symbols-outlined text-3xl"}>psychology</span>

                  </div>

                </div>

                <h3 className={"text-2xl font-bold text-slate-900 dark:text-white mb-4"}>Define Your Vibe</h3>

                <p className={"text-slate-500 dark:text-slate-400 leading-relaxed"}>Tell us your preferences: Total silence, bustling cafe, or a collaborative group environment? We listen to your needs.</p>

              </div>

              <div className={"bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg bento-card relative overflow-hidden"}>

                <div className={"flex justify-between items-start mb-8"}>

                  <div className={"text-5xl font-black text-primary/10"}>02</div>

                  <div className={"w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary"}>

                    <span className={"material-symbols-outlined text-3xl"}>map</span>

                  </div>

                </div>

                <h3 className={"text-2xl font-bold text-slate-900 dark:text-white mb-4"}>Get Recommendations</h3>

                <p className={"text-slate-500 dark:text-slate-400 leading-relaxed"}>Our smart algorithm matches you with the best available spaces within a 2-mile radius of your current location.</p>

              </div>

              <div className={"bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg bento-card relative overflow-hidden"}>

                <div className={"flex justify-between items-start mb-8"}>

                  <div className={"text-5xl font-black text-primary/10"}>03</div>

                  <div className={"w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary"}>

                    <span className={"material-symbols-outlined text-3xl"}>sensor_occupied</span>

                  </div>

                </div>

                <h3 className={"text-2xl font-bold text-slate-900 dark:text-white mb-4"}>Check In &amp; Connect</h3>

                <p className={"text-slate-500 dark:text-slate-400 leading-relaxed"}>Show up, check-in, and instantly see which other students are nearby. Start a focus session or grab a coffee.</p>

              </div>

            </div>

          </div>

        </section>

        <section className={"max-w-7xl mx-auto px-6 py-12"}>

          <div className={"bg-primary rounded-[3rem] p-8 md:p-12 max-w-6xl mx-auto text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12"}>

            <div className={"absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12"}></div>

            <div className={"relative z-10 flex-1 text-center md:text-left"}>

              <h2 className={"text-4xl md:text-6xl font-extrabold mb-8 leading-tight"}>Find Your Focus Today</h2>

              <p className={"text-primary-fixed-dim text-xl mb-12 max-w-lg"}>Ready to stop searching and start learning? Join OnSite and unlock the best kept secrets of your campus city.</p>

              <div className={"flex flex-wrap gap-4 justify-center md:justify-start"}>

                <a href={"/signup"} className={"bg-white text-primary px-10 py-4 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95 text-center"}>Sign Up Now</a>

                <a href={"/login"} className={"bg-primary-fixed/20 dark:bg-white/10 border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 dark:hover:bg-white/20 transition-all text-center"}>Log In</a>

              </div>

            </div>

            <div className={"relative z-10 w-full md:w-2/5 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"}>

              <img alt={"Modern student learning space"} className={"w-full h-full object-cover"} src={"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"} />

              <div className={"absolute inset-0 bg-primary/10 pointer-events-none"}></div>

            </div>

          </div>

        </section>

      </main>
      <footer className={"bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-8"}>

        <div className={"max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 justify-center"}>

          <div className={"col-span-2"}>
            <a className={"text-2xl font-bold text-slate-900 dark:text-white mb-8 block"} href={"/"}>
              <img alt={"OnSite Logo"} className={"h-14 w-auto object-contain logo-filter"} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuAyHZfxA2o-JUAJu78bl7YpJjegKd9Ggb4odQ7ZNgt9QPFo3Q1LT4XrOga_pmxAflzzUxuwjzlNW8umKUVifTRdM9KDwVpjMtsoKwaOki1FWeBiV9W3jt1ej2Loy0xGIqsN6qsz4n1VO6R7meFl20fsIOsENo2l80i8QwvFgWpyClBT5bwkYGQj3VDqwrBp4m6pqCmxRqjzDgZekRTw4LX7E16W3R2P27ofMbGQCTcuQd7Z9lUW8Q7OmuhNE4ZdBiZxWvw"} />
            </a>

            <p className={"text-slate-500 text-sm max-w-xs leading-relaxed mb-8"}>Empowering international students to find their place, their people, and their potential in a new environment.</p>
          </div>

          <div>
            <h4 className={"font-bold text-slate-900 dark:text-white mb-6"}>Product</h4>
            <ul className={"space-y-4 text-sm text-slate-500"}>
              <li>
                <a className={"hover:text-primary transition-colors"} href={"#"}>Find Spaces</a>
              </li>
              <li>
                <a className={"hover:text-primary transition-colors text-on-surface-variant"} data-auth-modal={"open"} href={"#"}>Profile</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={"font-bold text-slate-900 dark:text-white mb-6"}>Company</h4>
            <ul className={"space-y-4 text-sm text-slate-500"}>
              <li>
                <a className={"hover:text-primary transition-colors"} href={"/about"}>About Us</a>
              </li>
              <li>
                <a className={"hover:text-primary transition-colors"} href={"/privacy"}>Privacy Policy</a>
              </li>
            </ul>
          </div>

        </div>

        <div className={"max-w-7xl mx-auto px-6 pt-4 border-t border-slate-50 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 mt-4"}>

          <p className={"text-xs text-slate-400 dark:text-slate-600"}>&copy; 2026 OnSite Learning Platforms. All rights reserved.</p>

        </div>

      </footer>
      <div id={"authModal"} className={"hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"} data-auth-modal={"close"}>

        <div className={"bg-surface-container-highest p-8 rounded-3xl w-full max-w-xs border border-outline shadow-2xl text-center"}>

          <h3 className={"text-xl font-extrabold text-on-surface mb-2"}>Access Required</h3>

          <p className={"text-on-surface-variant text-sm"}>Please log in or sign up to view your profile.</p>

        </div>

      </div>
      </>
    </PageShell>
  );
}

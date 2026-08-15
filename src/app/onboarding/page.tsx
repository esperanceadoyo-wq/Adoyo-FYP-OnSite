import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { requireAuth } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default async function Page() {
  await requireAuth("/onboarding");

  return (
    <PageShell bodyClassName={"min-h-screen flex flex-col font-body text-on-background antialiased bg-background"}>
      <>
      <div className={"fixed inset-0 z-[-1] overflow-hidden"}>

        <div className={"absolute inset-0 bg-background/80 backdrop-blur-[2px]"}></div>

      </div>
      <main className={"flex-grow flex items-center justify-center px-4 pb-12 py-12"}>

        <div className={"w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out border border-outline-variant/20"}>

          <div className={"flex justify-between items-center px-8 py-6 border-b border-outline-variant/20"}>

            <div className={"text-xl font-bold tracking-tight text-on-surface"}>OnSite</div>

            <button className={"flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-variant/50 transition-colors duration-200 text-on-surface-variant active:scale-95 transition-transform group"} data-action={"back"}>

              <span className={"material-symbols-outlined text-sm"}>arrow_back</span>

              <span className={"text-body-sm font-medium"}>Back</span>

            </button>

          </div>


          <div className={"px-8 py-6"}>

            <div className={"mb-8"}>

              <h1 className={"text-2xl font-bold text-on-surface mb-2"}>Tell us about yourself</h1>

              <p className={"text-on-surface-variant leading-relaxed"}>Help us personalize your OnSite experience to match your workflow.</p>

            </div>

            <div className={"space-y-8"}>

              <div className={"flex flex-col items-center"}>

                <label className={"text-[11px] uppercase tracking-widest font-bold text-on-surface-variant/70 block mb-4"}>Interests</label>

                <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 w-full"}>

                  <div className={"selection-card group cursor-pointer border-2 border-transparent bg-surface-variant/40 rounded-xl p-4 transition-all duration-200 hover:bg-surface-variant/60"} data-category={"interests"} data-value={"study"} data-selection={"toggle"}>

                    <div className={"w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"}>

                      <span className={"material-symbols-outlined text-primary"}>menu_book</span>

                    </div>

                    <h3 className={"font-bold text-on-surface text-sm"}>Study</h3>

                    <p className={"text-xs text-on-surface-variant mt-1 leading-tight"}>Focus on academic growth and research.</p>

                  </div>

                  <div className={"selection-card group cursor-pointer border-2 border-transparent bg-surface-variant/40 rounded-xl p-4 transition-all duration-200 hover:bg-surface-variant/60"} data-category={"interests"} data-value={"social"} data-selection={"toggle"}>

                    <div className={"w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"}>

                      <span className={"material-symbols-outlined text-primary"}>groups</span>

                    </div>

                    <h3 className={"font-bold text-on-surface text-sm"}>Social</h3>

                    <p className={"text-xs text-on-surface-variant mt-1 leading-tight"}>Connect with peers and mentors.</p>

                  </div>

                  <div className={"selection-card group cursor-pointer border-2 border-transparent bg-surface-variant/40 rounded-xl p-4 transition-all duration-200 hover:bg-surface-variant/60"} data-category={"interests"} data-value={"collaborative"} data-selection={"toggle"}>

                    <div className={"w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"}>

                      <span className={"material-symbols-outlined text-primary"}>handshake</span>

                    </div>

                    <h3 className={"font-bold text-on-surface text-sm"}>Collaborative</h3>

                    <p className={"text-xs text-on-surface-variant mt-1 leading-tight"}>Work together on shared goals.</p>

                  </div>

                </div>

              </div>


              <div className={"flex flex-col items-center"}>

                <label className={"text-[11px] uppercase tracking-widest font-bold text-on-surface-variant/70 block mb-4"}>Current Mood</label>

                <div className={"flex flex-wrap gap-2 justify-center"} data-group={"mood"}>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"focused"} data-selection={"single"} data-group-name={"mood"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>center_focus_strong</span>Focused

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"social"} data-selection={"single"} data-group-name={"mood"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>groups</span>Social

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"overwhelmed"} data-selection={"single"} data-group-name={"mood"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>psychology</span>Overwhelmed

                  </button>

                </div>

              </div>


              <div className={"rounded-xl flex flex-col items-center"}>

                <label className={"text-[11px] uppercase tracking-widest font-bold text-on-surface-variant/70 block mb-4"}>Comfort Level</label>

                <div className={"flex flex-wrap gap-2 justify-center"} data-group={"comfort"}>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"private"} data-selection={"single"} data-group-name={"comfort"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>lock</span>Private

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"casual"} data-selection={"single"} data-group-name={"comfort"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>sentiment_satisfied</span>Casual

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"public"} data-selection={"single"} data-group-name={"comfort"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>public</span>Public

                  </button>

                </div>

              </div>


              <div className={"flex flex-col items-center"}>

                <label className={"text-[11px] uppercase tracking-widest font-bold text-on-surface-variant/70 block mb-4"}>Amenities</label>

                <div className={"flex flex-wrap gap-2 justify-center"}>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-category={"amenities"} data-value={"wifi"} data-selection={"toggle"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>wifi</span>Strong Wifi

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-category={"amenities"} data-value={"outlets"} data-selection={"toggle"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>power</span>Power Outlets

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-category={"amenities"} data-value={"food"} data-selection={"toggle"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>local_cafe</span>Coffee/Food Nearby

                  </button>

                </div>

              </div>


              <div className={"flex flex-col items-center"}>

                <label className={"text-[11px] uppercase tracking-widest font-bold text-on-surface-variant/70 block mb-4"}>Noise Tolerance</label>

                <div className={"flex flex-wrap gap-2 justify-center"} data-group={"noise"}>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"silent"} data-selection={"single"} data-group-name={"noise"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>volume_off</span>Pin Drop Silence

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"hum"} data-selection={"single"} data-group-name={"noise"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>volume_down</span>Light Hum

                  </button>

                  <button className={"chip px-4 py-2 border border-transparent rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2"} data-value={"noisy"} data-selection={"single"} data-group-name={"noise"}>

                    <span className={"material-symbols-outlined text-primary text-base"}>volume_up</span>Lively/Noisy

                  </button>

                </div>

              </div>

            </div>

          </div>


          <div className={"p-8 mt-4 border-t border-outline-variant/20 bg-surface-variant/20"}>

            <button type={"button"} data-action={"save-preferences"} className={"w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95"}>Discover Your Space Now 
              <span className={"material-symbols-outlined text-sm"}>arrow_forward</span>
            </button>
            <p aria-live={"polite"} className={"mt-3 min-h-5 text-center text-sm font-medium text-on-surface-variant data-[state=error]:text-error data-[state=saving]:text-primary"} data-onboarding-status></p>

          </div>

        </div>

      </main>
      </>
    </PageShell>
  );
}

"use client";

import { useEffect } from "react";
import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { startRouteMotion } from "@/components/RouteMotion";
import { toggleTheme } from "@/lib/theme";

type PageShellProps = {
  bodyClassName: string;
  children: ReactNode;
};

export function PageShell({ bodyClassName, children }: PageShellProps) {
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll<HTMLElement>(".bento-card").forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease-out";
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  async function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest("#theme-toggle-btn")) {
      toggleTheme();
      return;
    }

    const navigation = target.closest<HTMLElement>("[data-navigate]");
    if (navigation?.dataset.navigate) {
      event.preventDefault();
      startRouteMotion();
      router.push(navigation.dataset.navigate);
      return;
    }

    const action = target.closest<HTMLElement>("[data-action]");
    if (action?.dataset.action === "back") {
      startRouteMotion();
      router.back();
      return;
    }

    if (action?.dataset.action === "save-preferences") {
      await savePreferences(action, () => {
        startRouteMotion();
        router.push("/dashboard", { transitionTypes: ["step-forward"] });
        router.refresh();
      });
      return;
    }

    const modalTrigger = target.closest<HTMLElement>("[data-auth-modal]");
    if (modalTrigger?.dataset.authModal === "open") {
      event.preventDefault();
      document.getElementById("authModal")?.classList.remove("hidden");
      return;
    }

    if (modalTrigger?.dataset.authModal === "close") {
      event.preventDefault();
      modalTrigger.classList.add("hidden");
      return;
    }

    const selection = target.closest<HTMLElement>("[data-selection]");
    if (selection?.dataset.selection === "toggle") {
      selection.classList.toggle("active");
      return;
    }

    if (selection?.dataset.selection === "single") {
      const groupName = selection.dataset.groupName;
      const group = groupName
        ? document.querySelector(`[data-group="${groupName}"]`)
        : selection.parentElement;

      group
        ?.querySelectorAll(".chip.active")
        .forEach((chip) => chip !== selection && chip.classList.remove("active"));
      selection.classList.toggle("active");
    }
  }

  return (
    <div className={bodyClassName} onClick={handleClick}>
      {children}
    </div>
  );
}

function selectedValue(selector: string) {
  return document.querySelector<HTMLElement>(selector)?.dataset.value ?? null;
}

function selectedValues(selector: string) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).map(
    (element) => element.dataset.value,
  ).filter(
    (value): value is string => Boolean(value),
  );
}

async function savePreferences(action: HTMLElement, onSuccess: () => void) {
  const comfort = selectedValue('[data-group="comfort"] .chip.active');
  const payload = {
    comfort_level: comfort,
    current_mood: selectedValue('[data-group="mood"] .chip.active'),
    interests: selectedValues('[data-category="interests"].active'),
    noise_tolerance: selectedValue('[data-group="noise"] .chip.active'),
    preferred_amenities: selectedValues('[data-category="amenities"].active'),
    preferred_social_intensity: socialIntensityForComfort(comfort),
  };
  const status = document.querySelector<HTMLElement>("[data-onboarding-status]");

  if (
    payload.interests.length === 0 ||
    !payload.current_mood ||
    !payload.comfort_level ||
    payload.preferred_amenities.length === 0 ||
    !payload.noise_tolerance
  ) {
    setStatus(status, "Please choose at least one option in every section.", true);
    return;
  }

  action.setAttribute("disabled", "true");
  action.setAttribute("aria-busy", "true");
  setStatus(status, "Saving your preferences...", false);

  try {
    const response = await fetch("/api/profile", {
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
      method: "PUT",
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(status, data.error || "Could not save your preferences.", true);
      return;
    }

    localStorage.setItem("onsite_user_preferences", JSON.stringify(payload));
    onSuccess();
  } catch {
    setStatus(status, "Could not reach the backend. Please try again.", true);
  } finally {
    action.removeAttribute("disabled");
    action.removeAttribute("aria-busy");
  }
}

function socialIntensityForComfort(comfort: string | null) {
  if (comfort === "private") return 1;
  if (comfort === "public") return 3;
  return 2;
}

function setStatus(
  statusElement: HTMLElement | null,
  message: string,
  isError: boolean,
) {
  if (!statusElement) return;

  statusElement.textContent = message;
  statusElement.dataset.state = isError ? "error" : "saving";
}

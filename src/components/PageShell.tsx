"use client";

import { useEffect } from "react";
import type { FormEvent, MouseEvent, ReactNode } from "react";

type PageShellProps = {
  bodyClassName: string;
  children: ReactNode;
};

export function PageShell({ bodyClassName, children }: PageShellProps) {
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

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest("#theme-toggle-btn")) {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      return;
    }

    const navigation = target.closest<HTMLElement>("[data-navigate]");
    if (navigation?.dataset.navigate) {
      window.location.href = navigation.dataset.navigate;
      return;
    }

    const action = target.closest<HTMLElement>("[data-action]");
    if (action?.dataset.action === "back") {
      window.history.back();
      return;
    }

    if (action?.dataset.action === "save-preferences") {
      localStorage.setItem(
        "onsite_user_preferences",
        JSON.stringify({
          interests: selectedValues('[data-category="interests"].active'),
          mood: selectedValue('[data-group="mood"] .chip.active'),
          comfort: selectedValue('[data-group="comfort"] .chip.active'),
          amenities: selectedValues('[data-category="amenities"].active'),
          noise: selectedValue('[data-group="noise"] .chip.active'),
        }),
      );
      window.location.href = "/dashboard";
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

  function handleSubmit(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLElement | null;
    if (form?.closest('[data-action="login"]')) {
      event.preventDefault();
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className={bodyClassName} onClick={handleClick} onSubmit={handleSubmit}>
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

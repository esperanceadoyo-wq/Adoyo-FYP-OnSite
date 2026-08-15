"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const ROUTE_MOTION_EVENT = "onsite-route-motion-start";

export function startRouteMotion() {
  window.dispatchEvent(new Event(ROUTE_MOTION_EVENT));
}

export function RouteMotion() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    let safetyTimer: number | undefined;

    function start() {
      const root = document.documentElement;
      root.classList.remove("route-complete");
      root.classList.add("route-pending");
      window.clearTimeout(safetyTimer);
      safetyTimer = window.setTimeout(() => {
        root.classList.remove("route-pending");
      }, 8000);
    }

    function handleClick(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const navigation = target?.closest<HTMLElement>(
        "a[href], [data-navigate]",
      );
      if (!navigation) return;

      const href =
        navigation.dataset.navigate ?? navigation.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        navigation.getAttribute("target") === "_blank" ||
        url.href === window.location.href
      ) {
        return;
      }

      start();
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", start);
    window.addEventListener(ROUTE_MOTION_EVENT, start);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", start);
      window.removeEventListener(ROUTE_MOTION_EVENT, start);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const root = document.documentElement;
    root.classList.remove("route-pending");
    root.classList.add("route-complete");
    const completionTimer = window.setTimeout(() => {
      root.classList.remove("route-complete");
    }, 420);

    return () => window.clearTimeout(completionTimer);
  }, [pathname]);

  return <div aria-hidden="true" className="route-progress" />;
}

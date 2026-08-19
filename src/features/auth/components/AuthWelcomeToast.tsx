"use client";

import { useEffect, useState } from "react";

export const AUTH_NOTICE_KEY = "onsite-auth-notice";

type AuthNotice = {
  message: string;
};

export function AuthWelcomeToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function showStoredNotice() {
      const storedNotice = sessionStorage.getItem(AUTH_NOTICE_KEY);
      if (!storedNotice) return;

      sessionStorage.removeItem(AUTH_NOTICE_KEY);
      try {
        const notice = JSON.parse(storedNotice) as AuthNotice;
        if (notice.message) setMessage(notice.message);
      } catch {
        setMessage(null);
      }
    }

    const initialNotice = window.setTimeout(showStoredNotice, 0);
    window.addEventListener(AUTH_NOTICE_KEY, showStoredNotice);
    return () => {
      window.clearTimeout(initialNotice);
      window.removeEventListener(AUTH_NOTICE_KEY, showStoredNotice);
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  if (!message) return null;

  return (
    <div
      aria-live="polite"
      className="auth-welcome-toast fixed right-4 top-4 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-primary/30 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface shadow-xl sm:right-6 sm:top-6"
      role="status"
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary"
      >
        OK
      </span>
      {message}
    </div>
  );
}

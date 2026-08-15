import type { Metadata } from "next";
import { ViewTransition } from "react";
import { AuthWelcomeToast } from "@/components/AuthWelcomeToast";
import { BackToTopButton } from "@/components/BackToTopButton";
import { RouteMotion } from "@/components/RouteMotion";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OnSite",
    template: "%s | OnSite",
  },
  description:
    "OnSite helps international students discover comfortable study spaces and community connections.",
};

const themeScript = `
  try {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.dataset.theme = 'light';
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="scroll-smooth bg-background text-on-background transition-colors duration-300"
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <RouteMotion />
        <AuthWelcomeToast />
        <BackToTopButton />
        <ViewTransition default="onsite-page">{children}</ViewTransition>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatLink = {
  href: string;
  label: string;
};

type ChatResponse = {
  answer: string;
  in_scope: boolean;
  intent: string | null;
  links: ChatLink[];
  suggestions: string[];
};

type Message = {
  id: number;
  links?: ChatLink[];
  role: "assistant" | "user";
  suggestions?: string[];
  text: string;
};

const welcomeMessage: Message = {
  id: 1,
  role: "assistant",
  suggestions: [
    "How do I get started?",
    "What spaces are available?",
    "How do XP and levels work?",
  ],
  text: "Hi! I’m your OnSite Guide. Ask me about onboarding, spaces, check-ins, reflections, or your progress.",
};

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") closeChat();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      messageEndRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [isOpen, messages]);

  function closeChat() {
    setIsOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || isSending) return;

    setInput("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", text: message },
    ]);

    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({
          context_intent: lastIntent,
          message,
          page_path: pathname,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as ChatResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "The OnSite Guide could not answer.");
      }

      setLastIntent(data.intent);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          links: data.links,
          role: "assistant",
          suggestions: data.suggestions,
          text: data.answer,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          suggestions: ["How do I get started?", "What spaces are available?"],
          text: "I couldn’t reach the OnSite help service. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <>
      {isOpen ? (
        <section
          aria-label="OnSite Guide"
          className="app-theme fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-[90] flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest text-on-surface shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(590px,calc(100dvh-3rem))] sm:w-[380px]"
          role="dialog"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-outline-variant bg-primary-container px-4 py-3 text-on-primary-container">
            <GuideMark className="h-10 w-10 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-extrabold">OnSite Guide</h2>
              <p className="text-[11px] font-medium opacity-75">Application help</p>
            </div>
            <button
              aria-label="Close OnSite Guide"
              className="flex h-11 w-11 items-center justify-center rounded-full text-on-primary-container transition-colors hover:bg-on-primary-container/10 focus-visible:bg-on-primary-container/10"
              onClick={closeChat}
              type="button"
            >
              <CloseIcon />
            </button>
          </header>

          <div
            aria-live="polite"
            aria-relevant="additions text"
            className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
            role="log"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onNavigate={closeChat}
                onSuggestion={(suggestion) => void sendMessage(suggestion)}
              />
            ))}
            {isSending ? <TypingIndicator /> : null}
            <div ref={messageEndRef} />
          </div>

          <form
            className="shrink-0 border-t border-outline-variant bg-surface-container-low px-3 py-3"
            onSubmit={submitForm}
          >
            <div className="flex items-end gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-1.5 focus-within:border-primary">
              <label className="sr-only" htmlFor="onsite-chat-input">
                Ask the OnSite Guide
              </label>
              <textarea
                className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-5 text-on-surface outline-none placeholder:text-on-surface-variant"
                disabled={isSending}
                id="onsite-chat-input"
                maxLength={500}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask about OnSite..."
                ref={inputRef}
                rows={1}
                value={input}
              />
              <button
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary transition-[filter,transform] hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSending || !input.trim()}
                type="submit"
              >
                <SendIcon />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-on-surface-variant">
              OnSite help only · Shift+Enter for a new line
            </p>
          </form>
        </section>
      ) : (
        <button
          aria-label="Open OnSite Guide"
          className="app-theme fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary text-on-primary shadow-[0_10px_30px_rgba(42,184,203,0.35)] transition-[transform,filter] hover:-translate-y-1 hover:brightness-105 focus-visible:-translate-y-1 md:bottom-6 md:right-6"
          onClick={() => setIsOpen(true)}
          ref={launcherRef}
          title="Open OnSite Guide"
          type="button"
        >
          <span
            aria-hidden="true"
            className="onsite-chat-pulse absolute inset-0 -z-10 rounded-full border-2 border-primary/40"
          />
          <span className="onsite-chat-launcher flex items-center justify-center">
            <ChatIcon />
          </span>
        </button>
      )}
    </>
  );
}

function ChatMessage({
  message,
  onNavigate,
  onSuggestion,
}: {
  message: Message;
  onNavigate: () => void;
  onSuggestion: (suggestion: string) => void;
}) {
  const isUser = message.role === "user";
  const wrapperClass = isUser ? "flex justify-end" : "flex justify-start";
  const bubbleClass = isUser
    ? "rounded-2xl rounded-br-md bg-primary px-3.5 py-3 text-sm leading-5 text-on-primary"
    : "rounded-2xl rounded-bl-md bg-surface-container-low px-3.5 py-3 text-sm leading-5 text-on-surface";

  return (
    <div className={wrapperClass}>
      <div className="max-w-[88%]">
        <div className={bubbleClass}>{message.text}</div>
        {message.links?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.links.map((link) => (
              <Link
                className="inline-flex min-h-11 items-center rounded-full border border-primary/30 bg-primary-container px-3 py-1.5 text-xs font-bold text-on-primary-container transition-colors hover:bg-primary-container/70"
                href={link.href}
                key={link.href + "-" + link.label}
                onClick={onNavigate}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
        {message.suggestions?.length ? (
          <div className="mt-2 flex flex-col items-start gap-1.5">
            {message.suggestions.map((suggestion) => (
              <button
                className="min-h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-left text-xs font-semibold text-primary transition-colors hover:bg-primary-container"
                key={suggestion}
                onClick={() => onSuggestion(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div aria-label="OnSite Guide is responding" className="flex justify-start">
      <div className="flex h-10 items-center gap-1 rounded-2xl rounded-bl-md bg-surface-container-low px-4">
        {[0, 1, 2].map((index) => (
          <span
            className="onsite-chat-typing h-1.5 w-1.5 rounded-full bg-primary"
            key={index}
            style={{ animationDelay: String(index * 120) + "ms" }}
          />
        ))}
      </div>
    </div>
  );
}

function GuideMark({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={
        "flex items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm " +
        className
      }
    >
      <ChatIcon />
    </span>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 5.75h14v10.5H9l-4 3v-13.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="11" fill="currentColor" r="1" />
      <circle cx="15" cy="11" fill="currentColor" r="1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m4 5 16 7-16 7 3-7-3-7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M7 12h13" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

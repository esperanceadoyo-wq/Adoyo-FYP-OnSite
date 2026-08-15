"use client";

export function PasswordVisibilityButton({
  isVisible,
  label = "password",
  onToggle,
}: {
  isVisible: boolean;
  label?: string;
  onToggle: () => void;
}) {
  return (
    <button
      aria-label={`${isVisible ? "Hide" : "Show"} ${label}`}
      aria-pressed={isVisible}
      className="absolute inset-y-0 right-1 z-10 my-auto h-9 rounded-lg px-3 text-xs font-bold text-primary transition-colors hover:bg-primary-container focus-visible:bg-primary-container"
      onClick={(event) => {
        event.preventDefault();
        onToggle();
      }}
      onMouseDown={(event) => event.preventDefault()}
      type="button"
    >
      {isVisible ? "Hide" : "Show"}
    </button>
  );
}

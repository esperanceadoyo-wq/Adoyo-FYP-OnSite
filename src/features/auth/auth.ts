export type AuthUser = {
  created_at?: string;
  email: string;
  id: number;
  name: string;
  role: string;
};

export type AuthResponse = {
  error?: string;
  user?: AuthUser;
};

export const passwordRules = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    test: (value: string) => /\d/.test(value),
  },
] satisfies Array<{ label: string; test: (value: string) => boolean }>;

export function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateName(value: string) {
  return value.trim().length >= 2;
}

export function validatePassword(value: string) {
  return passwordRules.every((rule) => rule.test(value));
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

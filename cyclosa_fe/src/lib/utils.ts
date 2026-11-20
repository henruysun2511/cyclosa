import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("vi-VN", options).format(new Date(date));
}

export function formatCurrency(
  amount: number,
  currency = "VND",
  locale = "vi-VN"
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount
  );
}

export function buildQueryString(
  params: Record<string, unknown>
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en",
): string {
  try {
    return new Intl.NumberFormat(locale.replace("_", "-"), {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).replace(/\s+\S*$/, "") + "…";
}

export function cnx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "de", "it", "es", "ja", "zh", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});

export const headerNavLinks = [
  { label: "Collection", href: "/products" },
  { label: "Cart", href: "/cart" },
] as const;

export const LOCALE_LABELS: Record<string, string> = {
  en: "English", fr: "Français", de: "Deutsch", it: "Italiano",
  es: "Español", ja: "日本語", zh: "中文", ar: "العربية",
};

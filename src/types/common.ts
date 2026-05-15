export interface PageProps<Params = never> {
  params: Promise<Params>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface LocaleParams {
  locale: string;
}

export interface ProductSlugParams extends LocaleParams {
  slug: string;
}

export type SupportedLocale = "en" | "fr" | "de" | "it" | "es" | "ja" | "zh" | "ar";
export type SupportedCurrency = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "AED" | "SAR" | "CHF";

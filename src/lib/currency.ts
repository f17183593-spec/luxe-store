import "server-only";
import { cookies } from "next/headers";

const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR",
  ES: "EUR", JP: "JPY", CN: "CNY", AE: "AED", SA: "SAR",
  CH: "CHF", CA: "CAD", AU: "AUD", SG: "SGD",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥",
  CNY: "¥", AED: "د.إ", SAR: "﷼", CHF: "CHF",
  CAD: "CA$", AUD: "A$", SGD: "S$",
};

const DEFAULT_CURRENCY = "USD";
const RATES_CACHE_TTL = 3_600_000;

let ratesCache: { rates: Record<string, number>; timestamp: number } | null = null;

export function getCurrencyFromCountry(country: string): string {
  return COUNTRY_CURRENCY[country] ?? DEFAULT_CURRENCY;
}

export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}

async function fetchRates(): Promise<Record<string, number>> {
  if (ratesCache && Date.now() - ratesCache.timestamp < RATES_CACHE_TTL) {
    return ratesCache.rates;
  }

  try {
    const symbols = [...new Set(Object.values(COUNTRY_CURRENCY))].join(",");
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=USD&symbols=${symbols}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error(`Exchange rate API: ${res.status}`);

    const data = (await res.json()) as { rates?: Record<string, number> };
    if (!data.rates) throw new Error("Invalid exchange rate response");

    ratesCache = { rates: data.rates, timestamp: Date.now() };
    return data.rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    if (ratesCache) return ratesCache.rates;
    return { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.5, CNY: 7.24, AED: 3.67, SAR: 3.75, CHF: 0.88, CAD: 1.36, AUD: 1.53, SGD: 1.34 };
  }
}

export async function getSessionCurrency(): Promise<{
  code: string;
  rate: number;
}> {
  try {
    const store = await cookies();
    const stored = store.get("currency")?.value;
    if (stored && COUNTRY_CURRENCY[stored]) {
      const rates = await fetchRates();
      return { code: stored, rate: rates[stored] ?? 1 };
    }
  } catch {
    // cookies() may throw in edge/static rendering
  }

  return { code: DEFAULT_CURRENCY, rate: 1 };
}

export async function convertPrice(
  usdCents: number,
  targetCurrency: string,
): Promise<{ amount: number; formatted: string; code: string }> {
  const rates = await fetchRates();
  const rate = rates[targetCurrency] ?? 1;
  const converted = (usdCents / 100) * rate;

  return {
    amount: Number(converted.toFixed(2)),
    formatted: new Intl.NumberFormat("en", {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: targetCurrency === "JPY" ? 0 : 2,
    }).format(converted),
    code: targetCurrency,
  };
}

export async function formatPriceWithCurrency(
  usdCents: number,
): Promise<{ amount: number; formatted: string; code: string; symbol: string }> {
  const session = await getSessionCurrency();
  const converted = await convertPrice(usdCents, session.code);
  return {
    ...converted,
    symbol: getCurrencySymbol(session.code),
  };
}

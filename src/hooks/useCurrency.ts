"use client";

import { useCallback, useState } from "react";

interface CurrencyState {
  code: string;
  rate: number;
}

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyState>(() => {
    const stored =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((r) => r.startsWith("currency="))
            ?.split("=")[1]
        : undefined;
    return { code: stored ?? "USD", rate: 1 };
  });

  const convert = useCallback(
    (usdCents: number) => {
      return (usdCents / 100) * currency.rate;
    },
    [currency.rate],
  );

  return { currency, convert, setCurrency };
}

import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { geo } = request;

  const response = intlMiddleware(request);

  if (geo?.country && !request.cookies.has("currency")) {
    const country = geo.country;
    const currencyMap: Record<string, string> = {
      US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR",
      ES: "EUR", JP: "JPY", CN: "CNY", AE: "AED", SA: "SAR",
      CH: "CHF", CA: "CAD", AU: "AUD", SG: "SGD",
    };
    const currency = currencyMap[country] ?? "USD";
    response.cookies.set("currency", currency, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      secure: true,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/", "/(en|fr|de|it|es|ja|zh|ar)/:path*", "/((?!_next|studio|api|favicon.ico).*)"],
};

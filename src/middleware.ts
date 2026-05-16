import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { geo } = request as unknown as { geo?: any };

  const response = intlMiddleware(request);

  if (geo?.country) {
    response.headers.set("x-user-country", geo.country);
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
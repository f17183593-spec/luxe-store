import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata() {
  const locale = await getLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: {
      template: "%s | LUXE",
      default: "LUXE — Timeless Elegance",
    },
    description:
      "World-class luxury e-commerce destination. Discover curated collections of exceptional craftsmanship.",
    keywords: [
      "luxury", "ecommerce", "fashion", "jewelry", "designer",
      "high-end", "premium", "curated",
    ],
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      locale,
      siteName: "LUXE",
      title: "LUXE — Timeless Elegance",
      description: "Discover our curated collection of luxury essentials.",
    },
    twitter: {
      card: "summary_large_image",
      title: "LUXE",
      description: "World-class luxury e-commerce destination.",
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    alternates: {
      canonical: siteUrl,
      languages: {
        en: "/en", fr: "/fr", de: "/de", it: "/it",
        es: "/es", ja: "/ja", zh: "/zh", ar: "/ar",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
          className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        >
          <AuthProvider>
            <NextIntlClientProvider messages={messages}>
              <Header locale={locale} />
              <main className="min-h-screen pt-20">{children}</main>
              <Footer locale={locale} />
              <CartDrawer />
            </NextIntlClientProvider>
          </AuthProvider>
        </body>
    </html>
  );
}

import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { CheckoutSummary } from "@/components/cart/CheckoutSummary";
import { Skeleton } from "@/components/ui/Skeleton";

function CheckoutFallback() {
  return (
    <div className="grid gap-12 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default async function CheckoutPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-normal tracking-wide text-luxe-charcoal sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-12">
        <Suspense fallback={<CheckoutFallback />}>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <CheckoutForm />
            </div>
            <div className="lg:col-span-2">
              <CheckoutSummary locale={locale} />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

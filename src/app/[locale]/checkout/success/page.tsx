import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const locale = await getLocale();
  const sp = await searchParams;

  if (!sp?.session_id) {
    redirect(`/${locale}`);
  }

  return (
    <div className="mx-auto max-w-screen-md px-4 py-24 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-luxe-gold/10">
        <svg
          className="h-10 w-10 text-luxe-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="font-display text-4xl font-normal tracking-wide text-luxe-charcoal sm:text-5xl">
        Order Confirmed
      </h1>
      <p className="mt-4 text-base leading-relaxed text-luxe-charcoal/60 max-w-md mx-auto">
        Thank you for your purchase. You will receive a confirmation email with
        your order details shortly.
      </p>

      <div className="mt-4 text-sm text-luxe-charcoal/30">
        Session: {sp.session_id.slice(0, 14)}...
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <a href={`/${locale}`}>
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </a>
      </div>
    </div>
  );
}

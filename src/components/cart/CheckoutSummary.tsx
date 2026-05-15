"use client";

import { useCartStore } from "@/lib/cart-store";

interface CheckoutSummaryProps {
  locale: string;
}

export function CheckoutSummary({ locale }: CheckoutSummaryProps) {
  const items = useCartStore((s) => s.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-luxe-cream p-6 sm:p-8">
        <h3 className="text-xs tracking-[0.2em] uppercase text-luxe-charcoal/50">
          Order Summary
        </h3>
        <p className="mt-6 text-sm text-luxe-charcoal/30">
          No items in cart.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-luxe-cream p-6 sm:p-8">
      <h3 className="text-xs tracking-[0.2em] uppercase text-luxe-charcoal/50">
        Order Summary
      </h3>

      <div className="mt-6 divide-y divide-luxe-silver/20">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 py-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-luxe-silver/20">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <p className="truncate text-sm text-luxe-charcoal/80">
                  {item.title}
                </p>
                <p className="text-[10px] text-luxe-charcoal/40">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="flex-shrink-0 text-sm text-luxe-charcoal/60">
                ${((item.price * item.quantity) / 100).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-luxe-silver/30 pt-4">
        <div className="flex justify-between text-sm text-luxe-charcoal/60">
          <span>Subtotal</span>
          <span>${(total / 100).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-luxe-charcoal/40">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between border-t border-luxe-silver/20 pt-3 font-display text-lg text-luxe-charcoal">
          <span>Total</span>
          <span>${(total / 100).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

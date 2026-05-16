import { NextRequest, NextResponse } from "next/server";
import { stripe, getSiteUrl } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { items, locale } = await req.json();
    const origin = getSiteUrl();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Product",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
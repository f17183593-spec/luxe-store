import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 },
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata ?? {};

        console.info(
          `Order completed: ${session.id}`,
          {
            email: session.customer_details?.email,
            amount: session.amount_total,
            locale: metadata.locale,
            items: metadata.items,
          },
        );
        break;
      }

      case "checkout.session.expired": {
        const expired = event.data.object;
        console.info(`Checkout session expired: ${expired.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const failed = event.data.object;
        console.error(
          `Payment failed: ${failed.id}`,
          failed.last_payment_error?.message,
        );
        break;
      }

      default:
        console.debug(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

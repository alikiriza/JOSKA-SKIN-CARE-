import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("Payment succeeded:", paymentIntent.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

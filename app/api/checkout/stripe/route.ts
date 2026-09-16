import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, address, deliveryFee } = body;

    if (!items?.length || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.price) * item.qty, 0);
    const total = Math.round((subtotal + (deliveryFee || 0)) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "kes",
      automatic_payment_methods: { enabled: true },
      metadata: { orderItems: JSON.stringify(items) },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Payment initiation failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invalidateTag, tags } from "@/lib/cache";

function generateOrderNumber() {
  const prefix = "JOS";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, address, deliveryFee } = body;

    if (!items?.length || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.productId);
    const products = await db.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const subtotal = items.reduce((sum: number, item: any) => {
      const product = productMap.get(item.productId);
      return sum + Number(product?.price || 0) * item.qty;
    }, 0);

    const total = subtotal + (deliveryFee || 0);

    const user = await db.user.findFirst();
    const userId = user?.id;

    const addressRecord = await db.address.create({
      data: {
        userId: userId || "placeholder",
        fullName: address.fullName,
        country: address.country || "Uganda",
        city: address.city,
        street: address.street,
        postalCode: address.postalCode,
        phone: address.phone,
      },
    });

    const order = await db.order.create({
      data: {
        userId: userId || "placeholder",
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        subtotal,
        deliveryFee: deliveryFee || 0,
        total,
        shippingAddressId: addressRecord.id,
        items: {
          create: items.map((item: any) => {
            const product = productMap.get(item.productId);
            return {
              productId: item.productId,
              productName: product?.name || "Unknown",
              productImage: (product?.images as string[])?.[0] || "",
              qty: item.qty,
              price: item.price,
            };
          }),
        },
      },
    });

    await invalidateTag(tags.orders);

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}

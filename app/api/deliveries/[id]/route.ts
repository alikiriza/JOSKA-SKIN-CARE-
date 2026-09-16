import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invalidateTag, tags } from "@/lib/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const allowedTransitions: Record<string, string[]> = {
      ASSIGNED: ["PICKED_UP", "CANCELLED"],
      PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
      IN_TRANSIT: ["DELIVERED", "CANCELLED"],
      DELIVERED: [],
    };

    const current = await db.delivery.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    const allowed = allowedTransitions[current.status] || [];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: `Cannot transition from ${current.status} to ${status}` }, { status: 400 });
    }

    const timestampField: Record<string, string> = {
      PICKED_UP: "pickedUpAt",
      IN_TRANSIT: "inTransitAt",
      DELIVERED: "deliveredAt",
    };

    const updateData: Record<string, unknown> = { status };
    if (timestampField[status]) {
      updateData[timestampField[status]] = new Date();
    }

    const delivery = await db.delivery.update({ where: { id }, data: updateData });

    if (status === "DELIVERED") {
      await db.order.update({ where: { id: current.orderId }, data: { status: "DELIVERED" } });
    }

    await invalidateTag(tags.orders);

    return NextResponse.json(delivery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 500 });
  }
}

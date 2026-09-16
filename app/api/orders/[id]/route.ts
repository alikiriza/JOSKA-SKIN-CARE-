import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invalidateTag, tags } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      items: true,
      address: true,
      delivery: { include: { rider: { select: { id: true, name: true } } } },
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const order = await db.order.update({ where: { id }, data: body });
  await invalidateTag(`orders:*`);
  return NextResponse.json(order);
}

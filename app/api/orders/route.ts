import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCachedOrFetch, invalidateTag, tags } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const cacheKey = `orders:list:${status}:${page}:${limit}`;
  const data = await getCachedOrFetch(
    cacheKey,
    async () => {
      const [orders, total] = await Promise.all([
        db.order.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: { select: { id: true, productName: true, qty: true, price: true } },
          },
        }),
        db.order.count({ where }),
      ]);
      return { orders, total, page, totalPages: Math.ceil(total / limit) };
    },
    60
  );
  return NextResponse.json(data);
}

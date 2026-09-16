import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCachedOrFetch, tags } from "@/lib/cache";

export async function GET() {
  const data = await getCachedOrFetch(
    tags.analytics,
    async () => {
      const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
        db.user.count(),
        db.product.count({ where: { isActive: true } }),
        db.order.count(),
        db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      ]);
      const totalRevenue = revenueResult._sum.total ? Number(revenueResult._sum.total) : 0;
      return { totalUsers, totalProducts, totalOrders, totalRevenue };
    },
    120
  );
  return NextResponse.json(data);
}

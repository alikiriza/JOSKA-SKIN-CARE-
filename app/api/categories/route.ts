import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCachedOrFetch, tags } from "@/lib/cache";

export async function GET() {
  const categories = await getCachedOrFetch(tags.categories, () =>
    db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    }),
    300
  );
  return NextResponse.json(categories);
}

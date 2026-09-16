import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCachedOrFetch, invalidateTag, tags } from "@/lib/cache";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (category) where.category = { slug: category };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "name" ? { name: "asc" } :
    { createdAt: "desc" };

  const cacheKey = `products:${search}:${category}:${sort}:${page}:${limit}`;
  const data = await getCachedOrFetch(
    cacheKey,
    async () => {
      const [products, total] = await Promise.all([
        db.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: { category: { select: { name: true, slug: true } } },
        }),
        db.product.count({ where }),
      ]);
      return { products, total, page, totalPages: Math.ceil(total / limit) };
    },
    120
  );

  return NextResponse.json(data);
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

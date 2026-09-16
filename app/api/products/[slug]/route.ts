import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCachedOrFetch, tags } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getCachedOrFetch(
    `${tags.products}${slug}`,
    () =>
      db.product.findUnique({
        where: { slug, isActive: true },
        include: {
          category: { select: { name: true, slug: true } },
          reviews: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    120
  );

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

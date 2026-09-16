import { Suspense } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { db } from "@/lib/db";
import ProductsLoading from "./loading";
import type { Prisma } from "@/lib/generated/prisma/client";

type SearchParams = Promise<{ search?: string; category?: string; sort?: string; page?: string }>;

function SortSelect({ current }: { current: string }) {
  const options = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name", label: "Name" },
  ];
  return (
    <select
      name="sort"
      defaultValue={current}
      className="h-10 rounded-lg border border-sage-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-sage-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const { search, category, sort, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const limit = 12;

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (category) where.category = { slug: category };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "name" ? { name: "asc" } :
    { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * limit,
      take: limit,
      include: { category: { select: { name: true, slug: true } } },
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (page) params.set("page", page);
    for (const [key, val] of Object.entries(overrides)) {
      if (val) params.set(key, val);
      else params.delete(key);
    }
    return `/products?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            {category ? categories.find((c) => c.slug === category)?.name || "Products" : "All Products"}
          </h1>
          <p className="mt-2 text-neutral-500">{total} product{total !== 1 ? "s" : ""}</p>
        </div>

        <form className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search products..."
              className="border-sage-200 pl-10"
            />
          </div>
          <SortSelect current={sort || "newest"} />
          <Button variant="ghost" size="icon" aria-label="Filters" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </form>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({ category: undefined, page: "1" })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !category ? "bg-sage-600 text-white" : "bg-sage-50 text-neutral-600 hover:bg-sage-100"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildUrl({ category: c.slug, page: "1" })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c.slug ? "bg-sage-600 text-white" : "bg-sage-50 text-neutral-600 hover:bg-sage-100"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-neutral-500">No products found</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/products">Clear filters</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <Card className="overflow-hidden border-sage-100 transition-shadow duration-200 hover:shadow-product">
                  <div className="aspect-square bg-sage-50" />
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-sage-600">{product.category.name}</p>
                    <h3 className="mt-1 font-display font-semibold text-neutral-900 group-hover:text-sage-600">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        UGX {Number(product.price).toFixed(2)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-neutral-400 line-through">
                          UGX {Number(product.comparePrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildUrl({ page: String(p) })}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-sage-600 text-white"
                    : "bg-white text-neutral-600 hover:bg-sage-50"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ProductsLoading />}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </>
  );
}

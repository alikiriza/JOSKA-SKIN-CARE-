import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import type { SearchParams } from "next/dist/server/request/search-params";

export const dynamic = 'force-dynamic';

type SP = Promise<{ page?: string }>;

async function ProductsTable({ searchParams }: { searchParams: SP }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const limit = 20;

  const [products, total] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
      include: { category: { select: { name: true } } },
    }),
    db.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Products ({total})</h1>
        <Button asChild>
          <Link href="/dashboard/products/new" className="gap-2">
            <Plus className="h-4 w-4" /> New Product
          </Link>
        </Button>
      </div>

      <Card className="border-sage-100">
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No products yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Product</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Category</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Price</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Stock</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-sage-50" />
                          <span className="font-medium text-neutral-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{product.category.name}</td>
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        UGX {Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/products/${product.slug}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/dashboard/products?page=${p}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                p === currentPage ? "bg-sage-600 text-white" : "bg-white text-neutral-600 hover:bg-sage-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense fallback={<div className="h-[400px] animate-pulse rounded-xl bg-sage-50" />}>
      <ProductsTable searchParams={searchParams} />
    </Suspense>
  );
}

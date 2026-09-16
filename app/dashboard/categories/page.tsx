import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function CategoriesList() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">Categories</h1>
      <Card className="border-sage-100">
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No categories yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Name</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Slug</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Products</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">{cat.name}</td>
                      <td className="px-6 py-4 text-neutral-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-neutral-600">{cat._count.products}</td>
                      <td className="px-6 py-4 text-neutral-500 text-xs">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="h-[300px] animate-pulse rounded-xl bg-sage-50" />}>
      <CategoriesList />
    </Suspense>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { AddToCartButton } from "./add-to-cart-button";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-sage-50" />

        <div className="flex flex-col gap-6">
          <div>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm font-medium text-sage-600 hover:text-sage-700"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-1 font-display text-3xl font-bold text-neutral-900">{product.name}</h1>
          </div>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-500">
                {avgRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-neutral-900">
              UGX {Number(product.price).toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-neutral-400 line-through">
                UGX {Number(product.comparePrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="leading-relaxed text-neutral-600">{product.description}</p>

          <div className="flex items-center gap-4">
            <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-xs">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>

          {product.stock > 0 && (
            <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
          )}

          {product.ingredients && (
            <div>
              <h3 className="font-display font-semibold text-neutral-900">Ingredients</h3>
              <p className="mt-1 text-sm text-neutral-500">{product.ingredients}</p>
            </div>
          )}

          {product.usage && (
            <div>
              <h3 className="font-display font-semibold text-neutral-900">How to Use</h3>
              <p className="mt-1 text-sm text-neutral-500">{product.usage}</p>
            </div>
          )}
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="mt-8 space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-sage-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sage-100" />
                  <div>
                    <p className="font-medium text-neutral-900">{review.user.name || "Anonymous"}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm text-neutral-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}

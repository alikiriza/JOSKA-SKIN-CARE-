import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { db } from "@/lib/db";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let categories: any[] = [];
  try {
    [featuredProducts, categories] = await Promise.all([
      db.product.findMany({
        where: { isFeatured: true, isActive: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true, slug: true } } },
      }),
      db.category.findMany({
        orderBy: { name: "asc" },
        take: 6,
      }),
    ]);
  } catch {} // DB not available during build

  return (
    <div>
      <Navbar />
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-50 to-cream-200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-sage-900 sm:text-5xl lg:text-6xl">
              Natural Skincare for{" "}
              <span className="text-sage-600">Radiant Skin</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-600">
              Handcrafted with organic ingredients. Cruelty-free. Made with love in Uganda.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/products?sort=newest">View New Arrivals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Leaf, title: "100% Natural", text: "Plant-based ingredients, no harsh chemicals" },
            { icon: Sparkles, title: "Cruelty-Free", text: "Never tested on animals. Ever." },
            { icon: Truck, title: "Free Delivery", text: "Free shipping on orders over UGX 5,000" },
          ].map((item) => (
            <Card key={item.title} className="border-sage-100 bg-white text-center">
              <CardContent className="flex flex-col items-center gap-3 py-8">
                <div className="rounded-full bg-sage-100 p-3">
                  <item.icon className="h-6 w-6 text-sage-600" />
                </div>
                <h3 className="font-display text-lg font-semibold text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="bg-cream-100 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-neutral-900 sm:text-3xl">Featured Products</h2>
              <Button variant="ghost" asChild>
                <Link href="/products" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <Card className="overflow-hidden border-sage-100 transition-shadow duration-200 hover:shadow-product">
                    <div className="aspect-square bg-sage-50" />
                    <CardContent className="p-4">
                      <p className="text-xs font-medium text-sage-600">{product.category.name}</p>
                      <h3 className="mt-1 font-display font-semibold text-neutral-900 group-hover:text-sage-600">
                        {product.name}
                      </h3>
                      <p className="mt-2 font-medium text-neutral-900">
                        UGX {Number(product.price).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-2xl font-bold text-neutral-900 sm:text-3xl">Shop by Category</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-sage-100 bg-white p-6 transition-shadow hover:shadow-product"
                >
                  <div className="h-16 w-16 rounded-full bg-sage-50" />
                  <h3 className="text-center font-display text-sm font-semibold text-neutral-900 group-hover:text-sage-600">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

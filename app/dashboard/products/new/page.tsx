"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-2xl font-bold text-neutral-900">New Product</h1>
      </div>

      <form className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-sage-100">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="e.g. Vitamin C Brightening Serum" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="e.g. vitamin-c-brightening-serum" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} placeholder="Product description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (UGX)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price (optional)</Label>
                  <Input id="comparePrice" name="comparePrice" type="number" step="0.01" min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" min="0" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="categoryId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display font-semibold text-neutral-900">Details</h3>
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea id="ingredients" name="ingredients" rows={3} placeholder="List of ingredients..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage">Usage Instructions</Label>
                <Textarea id="usage" name="usage" rows={3} placeholder="How to use..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-sage-100">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display font-semibold text-neutral-900">Visibility</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch id="isActive" name="isActive" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <Switch id="isFeatured" name="isFeatured" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-100">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display font-semibold text-neutral-900">Product Image</h3>
              <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-sage-200 bg-sage-50">
                <p className="text-sm text-neutral-400">Click to upload</p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

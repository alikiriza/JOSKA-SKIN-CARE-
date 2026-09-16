"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";

export default function ReviewsPage() {
  const { data: session } = useSession();

  const reviews: any[] = [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">My Reviews</h1>

      {reviews.length === 0 ? (
        <Card className="border-sage-100">
          <CardContent className="py-12 text-center">
            <Star className="mx-auto h-12 w-12 text-neutral-300" />
            <p className="mt-4 text-neutral-500">No reviews yet.</p>
            <p className="mt-1 text-sm text-neutral-400">Reviews you write will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <Card key={review.id} className="border-sage-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}`} />
                  ))}
                </div>
                {review.comment && <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

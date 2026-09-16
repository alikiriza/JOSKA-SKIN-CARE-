"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DeliveryStatusUpdate({
  deliveryId,
  currentStatus,
  nextStatus,
}: {
  deliveryId: string;
  currentStatus: string;
  nextStatus: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/deliveries/${deliveryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!nextStatus || currentStatus === "DELIVERED") {
    return null;
  }

  return (
    <Card className="border-sage-100">
      <CardContent className="p-6 text-center">
        <Button onClick={handleUpdate} disabled={loading} size="lg" className="w-full gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Updating..." : `Mark as ${nextStatus.replace(/_/g, " ")}`}
        </Button>
      </CardContent>
    </Card>
  );
}

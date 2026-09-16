"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statuses = ["PENDING", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED"];

export function StatusUpdateForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    if (status === currentStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-sage-100">
      <CardContent className="p-6">
        <h2 className="font-display text-lg font-semibold text-neutral-900">Update Status</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleUpdate} disabled={loading || status === currentStatus} size="sm">
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

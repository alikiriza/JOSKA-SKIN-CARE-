import { Badge } from "@/components/ui/badge";

const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DELIVERED: "default",
  CANCELLED: "destructive",
  PENDING: "secondary",
  PROCESSING: "outline",
  PACKED: "outline",
  DISPATCHED: "outline",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return <Badge variant={colors[status] || "outline"}>{status}</Badge>;
}

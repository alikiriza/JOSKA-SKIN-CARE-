import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function RidersList() {
  const riders = await db.user.findMany({
    where: { role: "RIDER" },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, emailVerified: true, createdAt: true, _count: { select: { deliveries: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">Riders</h1>
      <Card className="border-sage-100">
        <CardContent className="p-0">
          {riders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No riders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Name</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Email</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Deliveries</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Verified</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider) => (
                    <tr key={rider.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">{rider.name || "N/A"}</td>
                      <td className="px-6 py-4 text-neutral-600">{rider.email}</td>
                      <td className="px-6 py-4 text-neutral-600">{rider._count.deliveries}</td>
                      <td className="px-6 py-4">
                        <Badge variant={rider.emailVerified ? "default" : "destructive"}>
                          {rider.emailVerified ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {new Date(rider.createdAt).toLocaleDateString()}
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

export default function RidersPage() {
  return (
    <Suspense fallback={<div className="h-[300px] animate-pulse rounded-xl bg-sage-50" />}>
      <RidersList />
    </Suspense>
  );
}

import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import type { SearchParams } from "next/dist/server/request/search-params";

export const dynamic = 'force-dynamic';

type SP = Promise<{ page?: string }>;

async function UsersTable({ searchParams }: { searchParams: SP }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const limit = 20;

  const [users, total] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
      select: { id: true, name: true, email: true, role: true, emailVerified: true, createdAt: true },
    }),
    db.user.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">Users ({total})</h1>
      <Card className="border-sage-100">
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">No users yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-100 text-left">
                    <th className="px-6 py-4 font-medium text-neutral-500">Name</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Email</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Role</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Verified</th>
                    <th className="px-6 py-4 font-medium text-neutral-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-sage-50 hover:bg-sage-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">{user.name || "N/A"}</td>
                      <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.emailVerified ? "default" : "destructive"}>
                          {user.emailVerified ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString()}
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
            <a
              key={p}
              href={`/dashboard/users?page=${p}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                p === currentPage ? "bg-sage-600 text-white" : "bg-white text-neutral-600 hover:bg-sage-50"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UsersPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense fallback={<div className="h-[400px] animate-pulse rounded-xl bg-sage-50" />}>
      <UsersTable searchParams={searchParams} />
    </Suspense>
  );
}

"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-neutral-900">Profile</h1>
      <Card className="border-sage-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
              <User className="h-8 w-8 text-sage-600" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-neutral-900">{user?.name || "User"}</h2>
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

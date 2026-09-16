"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await authClient.requestPasswordReset({ email });

    if (err) {
      setError(err.message || "Failed to send reset email");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-h2">Check your email</CardTitle>
            <CardDescription>
              If an account exists with that email, we&apos;ve sent password reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/sign-in">
              <Button variant="outline">Back to sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-h2">Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-error-600">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/auth/sign-in" className="text-sm text-sage-600 hover:underline underline-offset-4">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-h2">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email. Click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-neutral-500">
            Didn&apos;t receive the email? Check your spam folder.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex h-11 items-center rounded-[10px] bg-sage-600 px-5 text-sm font-medium text-white hover:bg-sage-700 transition-colors"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

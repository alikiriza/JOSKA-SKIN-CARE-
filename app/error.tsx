"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <span className="text-8xl font-display font-bold text-error-600">!</span>
      </div>
      <h1 className="font-display text-h1 text-neutral-900 mb-3">Something went wrong</h1>
      <p className="text-body text-neutral-500 max-w-md mb-8">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <button
        onClick={reset}
        className="inline-flex h-11 items-center rounded-[10px] bg-sage-600 px-5 text-sm font-medium text-white hover:bg-sage-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <span className="text-8xl font-display font-bold text-sage-600">404</span>
      </div>
      <h1 className="font-display text-h1 text-neutral-900 mb-3">Page not found</h1>
      <p className="text-body text-neutral-500 max-w-md mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded-[10px] bg-sage-600 px-5 text-sm font-medium text-white hover:bg-sage-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}

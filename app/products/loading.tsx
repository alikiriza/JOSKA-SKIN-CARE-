export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-10 w-48 animate-pulse rounded bg-sage-100" />
      <div className="mt-4 h-6 w-72 animate-pulse rounded bg-sage-50" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-sage-100 bg-white">
            <div className="aspect-square animate-pulse bg-sage-50" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-sage-100" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-sage-100" />
              <div className="h-4 w-20 animate-pulse rounded bg-sage-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
        >
          <div className="aspect-square animate-pulse bg-gray-100" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 mb-6 h-12 animate-pulse rounded bg-gray-50" />
      <ProductGridSkeleton count={15} />
    </div>
  );
}

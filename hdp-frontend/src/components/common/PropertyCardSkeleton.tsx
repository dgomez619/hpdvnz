export const PropertyCardSkeleton = () => (
  <article aria-hidden="true" className="animate-pulse">
    <div className="skeleton-shimmer aspect-4/5 w-full rounded-sm" />
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="h-6 w-3/5 rounded bg-slate-200" />
        <div className="h-4 w-10 rounded bg-slate-200" />
      </div>
      <div className="h-4 w-2/5 rounded bg-slate-100" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
      <div className="flex justify-between border-t border-slate-100 pt-3">
        <div className="h-4 w-1/3 rounded bg-slate-100" />
        <div className="h-4 w-1/4 rounded bg-slate-200" />
      </div>
    </div>
  </article>
);

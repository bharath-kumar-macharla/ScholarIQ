export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="h-8 bg-slate-800 rounded w-1/4 animate-pulse"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-800"></div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-800"></div>
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-800"></div>
      </div>
    </div>
  );
}

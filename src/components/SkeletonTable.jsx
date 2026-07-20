function Block({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

export default function SkeletonTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
      <Block className="h-4 w-40 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Block key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

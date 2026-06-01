function Bone({ className }) {
  return <div className={`bg-white/[0.07] animate-pulse rounded-lg ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-dp-card border border-dp-border rounded-2xl overflow-hidden">
      <Bone className="h-44 rounded-none" />
      <div className="p-3 space-y-2.5">
        <Bone className="h-2.5 w-4/5" />
        <Bone className="h-2.5 w-1/2" />
        <Bone className="h-8 rounded-xl mt-1" />
      </div>
    </div>
  )
}

export function ArrivalCardSkeleton() {
  return (
    <div className="shrink-0 w-44 bg-dp-card border border-dp-border rounded-2xl overflow-hidden">
      <Bone className="h-36 rounded-none" />
      <div className="p-3 space-y-2">
        <Bone className="h-2.5 w-3/4" />
        <Bone className="h-2.5 w-1/2" />
      </div>
    </div>
  )
}

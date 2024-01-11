import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="w-full h-16" />

      <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
        <Skeleton className="w-full h-44" />
      </div>
    </div>
  )
}

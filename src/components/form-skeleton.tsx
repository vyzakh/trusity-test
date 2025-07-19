import { Skeleton } from "@heroui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function TwoFactorSkeleton() {
  return (
    <div className="space-y-6">
      {/* Email indicator */}
      <div className="flex items-center justify-center gap-3 rounded-xl bg-muted/50 px-4 py-3 border border-border/50">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Skeleton className="h-12 w-10 rounded-md" />
            <Skeleton className="h-12 w-10 rounded-md" />
            <Skeleton className="h-12 w-10 rounded-md" />
          </div>
          <Skeleton className="h-1 w-4" />
          <div className="flex gap-1">
            <Skeleton className="h-12 w-10 rounded-md" />
            <Skeleton className="h-12 w-10 rounded-md" />
            <Skeleton className="h-12 w-10 rounded-md" />
          </div>
        </div>
      </div>

      {/* Countdown/Resend button */}
      <div className="flex justify-center">
        <Skeleton className="h-9 w-48 rounded-full" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

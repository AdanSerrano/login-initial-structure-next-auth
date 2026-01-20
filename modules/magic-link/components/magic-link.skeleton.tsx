import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function MagicLinkSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-7 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  );
}

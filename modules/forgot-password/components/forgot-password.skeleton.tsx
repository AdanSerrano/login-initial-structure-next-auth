import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ForgotPasswordSkeleton() {
  return (
    <Card className="w-full max-w-md border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-7 w-64 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto mt-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="flex justify-center">
          <Skeleton className="h-4 w-44" />
        </div>
      </CardContent>
    </Card>
  );
}

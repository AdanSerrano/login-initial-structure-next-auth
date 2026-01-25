import { Suspense } from "react";
import { ResendVerificationView } from "@/modules/resend-verification/view/resend-verification.view";
import { ResendVerificationSkeleton } from "@/modules/resend-verification/components/resend-verification.skeleton";

export default function ResendVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
          <ResendVerificationSkeleton />
        </div>
      }
    >
      <ResendVerificationView />
    </Suspense>
  );
}

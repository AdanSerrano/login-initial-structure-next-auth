import { Suspense } from "react";
import { ForgotPasswordView } from "@/modules/forgot-password/view/forgot-password.view";
import { ForgotPasswordSkeleton } from "@/modules/forgot-password/components/forgot-password.skeleton";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
          <ForgotPasswordSkeleton />
        </div>
      }
    >
      <ForgotPasswordView />
    </Suspense>
  );
}

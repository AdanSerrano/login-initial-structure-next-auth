import { Suspense } from "react";
import { LoginView } from "@/modules/login/view/login.view";
import { LoginFormSkeleton } from "@/modules/login/components/login.skeleton";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
          <div className="w-full max-w-md">
            <LoginFormSkeleton />
          </div>
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}

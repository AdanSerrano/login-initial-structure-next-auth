import { Suspense } from "react";
import { RegisterView } from "@/modules/register/view/register.view";
import { RegisterFormSkeleton } from "@/modules/register/components/register.skeleton";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
          <div className="w-full max-w-md">
            <RegisterFormSkeleton />
          </div>
        </div>
      }
    >
      <RegisterView />
    </Suspense>
  );
}

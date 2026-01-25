import { Suspense } from "react";
import { RegisterSuccessView } from "@/modules/register-success/view/register-success.view";
import { RegisterSuccessSkeleton } from "@/modules/register-success/components/register-success.skeleton";

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<RegisterSuccessSkeleton />}>
      <RegisterSuccessView />
    </Suspense>
  );
}

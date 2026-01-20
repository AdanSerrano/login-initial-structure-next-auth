"use client";

import { MagicLinkVerifyView } from "@/modules/magic-link/view/magic-link-verify.view";
import { MagicLinkRequestView } from "@/modules/magic-link/view/magic-link-request.view";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MagicLinkSkeleton } from "@/modules/magic-link/components/magic-link.skeleton";

function MagicLinkContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          <MagicLinkVerifyView token={token} />
        </div>
      </div>
    );
  }

  return <MagicLinkRequestView />;
}

export default function MagicLinkPage() {
  return (
    <Suspense fallback={<MagicLinkSkeleton />}>
      <MagicLinkContent />
    </Suspense>
  );
}

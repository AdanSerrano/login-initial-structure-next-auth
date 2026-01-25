"use client";

import dynamic from "next/dynamic";

const ModeToggle = dynamic(
  () => import("@/components/mode-toggle").then((mod) => mod.ModeToggle),
  { ssr: false }
);

export function ModeToggleWrapper() {
  return <ModeToggle />;
}

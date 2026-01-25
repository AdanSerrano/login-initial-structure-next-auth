"use client";

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(
  () =>
    import("@/components/cookie-consent/cookie-consent").then(
      (mod) => mod.CookieConsentBanner
    ),
  { ssr: false }
);

export function CookieConsentWrapper() {
  return <CookieConsentBanner />;
}

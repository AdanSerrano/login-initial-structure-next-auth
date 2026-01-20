"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ExtendedSession {
  sessionRevoked?: boolean;
}

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    const extendedSession = session as ExtendedSession | null;

    if (
      status === "authenticated" &&
      extendedSession?.sessionRevoked &&
      !isLoggingOut.current
    ) {
      isLoggingOut.current = true;

      signOut({
        callbackUrl: "/login?sessionExpired=true",
        redirect: true,
      });
    }
  }, [session, status, pathname]);

  return <>{children}</>;
}

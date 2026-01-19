import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.includes(pathname);
};

const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.includes(pathname);
};

const isApiAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith(apiAuthPrefix);
};

export const proxy = NextAuth(authConfig).auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (isApiAuthRoute(nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (isAuthRoute(nextUrl.pathname)) {
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(redirectUrl, nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    if (!isAuthRoute(nextUrl.pathname) && !isPublicRoute(nextUrl.pathname)) {
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    }
    return Response.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
    "/",
  ],
};

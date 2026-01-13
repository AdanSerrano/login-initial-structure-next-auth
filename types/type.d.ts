declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    isTwoFactorEnabled?: boolean;
    userName?: string | null;
    role?: Role | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {}
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    isTwoFactorEnabled?: boolean;
    userName?: string | null;
    role?: Role | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

import "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    isTwoFactorEnabled?: boolean;
    userName?: string | null;
    role?: Role | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

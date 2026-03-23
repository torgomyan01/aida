import type { NextAuthOptions } from 'next-auth';

/** Minimal config so the project type-checks; add providers when auth is wired up. */
export const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
};

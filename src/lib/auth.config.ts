import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const adminPasswords: Record<string, string | undefined> = {
  david: process.env.ADMIN_PASSWORD_DAVID,
  kayla: process.env.ADMIN_PASSWORD_KAYLA,
  jack: process.env.ADMIN_PASSWORD_JACK,
};

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = (credentials?.username as string | undefined)?.toLowerCase().trim();
        const password = credentials?.password as string | undefined;

        if (!username || !password) return null;

        const expected = adminPasswords[username];
        if (!expected || password !== expected) return null;

        return {
          id: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      if (isAdminRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
};

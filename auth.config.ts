import type { NextAuthConfig } from 'next-auth';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      const user = await sql<User>`SELECT * FROM users WHERE email=${session.user.email}`;
      session.user.id = token.id as string
      // @ts-expect-error: admin property might not exist on user
      session.user.admin = user.rows[0].admin;
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      console.log('authorized');
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.admin;
      console.log(auth);

      const isOnLogin = nextUrl.pathname === '/login';
      const isOnSignUp = nextUrl.pathname === '/signup';
      const isOnPlanner = nextUrl.pathname.startsWith('/planner');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnLogin) {
        if (isLoggedIn) {
          if (isAdmin) {
            return Response.redirect(new URL('/admin', nextUrl));
          } else {
            return Response.redirect(new URL('/planner', nextUrl));
          }
        }
        return true; // Allow access to the login route
      }

      if (isOnSignUp) {
        if (isLoggedIn) {
          if (isAdmin) {
            return Response.redirect(new URL('/admin', nextUrl));
          } else {
            return Response.redirect(new URL('/planner', nextUrl));
          }
        }
        return true;
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      if (isOnAdmin) {
        if (isAdmin) {
          return true;
        } else {
          return Response.redirect(new URL('/planner', nextUrl));
        }
      }

      if (isOnPlanner) {
        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
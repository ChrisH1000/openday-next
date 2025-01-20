import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('authorized');
      const isLoggedIn = !!auth?.user;

      const isOnPlanner = nextUrl.pathname.startsWith('/planner');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnPlanner || isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/planner', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
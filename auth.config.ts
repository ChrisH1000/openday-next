import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('authorized');
      const isLoggedIn = !!auth?.user;

      console.log(auth.user)

      // const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      // if (isOnAdmin) {
      //   if (isLoggedIn && auth?.user && !!auth.user.admin) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/admin', nextUrl));
      // }

      const isOnPlanner = nextUrl.pathname.startsWith('/planner');
      if (isOnPlanner) {
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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User as UserModel } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User {
    name: string;
    accessToken: string;
    refreshToken: string;
    exp: string | number;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string;
    };
    accessToken: string;
    refreshToken: string;
    expires?: string | number;
  }
}

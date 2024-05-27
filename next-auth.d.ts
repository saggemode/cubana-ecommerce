import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  email: string | null;
  emailVerified: Date | null
  isBanned: boolean;
  name: string | null;
  image: string | null;
  password: string | null;
  isOAuth: boolean;
  phone: string | null;
  //country: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  accessToken: string; // Add accessToken property
  refreshToken: string; // Add refreshToken property
  exp: number;
  expts: number; // Add expts property

};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

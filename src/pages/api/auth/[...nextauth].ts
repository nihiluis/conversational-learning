import NextAuth from "next-auth"
import AppleProvider from "next-auth/providers/apple"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import GithubProvider from "next-auth/providers/github"
import { prismaClient } from "~/server/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export const authOptions = {
  // Include user data on session
  // callbacks: {
  //   session({ session, user }: any) {
  //     if (session.user) {
  //       session.user.mail = user.mail
  //     }
  //     return session
  //   },
  // },
  // Configure one or more authentication providers
  // adapter: PrismaAdapter(prismaClient),
  providers: [
    // OAuth authentication providers...
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID_DEV!,
      clientSecret: process.env.GITHUB_SECRET_DEV!,
    }),
  ],
}

export default NextAuth(authOptions)

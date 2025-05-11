import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db/db'
import Credentials from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      authorize: async (credentials) => {

        //check to see if there are any credentials
        if (!credentials) return null

        const user = await db.user.findFirst({
          where: {
            email: credentials.email as string
          }
        })

        //check if the users exits and password matches
        if (user?.password && compareSync(credentials.password as string, user.password)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
        //if above fails
        return null
      }
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      //set the user id from the token
      session.user.id = token.sub as string

      //if there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

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
    // eslint-disable-next-line
    async session({ session, user, trigger, token }: any) {
      //set the user id from the token
      session.user.id = token.sub
      session.user.role = token.role
      session.user.name = token.name
      //if there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
    // eslint-disable-next-line
    async jwt({ token, user, trigger, session }: any) {
      //assign user fields to the token

      if (user) {
        token.role = user.role as string

        if (user.name === 'NO_NAME') {
          token.name = user.emai!.split('@')[0]

          //update the db for token name
          await db.user.update({
            where: {
              id: user.id
            },
            data: {
              name: token.name
            }
          })
        }
      }
      return token
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

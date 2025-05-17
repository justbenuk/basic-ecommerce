import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db/db";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        //check to see if there are any credentials
        if (!credentials) return null;

        const user = await db.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //check if the users exits and password matches
        if (
          user?.password &&
          compareSync(credentials.password as string, user.password)
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        //if above fails
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line
    async session({ session, user, trigger, token }: any) {
      //set the user id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      //if there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    // eslint-disable-next-line
    async jwt({ token, user, trigger, session }: any) {
      //assign user fields to the token

      if (user) {
        token.id = user.id;
        token.role = user.role as string;

        if (user.name === "NO_NAME") {
          token.name = user.email.split("@")[0];

          //update the db for token name
          await db.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: token.name,
            },
          });
        }
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await db.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              await db.cart.deleteMany({
                where: { userId: user.id },
              });

              await db.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      //handle session updates
      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    // eslint-disable-next-line
    authorized({ request, auth }: any) {
      //protecting routes
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //get the pathname from the request url object
      const pathname = request.nextUrl;
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      //check for a session cart id
      if (!request.cookies.get("sessionCartId")) {
        //generate a new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        //clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // build the response
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //set the new cart cookie
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

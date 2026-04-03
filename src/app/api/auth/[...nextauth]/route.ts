// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { db } from "@/lib/db";
// import bcrypt from "bcryptjs";

// const handler = NextAuth({
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           return null;
//         }

//         const user = await db.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) {
//           return null;
//         }

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isValid) {
//           return null;
//         }

//         // IMPORTANT: return minimal user object
//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).role = token.role;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };


import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// ✅ Export this separately so you can use it in server components
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;  // ✅ Also store id in token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;  // ✅ Also add id to session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
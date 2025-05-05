import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { CustomUser } from "@/features/users/types";
import { JWT } from "next-auth/jwt";
import axiosInstance from '@/utils/api/axios';

interface CustomToken extends JWT {
  user: CustomUser;
  accessToken?: string;
}

interface CustomSession extends Session {
  user: CustomUser;
  accessToken: string;
}

const authOptions: AuthOptions = {
    pages: {
        signIn: '/auth/login', 
        error: '/auth/error',  
      },
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
      
        try {
          const response = await axiosInstance.post('/auth/token/create/', { email, password });
      
          const user: CustomUser = response.data;
      
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; 
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user as CustomUser;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token as CustomToken;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as CustomUser;
      }
      session.accessToken = token.accessToken as string;
      return session as CustomSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

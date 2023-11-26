import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "@/libs/prismadb";
import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(Credentials) {
        if(!Credentials?.email || !Credentials?.password) {
          throw new Error('Invalid Email or Password');
        }

        const user = await prisma.user.findUnique({
          where: { email: Credentials.email },
        });

        if(!user || !user?.hashedPassword){
          throw new Error('Invalid Email or Password');
        }

        const isCorrect = await bcrypt.compare(Credentials.password, user.hashedPassword);

        if(!isCorrect){
          throw new Error('Invalid Email or Password');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
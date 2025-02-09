import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider  from 'next-auth/providers/credentials'
import { connectToDatabase } from "~/utils/mongodb";
import { NuxtAuthHandler } from '#auth'
import { userSchema } from '~/utils/user/userValidation';

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // @ts-expect-error
    CredentialsProvider.default({
      
      async authorize (credentials: any) {
        const db = await connectToDatabase();
          const collection = db.collection('user');
          const existingUser = await collection.findOne({ email: credentials?.email })
        if (credentials?.email === existingUser.email && credentials?.password === existingUser.password) {
          return existingUser;
        } else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const db = await connectToDatabase();
          const collection = db.collection('user');
          const existingUser = await collection.findOne({ email: user.email })

          if (!existingUser) {
            // Save new user to DB
            const newUser = {
              name: user.name,
              email: user.email,
              image: user.image,
              role: 'user'
            }
              const { error, value } = userSchema.validate(newUser);
              if (error) {
                throw createError({ statusCode: 400, message: error.details[0].message });
              }
            await collection.insertOne(value);
          }
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      const db = await connectToDatabase();
          const collection = db.collection('user');
          if (user) {
        const userInfo = await collection.findOne({ email: user.email})
        token.role = userInfo.role;
        token.email = userInfo.email;
        token.image = userInfo.image
        token.name = userInfo.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
      // @ts-expect-error
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
})
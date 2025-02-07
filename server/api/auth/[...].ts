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
      authorize (credentials: any) {
        const user = { id: '1', name: 'Rithy', username: 'jsmith', password: 'hunter2', role: 'admin' }
        if (credentials?.username === user.username && credentials?.password === user.password) {
          return user
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
          // Check if user already exists
          const existingUser = await collection.findOne({ username: user.email })

          if (!existingUser) {
            // Save new user to DB
            const newUser = {
              name: user.name,
              username: user.email,
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
        const userInfo = await collection.findOne({ username: user.email})
        token.role = userInfo.role;
        token.email = userInfo.username;
        token.picture = userInfo.picture
        token.name = userInfo.name;
      }
      console.log(token)
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
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider  from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

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
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
})
import type { DefaultSession } from 'next-auth'
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      name: string
      username: string
      picture: string
      role: 'user' | 'admin'
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken` */
  interface JWT {
    sessionToken?: string | unknown
  }
}
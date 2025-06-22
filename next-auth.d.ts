import type { DefaultSession } from 'next-auth'
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      name: string
      email: string
      image: string
      role: 'user' | 'admin',
      acceptTermsAt: string
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken` */
  interface JWT {
    sessionToken?: string | unknown
  }
}
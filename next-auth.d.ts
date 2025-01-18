import type { DefaultSession } from 'next-auth'
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      name: string
      email: string
      avatar: string
      role: 'admin' | 'user'
    }
  }
}
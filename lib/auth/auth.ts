import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '@/lib/db/schema/auth'
import { db } from '@/lib/db/db'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  logger: {
    disabled: false,
    level: 'debug',
  },

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),

  emailAndPassword: {
    enabled: false,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      mapProfileToUser: (profile) => {
        return {
          name: profile.name || profile.email.split('@')[0],
          email: profile.email,
          emailVerified: profile.email_verified ?? true,
          image: profile.picture,
        }
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // Refresh if last update > 1 day ago
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://oncollably.vercel.app',
  ],
})

export type Session = typeof auth.$Infer.Session

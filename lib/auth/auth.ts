import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '@/lib/db/schema'
import { db } from '@/lib/db/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  user: {
    additionalFields: {
      onboarded: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
      workspaceType: {
        type: 'string',
        required: false,
      },
      handle: {
        type: 'string',
        required: false,
      },
      discord: {
        type: 'string',
        required: false,
      },
      twitter: {
        type: 'string',
        required: false,
      },
      bio: {
        type: 'string',
        required: false,
      },
    },
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
      enabled: false,
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
export type User = typeof auth.$Infer.Session.user

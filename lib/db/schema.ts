import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  onboarded: boolean('onboarded').notNull().default(false),
  workspaceType: text('workspace_type'),
  handle: text('handle'),
  discord: text('discord'),
  twitter: text('twitter'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  issuer: text('issuer'),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const workspace = pgTable('workspace', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  handle: text('handle').notNull().unique(),
  type: text('type').notNull(), // 'project', 'community', 'cm'
  discord: text('discord'),
  twitter: text('twitter'),
  website: text('website'),
  bio: text('bio'),
  ecosystems: text('ecosystems'), // JSON string array or comma-separated
  avatarUrl: text('avatar_url'),
  status: text('status').notNull().default('pending_payment'), // 'pending_payment', 'active'
  paid: boolean('paid').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const workspaceSubscription = pgTable('workspace_subscription', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  polarCheckoutId: text('polar_checkout_id'),
  polarOrderId: text('polar_order_id'),
  polarCustomerId: text('polar_customer_id'),
  amount: integer('amount').notNull().default(1000), // In cents ($10.00)
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull().default('created'), // 'created', 'succeeded', 'failed'
  productType: text('product_type').notNull().default('workspace_activation'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const campaign = pgTable('campaign', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  totalSpots: integer('total_spots').notNull().default(50),
  allocatedSpots: integer('allocated_spots').notNull().default(0),
  claimedSpots: integer('claimed_spots').notNull().default(0),
  allocationType: text('allocation_type').notNull().default('guaranteed'), // 'guaranteed', 'fcfs'
  ecosystem: text('ecosystem').notNull().default('Solana'),
  status: text('status').notNull().default('active'), // 'active', 'ended', 'draft'
  expiresAt: timestamp('expires_at'),
  discordRequirement: boolean('discord_requirement').notNull().default(true),
  twitterRequirement: boolean('twitter_requirement').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const campaignAllocation = pgTable('campaign_allocation', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id')
    .notNull()
    .references(() => campaign.id, { onDelete: 'cascade' }),
  communityWorkspaceId: text('community_workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  allocatedSpots: integer('allocated_spots').notNull().default(10),
  claimedSpots: integer('claimed_spots').notNull().default(0),
  status: text('status').notNull().default('accepted'), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const application = pgTable('application', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id')
    .notNull()
    .references(() => campaign.id, { onDelete: 'cascade' }),
  applicantWorkspaceId: text('applicant_workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  applicantType: text('applicant_type').notNull().default('community'), // 'community', 'cm'
  requestedSpots: integer('requested_spots').notNull().default(10),
  status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'rejected'
  pitchMessage: text('pitch_message'),
  discordInvite: text('discord_invite'),
  cmHandle: text('cm_handle'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const entry = pgTable('entry', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id')
    .notNull()
    .references(() => campaign.id, { onDelete: 'cascade' }),
  userId: text('user_id'),
  walletAddress: text('wallet_address').notNull(),
  discordTag: text('discord_tag'),
  xHandle: text('x_handle'),
  status: text('status').notNull().default('submitted'), // 'submitted', 'verified', 'winner', 'rejected'
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
});

export const cmPortfolio = pgTable('cm_portfolio', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id')
    .references(() => workspace.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  role: text('role').notNull(),
  type: text('type').notNull(),
  dateStr: text('date_str').notNull(),
  status: text('status').notNull().default('Completed'),
  stats: text('stats').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const teamMember = pgTable('team_member', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull().default('manager'), // 'owner', 'admin', 'manager'
  status: text('status').notNull().default('active'), // 'invited', 'active'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
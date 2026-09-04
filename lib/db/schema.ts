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
  ecosystems: text('ecosystems'),
  avatarUrl: text('avatar_url'),
  discordMemberCount: integer('discord_member_count').default(0),
  xFollowerCount: integer('x_follower_count').default(0),
  verifiedMetricsUpdatedAt: timestamp('verified_metrics_updated_at'),
  status: text('status').notNull().default('pending_payment'),
  paid: boolean('paid').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const communityProfile = pgTable('community_profile', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .unique()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  communityType: text('community_type').notNull().default('DAO'), // 'DAO', 'Alpha Group', 'Gaming Guild', 'NFT Community'
  membersCount: integer('members_count').notNull().default(0),
  discordServerId: text('discord_server_id'),
  discordInviteUrl: text('discord_invite_url'),
  xHandle: text('x_handle'),
  xFollowerCount: integer('x_follower_count').notNull().default(0),
  verifiedMetricsUpdatedAt: timestamp('verified_metrics_updated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cmProfile = pgTable('cm_profile', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id')
    .notNull()
    .unique()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  experienceYears: integer('experience_years').notNull().default(1),
  primaryEcosystems: text('primary_ecosystems'),
  xHandle: text('x_handle'),
  xFollowerCount: integer('x_follower_count').notNull().default(0),
  discordUsername: text('discord_username'),
  verifiedDealsCount: integer('verified_deals_count').notNull().default(0),
  bio: text('bio'),
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
  allocationType: text('allocation_type').notNull().default('guaranteed'),
  ecosystem: text('ecosystem').notNull().default('Solana'),
  status: text('status').notNull().default('active'),
  expiresAt: timestamp('expires_at'),
  walletSubmissionDeadline: timestamp('wallet_submission_deadline'),
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
  deadline: timestamp('deadline'),
  status: text('status').notNull().default('accepted'), // 'accepted', 'completed', 'expired'
  submittedAt: timestamp('submitted_at'),
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
  representedCommunityWorkspaceId: text('represented_community_workspace_id'),
  representedCommunityName: text('represented_community_name'),
  representedCommunityType: text('represented_community_type'),
  discordMemberCount: integer('discord_member_count').default(0),
  xFollowerCount: integer('x_follower_count').default(0),
  xHandle: text('x_handle'),
  applicantType: text('applicant_type').notNull().default('community'),
  requestedSpots: integer('requested_spots').notNull().default(10),
  status: text('status').notNull().default('pending'),
  pitchMessage: text('pitch_message'),
  discordInvite: text('discord_invite'),
  cmHandle: text('cm_handle'),
  deadline: timestamp('deadline'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const entry = pgTable('entry', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id')
    .notNull()
    .references(() => campaign.id, { onDelete: 'cascade' }),
  allocationId: text('allocation_id'),
  submittedByWorkspaceId: text('submitted_by_workspace_id'),
  userId: text('user_id'),
  walletAddress: text('wallet_address').notNull(),
  discordTag: text('discord_tag'),
  xHandle: text('x_handle'),
  status: text('status').notNull().default('submitted'),
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
  role: text('role').notNull().default('manager'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const communityRepresentative = pgTable('community_representative', {
  id: text('id').primaryKey(),
  communityWorkspaceId: text('community_workspace_id')
    .notNull()
    .references(() => workspace.id, { onDelete: 'cascade' }),
  cmWorkspaceId: text('cm_workspace_id'),
  name: text('name').notNull(),
  handle: text('handle').notNull(),
  email: text('email'),
  role: text('role').notNull().default('Collab Manager'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const notification = pgTable('notification', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  workspaceId: text('workspace_id'),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // 'application', 'allocation', 'campaign', 'system', 'entry'
  read: boolean('read').notNull().default(false),
  link: text('link'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
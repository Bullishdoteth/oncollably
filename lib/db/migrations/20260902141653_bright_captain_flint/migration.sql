CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"issuer" text
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" text PRIMARY KEY,
	"campaign_id" text NOT NULL,
	"applicant_workspace_id" text NOT NULL,
	"applicant_type" text DEFAULT 'community' NOT NULL,
	"requested_spots" integer DEFAULT 10 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"pitch_message" text,
	"discord_invite" text,
	"cm_handle" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"total_spots" integer DEFAULT 50 NOT NULL,
	"allocated_spots" integer DEFAULT 0 NOT NULL,
	"claimed_spots" integer DEFAULT 0 NOT NULL,
	"allocation_type" text DEFAULT 'guaranteed' NOT NULL,
	"ecosystem" text DEFAULT 'Solana' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"expires_at" timestamp,
	"discord_requirement" boolean DEFAULT true NOT NULL,
	"twitter_requirement" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_allocation" (
	"id" text PRIMARY KEY,
	"campaign_id" text NOT NULL,
	"community_workspace_id" text NOT NULL,
	"allocated_spots" integer DEFAULT 10 NOT NULL,
	"claimed_spots" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'accepted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cm_portfolio" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"workspace_id" text,
	"title" text NOT NULL,
	"role" text NOT NULL,
	"type" text NOT NULL,
	"date_str" text NOT NULL,
	"status" text DEFAULT 'Completed' NOT NULL,
	"stats" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cm_profile" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL UNIQUE,
	"experience_years" integer DEFAULT 1 NOT NULL,
	"primary_ecosystems" text,
	"x_handle" text,
	"x_follower_count" integer DEFAULT 0 NOT NULL,
	"discord_username" text,
	"verified_deals_count" integer DEFAULT 0 NOT NULL,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_profile" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL UNIQUE,
	"community_type" text DEFAULT 'DAO' NOT NULL,
	"members_count" integer DEFAULT 0 NOT NULL,
	"discord_server_id" text,
	"discord_invite_url" text,
	"x_handle" text,
	"x_follower_count" integer DEFAULT 0 NOT NULL,
	"verified_metrics_updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entry" (
	"id" text PRIMARY KEY,
	"campaign_id" text NOT NULL,
	"user_id" text,
	"wallet_address" text NOT NULL,
	"discord_tag" text,
	"x_handle" text,
	"status" text DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'manager' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"onboarded" boolean DEFAULT false NOT NULL,
	"workspace_type" text,
	"handle" text,
	"discord" text,
	"twitter" text,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"handle" text NOT NULL UNIQUE,
	"type" text NOT NULL,
	"discord" text,
	"twitter" text,
	"website" text,
	"bio" text,
	"ecosystems" text,
	"avatar_url" text,
	"discord_member_count" integer DEFAULT 0,
	"x_follower_count" integer DEFAULT 0,
	"verified_metrics_updated_at" timestamp,
	"status" text DEFAULT 'pending_payment' NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_subscription" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"polar_checkout_id" text,
	"polar_order_id" text,
	"polar_customer_id" text,
	"amount" integer DEFAULT 1000 NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"status" text DEFAULT 'created' NOT NULL,
	"product_type" text DEFAULT 'workspace_activation' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_campaign_id_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_applicant_workspace_id_workspace_id_fkey" FOREIGN KEY ("applicant_workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "campaign_allocation" ADD CONSTRAINT "campaign_allocation_campaign_id_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "campaign_allocation" ADD CONSTRAINT "campaign_allocation_community_workspace_id_workspace_id_fkey" FOREIGN KEY ("community_workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cm_portfolio" ADD CONSTRAINT "cm_portfolio_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cm_portfolio" ADD CONSTRAINT "cm_portfolio_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cm_profile" ADD CONSTRAINT "cm_profile_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "community_profile" ADD CONSTRAINT "community_profile_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_campaign_id_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_subscription" ADD CONSTRAINT "workspace_subscription_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_subscription" ADD CONSTRAINT "workspace_subscription_workspace_id_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;
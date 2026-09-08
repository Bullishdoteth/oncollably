ALTER TABLE "application" ADD COLUMN IF NOT EXISTS "vetting_status" text DEFAULT 'passed' NOT NULL;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN IF NOT EXISTS "vetting_details" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "spots_per_community" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "min_discord_members" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "min_x_followers" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "min_cm_experience_years" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "require_discord_verification" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "require_x_verification" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "allowed_community_types" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN IF NOT EXISTS "custom_requirements" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "community_profile" ADD COLUMN IF NOT EXISTS "discord_bot_installed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "community_profile" ADD COLUMN IF NOT EXISTS "discord_roles_cache" text;--> statement-breakpoint
ALTER TABLE "community_profile" ADD COLUMN IF NOT EXISTS "discord_owner_id" text;--> statement-breakpoint
ALTER TABLE "community_profile" ADD COLUMN IF NOT EXISTS "discord_owner_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "community_profile" ADD COLUMN IF NOT EXISTS "discord_last_verified_at" timestamp;
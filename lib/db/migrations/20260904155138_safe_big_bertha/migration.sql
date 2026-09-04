CREATE TABLE "community_representative" (
	"id" text PRIMARY KEY,
	"community_workspace_id" text NOT NULL,
	"cm_workspace_id" text,
	"name" text NOT NULL,
	"handle" text NOT NULL,
	"email" text,
	"role" text DEFAULT 'Collab Manager' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY,
	"user_id" text,
	"workspace_id" text,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"link" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "represented_community_workspace_id" text;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "represented_community_name" text;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "represented_community_type" text;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "discord_member_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "x_follower_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "x_handle" text;--> statement-breakpoint
ALTER TABLE "community_representative" ADD CONSTRAINT "community_representative_4CTVN5cnRPTl_fkey" FOREIGN KEY ("community_workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE;
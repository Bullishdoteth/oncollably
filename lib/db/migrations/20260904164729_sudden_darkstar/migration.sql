ALTER TABLE "application" ADD COLUMN "deadline" timestamp;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "wallet_submission_deadline" timestamp;--> statement-breakpoint
ALTER TABLE "campaign_allocation" ADD COLUMN "deadline" timestamp;--> statement-breakpoint
ALTER TABLE "campaign_allocation" ADD COLUMN "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "allocation_id" text;--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "submitted_by_workspace_id" text;
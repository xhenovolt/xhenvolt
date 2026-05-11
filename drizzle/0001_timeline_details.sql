ALTER TABLE "timeline_entries" ADD COLUMN "accent_color" varchar(30);--> statement-breakpoint
ALTER TABLE "timeline_entries" ADD COLUMN "highlight" jsonb;--> statement-breakpoint
ALTER TABLE "timeline_entries" ADD COLUMN "events" jsonb;
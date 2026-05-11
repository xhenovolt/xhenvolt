CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "vector";
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"public_path" text,
	"alt" text DEFAULT '' NOT NULL,
	"title" varchar(200),
	"mime_type" varchar(80),
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(200) NOT NULL,
	"route" varchar(200) NOT NULL,
	"summary" text,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"key" varchar(120) NOT NULL,
	"kind" varchar(80) NOT NULL,
	"title" varchar(240),
	"subtitle" text,
	"body" text,
	"content" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route" varchar(200) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"keywords" text,
	"canonical" text,
	"og_title" varchar(200),
	"og_description" text,
	"og_image" text,
	"og_type" varchar(40) DEFAULT 'website',
	"twitter_card" varchar(40) DEFAULT 'summary_large_image',
	"robots" jsonb,
	"structured_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seo_metadata_route_unique" UNIQUE("route")
);
--> statement-breakpoint
CREATE TABLE "system_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"icon" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_screenshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_id" uuid NOT NULL,
	"title" varchar(200),
	"caption" text,
	"image_url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"width" integer,
	"height" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "systems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"tagline" varchar(240),
	"description" text NOT NULL,
	"long_description" text,
	"category" varchar(80),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"external_url" text,
	"logo_url" text,
	"accent_color" varchar(30),
	"icon" varchar(80),
	"deployments" integer DEFAULT 0,
	"highlights" jsonb,
	"tech_stack" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"is_flagship" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "systems_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name" varchar(160) NOT NULL,
	"author_role" varchar(200),
	"organization" varchar(200),
	"location" varchar(160),
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"avatar_url" text,
	"system_id" uuid,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(200) NOT NULL,
	"kind" varchar(60) DEFAULT 'school' NOT NULL,
	"location" varchar(160),
	"logo_url" text,
	"website" text,
	"description" text,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "clients_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(200) NOT NULL,
	"logo_url" text,
	"website" text,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partners_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(80) NOT NULL,
	"label" varchar(200) NOT NULL,
	"value" varchar(80) NOT NULL,
	"suffix" varchar(20),
	"description" text,
	"icon" varchar(80),
	"scope" varchar(60) DEFAULT 'global',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "statistics_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "timeline_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"occurred_on" date NOT NULL,
	"label" varchar(80),
	"icon" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"tagline" varchar(240),
	"description" text NOT NULL,
	"long_description" text,
	"icon" varchar(80),
	"accent_color" varchar(30),
	"deliverables" jsonb,
	"audience" varchar(200),
	"price_from" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"keywords" jsonb,
	"category" varchar(80),
	"scope" varchar(60) DEFAULT 'public',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "faqs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "footer_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(120) NOT NULL,
	"href" varchar(240) NOT NULL,
	"column" varchar(80) DEFAULT 'Company' NOT NULL,
	"is_external" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "navigation_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(120) NOT NULL,
	"href" varchar(240) NOT NULL,
	"target" varchar(20) DEFAULT '_self',
	"icon" varchar(80),
	"parent_id" uuid,
	"location" varchar(40) DEFAULT 'primary' NOT NULL,
	"description" text,
	"is_external" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(60) NOT NULL,
	"label" varchar(120) NOT NULL,
	"href" varchar(240) NOT NULL,
	"icon" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social_links_platform_unique" UNIQUE("platform")
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"severity" varchar(20) DEFAULT 'info' NOT NULL,
	"href" varchar(240),
	"dismissible" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" varchar(60) DEFAULT 'home' NOT NULL,
	"eyebrow" varchar(160),
	"headline" varchar(240) NOT NULL,
	"subheadline" text,
	"cta_primary_label" varchar(80),
	"cta_primary_href" varchar(240),
	"cta_secondary_label" varchar(80),
	"cta_secondary_href" varchar(240),
	"background_url" text,
	"media" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_conversation_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(80) NOT NULL,
	"role" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"matched_doc_ids" jsonb,
	"matched_faq_ids" jsonb,
	"confidence" integer,
	"latency_ms" integer,
	"user_agent" text,
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_training_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(240) NOT NULL,
	"source" varchar(120),
	"category" varchar(80),
	"keywords" jsonb,
	"content" text NOT NULL,
	"summary" text,
	"token_estimate" integer,
	"embedding" vector(1536),
	"embedding_model" varchar(80),
	"metadata" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "ai_training_documents_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(240) NOT NULL,
	"phone" varchar(80),
	"subject" varchar(240),
	"message" text NOT NULL,
	"source" varchar(80),
	"status" varchar(30) DEFAULT 'new' NOT NULL,
	"metadata" jsonb,
	"ip_hash" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "careers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(200) NOT NULL,
	"department" varchar(120),
	"location" varchar(160),
	"employment_type" varchar(60),
	"seniority" varchar(60),
	"description" text NOT NULL,
	"requirements" jsonb,
	"responsibilities" jsonb,
	"apply_url" text,
	"status" varchar(30) DEFAULT 'open' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "careers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"category" varchar(80),
	"icon_url" text,
	"description" text,
	"proficiency" varchar(40),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technologies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(200) NOT NULL,
	"role" varchar(200) NOT NULL,
	"bio" text,
	"avatar_url" text,
	"specialties" jsonb,
	"socials" jsonb,
	"email" varchar(240),
	"location" varchar(160),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "team_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200),
	"caption" text,
	"media_id" uuid,
	"image_url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"collection" varchar(120) DEFAULT 'default',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_features" ADD CONSTRAINT "system_features_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_screenshots" ADD CONSTRAINT "system_screenshots_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_uq" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "media_url_idx" ON "media_assets" USING btree ("url");--> statement-breakpoint
CREATE INDEX "settings_key_idx" ON "settings" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_uq" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_uq" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "pages_route_idx" ON "pages" USING btree ("route");--> statement-breakpoint
CREATE INDEX "sections_page_idx" ON "sections" USING btree ("page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sections_page_key_uq" ON "sections" USING btree ("page_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "seo_route_uq" ON "seo_metadata" USING btree ("route");--> statement-breakpoint
CREATE INDEX "system_features_system_idx" ON "system_features" USING btree ("system_id");--> statement-breakpoint
CREATE INDEX "system_screenshots_system_idx" ON "system_screenshots" USING btree ("system_id");--> statement-breakpoint
CREATE UNIQUE INDEX "systems_slug_uq" ON "systems" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "systems_category_idx" ON "systems" USING btree ("category");--> statement-breakpoint
CREATE INDEX "testimonials_featured_idx" ON "testimonials" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "testimonials_system_idx" ON "testimonials" USING btree ("system_id");--> statement-breakpoint
CREATE UNIQUE INDEX "clients_slug_uq" ON "clients" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "clients_kind_idx" ON "clients" USING btree ("kind");--> statement-breakpoint
CREATE UNIQUE INDEX "partners_slug_uq" ON "partners" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "statistics_key_uq" ON "statistics" USING btree ("key");--> statement-breakpoint
CREATE INDEX "statistics_scope_idx" ON "statistics" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "timeline_occurred_idx" ON "timeline_entries" USING btree ("occurred_on");--> statement-breakpoint
CREATE UNIQUE INDEX "services_slug_uq" ON "services" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "services_published_idx" ON "services" USING btree ("published");--> statement-breakpoint
CREATE UNIQUE INDEX "faqs_slug_uq" ON "faqs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "faqs_scope_idx" ON "faqs" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "footer_column_idx" ON "footer_links" USING btree ("column");--> statement-breakpoint
CREATE INDEX "nav_location_idx" ON "navigation_links" USING btree ("location");--> statement-breakpoint
CREATE INDEX "nav_parent_idx" ON "navigation_links" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "hero_scope_idx" ON "hero_slides" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "ai_logs_session_idx" ON "ai_conversation_logs" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "ai_logs_created_idx" ON "ai_conversation_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_docs_slug_uq" ON "ai_training_documents" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "ai_docs_category_idx" ON "ai_training_documents" USING btree ("category");--> statement-breakpoint
CREATE INDEX "contact_status_idx" ON "contact_messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_created_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "careers_slug_uq" ON "careers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "careers_status_idx" ON "careers" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_slug_uq" ON "technologies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "technologies_category_idx" ON "technologies" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "team_slug_uq" ON "team_members" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "team_published_idx" ON "team_members" USING btree ("published");--> statement-breakpoint
CREATE INDEX "gallery_collection_idx" ON "gallery_images" USING btree ("collection");
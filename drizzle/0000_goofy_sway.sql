CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `categories_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` varchar(36) NOT NULL,
	`url` varchar(500) NOT NULL,
	`public_path` varchar(500),
	`alt` varchar(500) NOT NULL DEFAULT '',
	`title` varchar(200),
	`mime_type` varchar(80),
	`width` int,
	`height` int,
	`size_bytes` int,
	`metadata` json,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `media_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` varchar(36) NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` json NOT NULL,
	`description` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `tags_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(200) NOT NULL,
	`route` varchar(200) NOT NULL,
	`summary` text,
	`status` varchar(20) NOT NULL DEFAULT 'published',
	`published` boolean NOT NULL DEFAULT true,
	`metadata` json,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `pages_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` varchar(36) NOT NULL,
	`page_id` varchar(36) NOT NULL,
	`key` varchar(120) NOT NULL,
	`kind` varchar(80) NOT NULL,
	`title` varchar(240),
	`subtitle` text,
	`body` text,
	`content` json,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `sections_page_key_uq` UNIQUE(`page_id`,`key`)
);
--> statement-breakpoint
CREATE TABLE `seo_metadata` (
	`id` varchar(36) NOT NULL,
	`route` varchar(200) NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`keywords` text,
	`canonical` varchar(500),
	`og_title` varchar(200),
	`og_description` text,
	`og_image` varchar(500),
	`og_type` varchar(40) DEFAULT 'website',
	`twitter_card` varchar(40) DEFAULT 'summary_large_image',
	`robots` json,
	`structured_data` json,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `seo_metadata_id` PRIMARY KEY(`id`),
	CONSTRAINT `seo_metadata_route_unique` UNIQUE(`route`),
	CONSTRAINT `seo_route_uq` UNIQUE(`route`)
);
--> statement-breakpoint
CREATE TABLE `system_features` (
	`id` varchar(36) NOT NULL,
	`system_id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`icon` varchar(80),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `system_features_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_screenshots` (
	`id` varchar(36) NOT NULL,
	`system_id` varchar(36) NOT NULL,
	`title` varchar(200),
	`caption` text,
	`image_url` varchar(500) NOT NULL,
	`alt` varchar(500) NOT NULL DEFAULT '',
	`width` int,
	`height` int,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `system_screenshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `systems` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`tagline` varchar(240),
	`description` text NOT NULL,
	`long_description` text,
	`category` varchar(80),
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`external_url` varchar(500),
	`logo_url` varchar(500),
	`accent_color` varchar(30),
	`icon` varchar(80),
	`deployments` int DEFAULT 0,
	`highlights` json,
	`tech_stack` json,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`is_flagship` json,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `systems_id` PRIMARY KEY(`id`),
	CONSTRAINT `systems_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `systems_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` varchar(36) NOT NULL,
	`author_name` varchar(160) NOT NULL,
	`author_role` varchar(200),
	`organization` varchar(200),
	`location` varchar(160),
	`quote` text NOT NULL,
	`rating` int NOT NULL DEFAULT 5,
	`avatar_url` varchar(500),
	`system_id` varchar(36),
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(200) NOT NULL,
	`kind` varchar(60) NOT NULL DEFAULT 'school',
	`location` varchar(160),
	`logo_url` varchar(500),
	`website` varchar(500),
	`description` text,
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `clients_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(200) NOT NULL,
	`logo_url` varchar(500),
	`website` varchar(500),
	`description` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `partners_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `statistics` (
	`id` varchar(36) NOT NULL,
	`key` varchar(80) NOT NULL,
	`label` varchar(200) NOT NULL,
	`value` varchar(80) NOT NULL,
	`suffix` varchar(20),
	`description` text,
	`icon` varchar(80),
	`scope` varchar(60) DEFAULT 'global',
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `statistics_id` PRIMARY KEY(`id`),
	CONSTRAINT `statistics_key_unique` UNIQUE(`key`),
	CONSTRAINT `statistics_key_uq` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `timeline_entries` (
	`id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`occurred_on` date NOT NULL,
	`label` varchar(80),
	`icon` varchar(80),
	`accent_color` varchar(30),
	`highlight` json,
	`events` json,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `timeline_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(200) NOT NULL,
	`tagline` varchar(240),
	`description` text NOT NULL,
	`long_description` text,
	`icon` varchar(80),
	`accent_color` varchar(30),
	`deliverables` json,
	`audience` varchar(200),
	`price_from` varchar(80),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `services_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`keywords` json,
	`category` varchar(80),
	`scope` varchar(60) DEFAULT 'public',
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`),
	CONSTRAINT `faqs_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `faqs_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `footer_links` (
	`id` varchar(36) NOT NULL,
	`label` varchar(120) NOT NULL,
	`href` varchar(240) NOT NULL,
	`column` varchar(80) NOT NULL DEFAULT 'Company',
	`is_external` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `footer_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `navigation_links` (
	`id` varchar(36) NOT NULL,
	`label` varchar(120) NOT NULL,
	`href` varchar(240) NOT NULL,
	`target` varchar(20) DEFAULT '_self',
	`icon` varchar(80),
	`parent_id` varchar(36),
	`location` varchar(40) NOT NULL DEFAULT 'primary',
	`description` text,
	`is_external` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `navigation_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` varchar(36) NOT NULL,
	`platform` varchar(60) NOT NULL,
	`label` varchar(120) NOT NULL,
	`href` varchar(240) NOT NULL,
	`icon` varchar(80),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `social_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_links_platform_unique` UNIQUE(`platform`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`severity` varchar(20) NOT NULL DEFAULT 'info',
	`href` varchar(240),
	`dismissible` boolean NOT NULL DEFAULT true,
	`starts_at` timestamp(3),
	`ends_at` timestamp(3),
	`published` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_slides` (
	`id` varchar(36) NOT NULL,
	`scope` varchar(60) NOT NULL DEFAULT 'home',
	`eyebrow` varchar(160),
	`headline` varchar(240) NOT NULL,
	`subheadline` text,
	`cta_primary_label` varchar(80),
	`cta_primary_href` varchar(240),
	`cta_secondary_label` varchar(80),
	`cta_secondary_href` varchar(240),
	`background_url` varchar(500),
	`media` json,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `hero_slides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_conversation_logs` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(80) NOT NULL,
	`role` varchar(20) NOT NULL,
	`message` text NOT NULL,
	`matched_doc_ids` json,
	`matched_faq_ids` json,
	`confidence` int,
	`latency_ms` int,
	`user_agent` text,
	`ip_hash` varchar(64),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `ai_conversation_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_training_documents` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(240) NOT NULL,
	`source` varchar(120),
	`category` varchar(80),
	`keywords` json,
	`content` text NOT NULL,
	`summary` text,
	`token_estimate` int,
	`embedding` vector(1536),
	`embedding_model` varchar(80),
	`metadata` json,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `ai_training_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_training_documents_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `ai_docs_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` varchar(36) NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(240) NOT NULL,
	`phone` varchar(80),
	`subject` varchar(240),
	`message` text NOT NULL,
	`source` varchar(80),
	`status` varchar(30) NOT NULL DEFAULT 'new',
	`metadata` json,
	`ip_hash` varchar(64),
	`user_agent` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `careers` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(200) NOT NULL,
	`department` varchar(120),
	`location` varchar(160),
	`employment_type` varchar(60),
	`seniority` varchar(60),
	`description` text NOT NULL,
	`requirements` json,
	`responsibilities` json,
	`apply_url` varchar(500),
	`status` varchar(30) NOT NULL DEFAULT 'open',
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `careers_id` PRIMARY KEY(`id`),
	CONSTRAINT `careers_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `careers_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `technologies` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`category` varchar(80),
	`icon_url` varchar(500),
	`description` text,
	`proficiency` varchar(40),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `technologies_id` PRIMARY KEY(`id`),
	CONSTRAINT `technologies_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `technologies_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(200) NOT NULL,
	`role` varchar(200) NOT NULL,
	`bio` text,
	`avatar_url` varchar(500),
	`specialties` json,
	`socials` json,
	`email` varchar(240),
	`location` varchar(160),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_members_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `team_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `gallery_images` (
	`id` varchar(36) NOT NULL,
	`title` varchar(200),
	`caption` text,
	`media_id` varchar(36),
	`image_url` varchar(500) NOT NULL,
	`alt` varchar(500) NOT NULL DEFAULT '',
	`collection` varchar(120) DEFAULT 'default',
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `gallery_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`id` varchar(36) NOT NULL,
	`token` varchar(64) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`last_active_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`ip_hash` varchar(64),
	`user_agent` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_sessions_token_unique` UNIQUE(`token`),
	CONSTRAINT `admin_sessions_token_uq` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(240) NOT NULL,
	`password_hash` varchar(500) NOT NULL,
	`name` varchar(160),
	`role` varchar(40) NOT NULL DEFAULT 'admin',
	`last_login_at` timestamp(3),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`),
	CONSTRAINT `admin_users_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `admin_audit_logs` (
	`id` varchar(36) NOT NULL,
	`actor_id` varchar(36),
	`actor_email` varchar(240),
	`action` varchar(80) NOT NULL,
	`entity_type` varchar(80) NOT NULL,
	`entity_id` varchar(64),
	`summary` text,
	`metadata` json,
	`ip_hash` varchar(64),
	`user_agent` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `admin_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sections` ADD CONSTRAINT `sections_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `system_features` ADD CONSTRAINT `system_features_system_id_systems_id_fk` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `system_screenshots` ADD CONSTRAINT `system_screenshots_system_id_systems_id_fk` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_system_id_systems_id_fk` FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_images` ADD CONSTRAINT `gallery_images_media_id_media_assets_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media_assets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_user_id_admin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_audit_logs` ADD CONSTRAINT `admin_audit_logs_actor_id_admin_users_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `admin_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `media_url_idx` ON `media_assets` (`url`);--> statement-breakpoint
CREATE INDEX `settings_key_idx` ON `settings` (`key`);--> statement-breakpoint
CREATE INDEX `pages_route_idx` ON `pages` (`route`);--> statement-breakpoint
CREATE INDEX `sections_page_idx` ON `sections` (`page_id`);--> statement-breakpoint
CREATE INDEX `system_features_system_idx` ON `system_features` (`system_id`);--> statement-breakpoint
CREATE INDEX `system_screenshots_system_idx` ON `system_screenshots` (`system_id`);--> statement-breakpoint
CREATE INDEX `systems_category_idx` ON `systems` (`category`);--> statement-breakpoint
CREATE INDEX `testimonials_featured_idx` ON `testimonials` (`featured`);--> statement-breakpoint
CREATE INDEX `testimonials_system_idx` ON `testimonials` (`system_id`);--> statement-breakpoint
CREATE INDEX `clients_kind_idx` ON `clients` (`kind`);--> statement-breakpoint
CREATE INDEX `statistics_scope_idx` ON `statistics` (`scope`);--> statement-breakpoint
CREATE INDEX `timeline_occurred_idx` ON `timeline_entries` (`occurred_on`);--> statement-breakpoint
CREATE INDEX `services_published_idx` ON `services` (`published`);--> statement-breakpoint
CREATE INDEX `faqs_category_idx` ON `faqs` (`category`);--> statement-breakpoint
CREATE INDEX `faqs_scope_idx` ON `faqs` (`scope`);--> statement-breakpoint
CREATE INDEX `footer_column_idx` ON `footer_links` (`column`);--> statement-breakpoint
CREATE INDEX `nav_location_idx` ON `navigation_links` (`location`);--> statement-breakpoint
CREATE INDEX `nav_parent_idx` ON `navigation_links` (`parent_id`);--> statement-breakpoint
CREATE INDEX `hero_scope_idx` ON `hero_slides` (`scope`);--> statement-breakpoint
CREATE INDEX `ai_logs_session_idx` ON `ai_conversation_logs` (`session_id`);--> statement-breakpoint
CREATE INDEX `ai_logs_created_idx` ON `ai_conversation_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `ai_docs_category_idx` ON `ai_training_documents` (`category`);--> statement-breakpoint
CREATE INDEX `contact_status_idx` ON `contact_messages` (`status`);--> statement-breakpoint
CREATE INDEX `contact_created_idx` ON `contact_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `careers_status_idx` ON `careers` (`status`);--> statement-breakpoint
CREATE INDEX `technologies_category_idx` ON `technologies` (`category`);--> statement-breakpoint
CREATE INDEX `team_published_idx` ON `team_members` (`published`);--> statement-breakpoint
CREATE INDEX `gallery_collection_idx` ON `gallery_images` (`collection`);--> statement-breakpoint
CREATE INDEX `admin_sessions_user_idx` ON `admin_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `admin_sessions_expires_idx` ON `admin_sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `admin_audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `audit_actor_idx` ON `admin_audit_logs` (`actor_id`);--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `admin_audit_logs` (`created_at`);
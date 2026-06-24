CREATE TABLE `app_products` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`tagline` varchar(240),
	`description` text NOT NULL,
	`long_description` text,
	`category` varchar(80),
	`icon` varchar(80),
	`icon_url` varchar(500),
	`brand_color` varchar(30),
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`deleted_at` timestamp(3),
	CONSTRAINT `app_products_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `app_products_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `app_releases` (
	`id` varchar(36) NOT NULL,
	`app_product_id` varchar(36) NOT NULL,
	`version` varchar(60) NOT NULL,
	`release_channel` varchar(20) NOT NULL DEFAULT 'stable',
	`platform` varchar(20) NOT NULL,
	`architecture` varchar(20) NOT NULL DEFAULT 'x64',
	`file_type` varchar(20) NOT NULL,
	`file_size` bigint,
	`github_release_url` varchar(700) NOT NULL,
	`checksum_sha256` varchar(128),
	`release_notes` text,
	`is_latest` boolean NOT NULL DEFAULT false,
	`status` varchar(20) NOT NULL DEFAULT 'published',
	`published_at` timestamp(3),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `app_releases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `download_events` (
	`id` varchar(36) NOT NULL,
	`app_product_id` varchar(36),
	`release_id` varchar(36),
	`slug` varchar(120) NOT NULL,
	`platform` varchar(20),
	`version` varchar(60),
	`user_agent` varchar(500),
	`ip_hash` varchar(64),
	`referrer` varchar(500),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `download_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `app_releases` ADD CONSTRAINT `app_releases_app_product_id_app_products_id_fk` FOREIGN KEY (`app_product_id`) REFERENCES `app_products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `app_products_status_idx` ON `app_products` (`status`);--> statement-breakpoint
CREATE INDEX `app_products_category_idx` ON `app_products` (`category`);--> statement-breakpoint
CREATE INDEX `app_releases_product_idx` ON `app_releases` (`app_product_id`);--> statement-breakpoint
CREATE INDEX `app_releases_platform_idx` ON `app_releases` (`platform`);--> statement-breakpoint
CREATE INDEX `app_releases_latest_idx` ON `app_releases` (`app_product_id`,`is_latest`);--> statement-breakpoint
CREATE INDEX `app_releases_status_idx` ON `app_releases` (`status`);--> statement-breakpoint
CREATE INDEX `download_events_product_idx` ON `download_events` (`app_product_id`);--> statement-breakpoint
CREATE INDEX `download_events_slug_idx` ON `download_events` (`slug`);--> statement-breakpoint
CREATE INDEX `download_events_created_idx` ON `download_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `download_events_platform_idx` ON `download_events` (`platform`);
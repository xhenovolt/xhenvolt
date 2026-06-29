CREATE TABLE `analytics_daily_summary` (
	`id` varchar(36) NOT NULL,
	`date` varchar(10) NOT NULL,
	`page_views` varchar(20),
	`unique_visitors` varchar(20),
	`downloads` varchar(20),
	`top_pages` json,
	`top_sources` json,
	`devices` json,
	`bots` json,
	`ai_crawlers` json,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `analytics_daily_summary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` varchar(36) NOT NULL,
	`event_type` varchar(40) NOT NULL,
	`event_name` varchar(120) NOT NULL,
	`path` varchar(300),
	`target` varchar(500),
	`metadata` json,
	`session_id` varchar(64),
	`visitor_id` varchar(64),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_page_views` (
	`id` varchar(36) NOT NULL,
	`path` varchar(300) NOT NULL,
	`title` varchar(300),
	`referrer` varchar(500),
	`source` varchar(120),
	`medium` varchar(120),
	`campaign` varchar(120),
	`user_agent` varchar(500),
	`device_type` varchar(20),
	`browser` varchar(60),
	`os` varchar(60),
	`country` varchar(80),
	`city` varchar(120),
	`ip_hash` varchar(64),
	`session_id` varchar(64),
	`visitor_id` varchar(64),
	`is_bot` boolean NOT NULL DEFAULT false,
	`bot_name` varchar(80),
	`is_ai_crawler` boolean NOT NULL DEFAULT false,
	`ai_crawler_name` varchar(80),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `analytics_page_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cookie_consents` (
	`id` varchar(36) NOT NULL,
	`visitor_id` varchar(64) NOT NULL,
	`necessary` boolean NOT NULL DEFAULT true,
	`analytics` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`preferences` boolean NOT NULL DEFAULT false,
	`consent_version` varchar(20) NOT NULL,
	`user_agent` varchar(500),
	`ip_hash` varchar(64),
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `cookie_consents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `ads_date_idx` ON `analytics_daily_summary` (`date`);--> statement-breakpoint
CREATE INDEX `aev_type_idx` ON `analytics_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `aev_name_idx` ON `analytics_events` (`event_name`);--> statement-breakpoint
CREATE INDEX `aev_created_idx` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `apv_path_idx` ON `analytics_page_views` (`path`);--> statement-breakpoint
CREATE INDEX `apv_created_idx` ON `analytics_page_views` (`created_at`);--> statement-breakpoint
CREATE INDEX `apv_visitor_idx` ON `analytics_page_views` (`visitor_id`);--> statement-breakpoint
CREATE INDEX `apv_session_idx` ON `analytics_page_views` (`session_id`);--> statement-breakpoint
CREATE INDEX `apv_bot_idx` ON `analytics_page_views` (`is_bot`);--> statement-breakpoint
CREATE INDEX `apv_ai_idx` ON `analytics_page_views` (`is_ai_crawler`);--> statement-breakpoint
CREATE INDEX `cc_visitor_idx` ON `cookie_consents` (`visitor_id`);--> statement-breakpoint
CREATE INDEX `cc_created_idx` ON `cookie_consents` (`created_at`);
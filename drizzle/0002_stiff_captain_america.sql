CREATE TABLE `subscribers` (
	`id` varchar(36) NOT NULL,
	`email` varchar(240) NOT NULL,
	`name` varchar(200),
	`status` varchar(20) NOT NULL DEFAULT 'subscribed',
	`interests` json,
	`source` varchar(80) NOT NULL DEFAULT 'newsletter',
	`confirmed_at` timestamp(3),
	`ip_hash` varchar(64),
	`user_agent` text,
	`created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `subscribers_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `subscribers_status_idx` ON `subscribers` (`status`);--> statement-breakpoint
CREATE INDEX `subscribers_created_idx` ON `subscribers` (`created_at`);
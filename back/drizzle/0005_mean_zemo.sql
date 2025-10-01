PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customer` (
	`id` integer PRIMARY KEY NOT NULL,
	`company_id` integer NOT NULL,
	`platform_id` text NOT NULL,
	`username` text,
	`platform` text NOT NULL,
	`lastActivity` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`full_name` text NOT NULL,
	`platform_channel_id` text,
	`avatar` text,
	`phone` text,
	`country` text,
	`city` text,
	`device` text,
	`ip` text,
	`status` text DEFAULT 'unknown' NOT NULL,
	`assigned_to` text,
	FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_customer`("id", "company_id", "platform_id", "username", "platform", "lastActivity", "full_name", "platform_channel_id", "avatar", "phone", "country", "city", "device", "ip", "status", "assigned_to") SELECT "id", "company_id", "platform_id", "username", "platform", "lastActivity", "full_name", "platform_channel_id", "avatar", "phone", "country", "city", "device", "ip", "status", "assigned_to" FROM `customer`;--> statement-breakpoint
DROP TABLE `customer`;--> statement-breakpoint
ALTER TABLE `__new_customer` RENAME TO `customer`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_customers_platform_customer_company` ON `customer` (`platform`,`platform_id`,`company_id`);
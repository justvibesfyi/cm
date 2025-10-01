CREATE TABLE `note` (
	`id` integer PRIMARY KEY NOT NULL,
	`customer_id` integer NOT NULL,
	`text` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `note_update` (
	`id` integer PRIMARY KEY NOT NULL,
	`note_id` integer NOT NULL,
	`employee_id` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`note_id`) REFERENCES `note`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customer` (
	`id` integer PRIMARY KEY NOT NULL,
	`company_id` integer NOT NULL,
	`platform_customer_id` text NOT NULL,
	`platform` text NOT NULL,
	`lastActivity` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`name` text NOT NULL,
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
INSERT INTO `__new_customer`("id", "company_id", "platform_customer_id", "platform", "lastActivity", "name", "platform_channel_id", "avatar", "phone", "country", "city", "device", "ip", "status", "assigned_to") SELECT "id", "company_id", "platform_customer_id", "platform", "lastActivity", "name", "platform_channel_id", "avatar", "phone", "country", "city", "device", "ip", "status", "assigned_to" FROM `customer`;--> statement-breakpoint
DROP TABLE `customer`;--> statement-breakpoint
ALTER TABLE `__new_customer` RENAME TO `customer`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_customers_platform_customer_company` ON `customer` (`platform`,`platform_customer_id`,`company_id`);
CREATE TABLE `auth_code` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `company` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`id` integer PRIMARY KEY NOT NULL,
	`platform_customer_id` text NOT NULL,
	`company_id` integer NOT NULL,
	`platform` text NOT NULL,
	`name` text,
	`avatar` text,
	`platform_channel_id` text,
	FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_customers_platform_customer_company` ON `customer` (`platform`,`platform_customer_id`,`company_id`);--> statement-breakpoint
CREATE TABLE `employee` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`avatar` text,
	`company_id` integer,
	`position` text,
	`onboarded` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employee_email_unique` ON `employee` (`email`);--> statement-breakpoint
CREATE TABLE `integration` (
	`id` integer PRIMARY KEY NOT NULL,
	`company_id` integer NOT NULL,
	`platform` text NOT NULL,
	`api_key` text NOT NULL,
	`enabled` integer NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integration_company_platform` ON `integration` (`company_id`,`platform`);--> statement-breakpoint
CREATE TABLE `message` (
	`id` integer PRIMARY KEY NOT NULL,
	`customer_id` integer NOT NULL,
	`content` text NOT NULL,
	`company_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`employee_id` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE cascade
);

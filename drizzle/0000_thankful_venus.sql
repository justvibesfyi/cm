CREATE TABLE `auth_code` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `company` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`id` integer PRIMARY KEY NOT NULL,
	`customerId` text NOT NULL,
	`companyId` integer NOT NULL,
	`platform` text NOT NULL,
	`name` text,
	`avatar` text,
	`platformChannelId` text,
	FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_customers_platform_customer_company` ON `customer` (`platform`,`customerId`,`companyId`);--> statement-breakpoint
CREATE TABLE `employee` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`avatar` text,
	`company_id` integer,
	`position` text,
	`onboarded` integer DEFAULT false,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employee_email_unique` ON `employee` (`email`);--> statement-breakpoint
CREATE TABLE `integration` (
	`id` integer PRIMARY KEY NOT NULL,
	`companyId` integer NOT NULL,
	`platform` text NOT NULL,
	`api_key` text NOT NULL,
	`enabled` integer NOT NULL,
	FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integration_company_platform` ON `integration` (`companyId`,`platform`);--> statement-breakpoint
CREATE TABLE `message` (
	`id` integer PRIMARY KEY NOT NULL,
	`customerId` integer NOT NULL,
	`content` text NOT NULL,
	`companyId` integer NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`employeeId` text,
	FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_sender" CHECK("message"."employeeId" IS NOT NULL OR "message"."customerId" IS NOT NULL),
	CONSTRAINT "check_exclusive" CHECK("message"."employeeId" IS NULL OR "message"."customerId" IS NULL)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`employeeId` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`expiresAt` text NOT NULL,
	FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE cascade
);

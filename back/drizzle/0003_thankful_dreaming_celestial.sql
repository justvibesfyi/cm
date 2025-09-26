PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` integer PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`employee_id` text NOT NULL,
	`device_type` text,
	`device_name` text,
	`last_ip` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "session_id", "employee_id", "device_type", "device_name", "last_ip", "created_at", "expires_at") SELECT "id", "session_id", "employee_id", "device_type", "device_name", "last_ip", "created_at", "expires_at" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `session_session_id_unique` ON `session` (`session_id`);
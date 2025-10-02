ALTER TABLE `note_update` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `note_update` DROP COLUMN `action`;--> statement-breakpoint
ALTER TABLE `note_update` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `note` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `note` DROP COLUMN `updated_at`;
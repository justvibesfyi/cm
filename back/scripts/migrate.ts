#!/usr/bin/env bun

/**
 * Database migration CLI script
 * Usage: bun run scripts/migrate.ts [command]
 * Commands:
 *   - run: Run pending migrations (default)
 *   - status: Show migration status
 */

import { getMigrationStatus, runMigrations } from "../database/index";
import { logger } from "../utils/logger";

async function main() {
	const command = process.argv[2] || "run";

	try {
		switch (command) {
			case "run":
				logger.info("Running database migrations...");
				await runMigrations();
				logger.info("Migrations completed successfully");
				break;

			case "status": {
				logger.info("Checking migration status...");
				const status = await getMigrationStatus();

				console.log("\n=== Migration Status ===");
				console.log(`Total migrations: ${status.total}`);
				console.log(`Applied: ${status.applied.length}`);
				console.log(`Pending: ${status.pending.length}`);

				if (status.applied.length > 0) {
					console.log("\nApplied migrations:");
					status.applied.forEach((m) => {
						console.log(`  ✓ ${m.filename} (applied: ${m.applied_at})`);
					});
				}

				if (status.pending.length > 0) {
					console.log("\nPending migrations:");
					status.pending.forEach((filename) => {
						console.log(`  ○ ${filename}`);
					});
				}

				console.log("");
				break;
			}

			default:
				console.error(`Unknown command: ${command}`);
				console.log("Available commands: run, status");
				process.exit(1);
		}
	} catch (error) {
		logger.error("Migration script failed", { error });
		process.exit(1);
	}
}

main();

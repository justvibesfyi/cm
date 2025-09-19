import { sql } from "bun";
import { readdir, readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Migration {
	id: number;
	filename: string;
	sql: string;
}

interface MigrationRecord {
	id: number;
	filename: string;
	applied_at: string;
}

/**
 * Initialize migrations table
 */
async function initializeMigrationsTable(): Promise<void> {
	await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
	logger.info("Migrations table initialized");
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations(): Promise<MigrationRecord[]> {
	const result =
		await sql`SELECT id, filename, applied_at FROM migrations ORDER BY id`;
	return result as MigrationRecord[];
}

/**
 * Load migration files from disk
 */
async function loadMigrationFiles(): Promise<Migration[]> {
	const migrationsDir = join(__dirname, "migrations");

	try {
		const files = await readdir(migrationsDir);
		const migrationFiles = files.filter((file) => file.endsWith(".sql")).sort(); // Ensure consistent ordering

		const migrations: Migration[] = [];

		for (const filename of migrationFiles) {
			// Extract migration ID from filename (e.g., "001_initial_schema.sql" -> 1)
			const match = filename.match(/^(\d+)_/);
			if (!match) {
				logger.warn("Skipping migration file with invalid format", {
					filename,
				});
				continue;
			}

			const id = parseInt(match[1], 10);
			const filePath = join(migrationsDir, filename);
			const sqlContent = await readFile(filePath, "utf-8");

			migrations.push({ id, filename, sql: sqlContent });
		}

		return migrations.sort((a, b) => a.id - b.id);
	} catch (error) {
		logger.error("Failed to load migration files", { error });
		throw new Error(`Failed to load migration files: ${error}`);
	}
}

/**
 * Apply a single migration
 */
async function applyMigration(migration: Migration): Promise<void> {
	try {
		// Split SQL into individual statements and execute them
		await sql`BEGIN;`;

		await sql.unsafe(migration.sql);
		// Record migration as applied
		await sql`
      INSERT INTO migrations (id, filename) 
      VALUES (${migration.id}, ${migration.filename})
    `;

		await sql`COMMIT;`;

		logger.info("Migration applied successfully", {
			id: migration.id,
			filename: migration.filename,
		});
	} catch (error) {
		await sql`ROLLBACK;`;
		logger.error("Migration failed", {
			id: migration.id,
			filename: migration.filename,
			error,
		});
		throw new Error(`Migration ${migration.filename} failed: ${error}`);
	}
}

/**
 * Run database migrations
 */
export async function migrateDb(): Promise<void> {
	logger.info("Starting database migrations");

	try {
		// Initialize migrations table
		await initializeMigrationsTable();

		// Get applied migrations
		const appliedMigrations = await getAppliedMigrations();
		const appliedIds = new Set(appliedMigrations.map((m) => m.id));

		// Load migration files
		const availableMigrations = await loadMigrationFiles();

		// Find pending migrations
		const pendingMigrations = availableMigrations.filter(
			(m) => !appliedIds.has(m.id),
		);

		if (pendingMigrations.length === 0) {
			logger.info("No pending migrations found");
			return;
		}

		logger.info("Found pending migrations", {
			count: pendingMigrations.length,
			migrations: pendingMigrations.map((m) => m.filename),
		});

		// Apply pending migrations
		for (const migration of pendingMigrations) {
			await applyMigration(migration);
		}

		logger.info("All migrations completed successfully", {
			appliedCount: pendingMigrations.length,
		});
	} catch (error) {
		logger.error("Migration process failed", { error });
		throw error;
	}
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
	applied: MigrationRecord[];
	pending: string[];
	total: number;
}> {
	try {
		await initializeMigrationsTable();

		const appliedMigrations = await getAppliedMigrations();
		logger.debug("Applied migrations loaded", {
			count: appliedMigrations.length,
		});

		const appliedIds = new Set(appliedMigrations.map((m) => m.id));

		const availableMigrations = await loadMigrationFiles();
		logger.debug("Available migrations loaded", {
			count: availableMigrations.length,
		});

		const pendingMigrations = availableMigrations
			.filter((m) => !appliedIds.has(m.id))
			.map((m) => m.filename);

		return {
			applied: appliedMigrations,
			pending: pendingMigrations,
			total: availableMigrations.length,
		};
	} catch (error) {
		logger.error("Failed to get migration status", {
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
		throw error;
	}
}

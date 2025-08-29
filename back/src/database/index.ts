import { initializeDatabase } from "./db";
import { runMigrations } from "./migrator";

// Database module exports
export { initializeDatabase } from "./db";

export {
	getMigrationStatus,
	runMigrations,
} from "./migrator.js";

// Database initialization function
export async function initializeApp(): Promise<void> {
	// Initialize database connection

  console.log(process.env.DATABASE_URL)
	initializeDatabase();

	// Run migrations
	await runMigrations();
}

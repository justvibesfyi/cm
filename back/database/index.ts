import { setDbOptions } from "./db";
import { migrateDb } from "./migrator";
import { seedDb } from "./seed.js";

// Database module exports
export { setDbOptions as initializeDatabase } from "./db";

export {
	getMigrationStatus,
	migrateDb as runMigrations,
} from "./migrator.js";

export async function initializeDb(): Promise<void> {

	console.log("Database Url: ", process.env.DATABASE_URL)

	setDbOptions();
	await migrateDb();
	await seedDb();
}

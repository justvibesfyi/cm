import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { seedDb } from "./seed";

// biome-ignore lint/style/noNonNullAssertion: Drizzle docs
export const db = drizzle(process.env.DATABASE_URL!);

await db.run(sql`PRAGMA journal_mode = WAL`);
await db.run(sql`PRAGMA busy_timeout = 5000`);
await db.run(sql`PRAGMA cache_size = 10000`);
await db.run(sql`PRAGMA foreign_keys = ON`);

await migrate(db, {
  migrationsFolder: "back/drizzle"
});

export async function initializeDb() {
  await seedDb();
}

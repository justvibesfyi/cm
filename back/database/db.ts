import { sql } from 'bun';

export async function setDbOptions() {
  await sql`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA cache_size = 10000;
    PRAGMA foreign_keys = ON;
    `;
}

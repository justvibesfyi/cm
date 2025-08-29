#!/usr/bin/env bun
/**
 * Database schema inspection script
 */

import { getDatabase } from '../src/database/index.js';

const db = getDatabase();

console.log('=== Database Schema ===\n');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all() as { name: string }[];

for (const table of tables) {
  console.log(`Table: ${table.name}`);
  
  // Get table schema
  const schema = db.prepare(`PRAGMA table_info(${table.name})`).all() as any[];
  schema.forEach(col => {
    const nullable = col.notnull ? 'NOT NULL' : 'NULL';
    const defaultVal = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
    const pk = col.pk ? ' PRIMARY KEY' : '';
    console.log(`  ${col.name}: ${col.type}${pk} ${nullable}${defaultVal}`);
  });
  
  // Get indexes
  const indexes = db.prepare(`PRAGMA index_list(${table.name})`).all() as any[];
  if (indexes.length > 0) {
    console.log('  Indexes:');
    indexes.forEach(idx => {
      const indexInfo = db.prepare(`PRAGMA index_info(${idx.name})`).all() as any[];
      const columns = indexInfo.map(info => info.name).join(', ');
      console.log(`    ${idx.name}: (${columns})${idx.unique ? ' UNIQUE' : ''}`);
    });
  }
  
  console.log('');
}
# Bun SQL Best Practices

## Overview
Bun's built-in SQL functionality has specific behaviors that differ from other database libraries. This document outlines the correct patterns to use.

## DELETE and UPDATE Operations

### The Problem
Bun SQL doesn't return row count information by default on DELETE and UPDATE statements. Without a `RETURNING` clause, these operations return an empty array, making it impossible to know how many rows were affected.

### The Solution
Always use `RETURNING changes()` and access `result.count`:

```typescript
// ✅ Correct - Use RETURNING changes() and access result.count
const result = await sql`
  DELETE FROM users WHERE id = ${userId}
  RETURNING changes()
`;
const deletedCount = result.count;
const wasDeleted = deletedCount > 0;

// ✅ Correct - For UPDATE operations
const result = await sql`
  UPDATE users 
  SET permissions = ${permissionsJson}, updated_at = CURRENT_TIMESTAMP
  WHERE id = ${id}
  RETURNING changes()
`;
const updatedCount = result.count;
if (updatedCount === 0) {
  throw new Error('User not found');
}

// ❌ Incorrect - Returns empty array, no count information
const result = await sql`DELETE FROM users WHERE id = ${userId}`;
const deleted = result.length > 0; // ❌ Always false, no way to know if anything was deleted
```

## INSERT Operations with RETURNING

### Basic INSERT with RETURNING
For INSERT operations, use destructuring to get the inserted record:

```typescript
// ✅ Correct - Use destructuring with RETURNING
const [user] = await sql`
  INSERT INTO users (id, email, permissions)
  VALUES (${id}, ${email}, ${permissions})
  RETURNING *
`;

// ✅ Correct - Using object helper for clean syntax
const userData = { id, email, permissions };
const [user] = await sql`
  INSERT INTO users ${sql(userData)}
  RETURNING *
`;
```

### INSERT with SQL Functions
When using SQL functions in INSERT statements, pass function parameters separately:

```typescript
// ✅ Correct - Separate parameter for datetime duration
const duration = `+${expiryDays} days`;
const [session] = await sql`
  INSERT INTO sessions (id, user_id, expires_at)
  VALUES (${sessionId}, ${userId}, datetime('now', ${duration}))
  RETURNING *
`;

// ❌ Incorrect - Concatenating in template literal
const [session] = await sql`
  INSERT INTO sessions (id, user_id, expires_at)
  VALUES (${sessionId}, ${userId}, datetime('now', '+${expiryDays} days'))
  RETURNING *
`;
```

## Common Patterns

### Delete Operations
```typescript
async deleteUser(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM users WHERE id = ${id}
    RETURNING changes()
  `;
  
  return result.count > 0;
}
```

### Update Operations
```typescript
async updateUser(id: string, data: UpdateData): Promise<User> {
  const result = await sql`
    UPDATE users 
    SET name = ${data.name}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  
  const user = result[0];
  if (!user) {
    throw new Error('User not found');
  }
  
  return user as User;
}
```

### Bulk Operations
```typescript
async deleteUserSessions(userId: string): Promise<number> {
  const result = await sql`
    DELETE FROM sessions WHERE user_id = ${userId}
    RETURNING changes()
  `;
  
  return result.count;
}
```

## Key Rules

1. **Always use `RETURNING changes()` for DELETE/UPDATE operations when you need row count**
2. **Access the count via `result.count`**
3. **Without RETURNING clause, DELETE/UPDATE operations return empty arrays**
4. **For updates that return data, use `RETURNING *` and check `result[0]` exists**
5. **Use `result.count` for affected row counts, not `result.changes` or `result.length`**

## Testing Considerations

In tests, verify the actual behavior:

```typescript
test('should delete user and return true when user exists', async () => {
  const user = await db.createUser('test@example.com');
  
  const result = await db.deleteUser(user.id);
  
  expect(result).toBe(true);
  
  // Verify deletion
  const found = await db.findUserById(user.id);
  expect(found).toBeNull();
});
```

This approach ensures reliable, testable database operations that work correctly with Bun's SQL implementation.
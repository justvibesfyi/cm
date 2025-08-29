# Testing Guidelines

## What to test
Test only core features and logic. Do not test routes.
And when testing, always keep it minmal, testing core features not every possible combination and edgecase.

## Testing Framework
ChatMesh uses Bun's built-in testing framework for all unit and integration tests.

## Test Configuration

### Bun Test Setup
Tests are configured in `bunfig.toml` with the following settings:
- Test files: `**/*.test.ts` and `**/*.spec.ts`
- Default timeout: 5000ms
- Environment variables set for test runs

### Database Testing
When testing database operations, always use an in-memory SQLite database:

```typescript
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { sql } from 'bun';
import { initializeApp } from '../database/index.js';

describe('Database Operations', () => {
  let originalDatabaseUrl: string | undefined;

  beforeAll(async () => {
    // Store original DATABASE_URL
    originalDatabaseUrl = process.env.DATABASE_URL;
    
    // Set test database URL (in-memory SQLite)
    process.env.DATABASE_URL = 'sqlite::memory:';
    
    // Initialize the database with migrations
    await initializeApp();
  });

  afterAll(() => {
    // Restore original DATABASE_URL
    if (originalDatabaseUrl !== undefined) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
  });

  beforeEach(async () => {
    // Clean up tables before each test
    await sql`DELETE FROM table_name`;
  });
});
```

## Database Query Guidelines

### Always Use sql`` Template
All database queries in tests must use the `sql` template literal from Bun:

```typescript
// ✅ Correct - Using sql template
await sql`SELECT * FROM users WHERE email = ${email}`;
await sql`INSERT INTO users (email, permissions) VALUES (${email}, ${permissions})`;
await sql`DELETE FROM user_registrations`;

// ❌ Incorrect - Direct database calls
db.query('SELECT * FROM users WHERE email = ?', [email]);
```

### Database Initialization
Always initialize the database using the `initializeApp` function from `database/index.ts`:

```typescript
import { initializeApp } from '../database/index.js';

beforeAll(async () => {
  process.env.DATABASE_URL = 'sqlite::memory:';
  await initializeApp(); // This runs migrations and sets up the database
});
```

## Test Structure Guidelines

### Test Organization
- Place test files in `__tests__` directories alongside the code they test
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Use `beforeEach` for test isolation and cleanup

### Test Patterns
```typescript
describe('useServiceName', () => {
  describe('methodName', () => {
    test('should handle success case', async () => {
      // Arrange
      const input = 'test-data';
      
      // Act
      const result = await service.methodName(input);
      
      // Assert
      expect(result).toMatchObject({
        property: expect.any(String)
      });
    });

    test('should handle error case', async () => {
      // Test error scenarios
      await expect(
        service.methodName('invalid-input')
      ).rejects.toThrow('Expected error message');
    });
  });
});
```

### Data Cleanup
Always clean up test data between tests to ensure isolation:

```typescript
beforeEach(async () => {
  // Clean up all relevant tables
  await sql`DELETE FROM user_registrations`;
  await sql`DELETE FROM users`;
  await sql`DELETE FROM sessions`;
});
```

## Composable Service Testing

When testing composable services, instantiate them within the test scope:

```typescript
describe('useEmail', () => {
  let mail: ReturnType<typeof useEmail>;

  beforeAll(() => {
    mail = useEmail();
  });

  test('should send email successfully', async () => {
    const result = await mail.sendRegistrationEmail('test@example.com', 'magic-link');
    expect(result.success).toBe(true);
  });
});
```

## Integration Testing

For integration tests that span multiple services:

```typescript
describe('Registration Flow Integration', () => {
  test('should handle complete registration flow', async () => {
    const email = 'integration@example.com';
    
    // 1. Check initial state
    expect(await db.isEmailRegistered(email)).toBe(false);
    
    // 2. Create registration
    const registration = await db.createRegistration(email, token, expiresAt);
    
    // 3. Verify intermediate state
    const found = await db.findRegistrationByEmail(email);
    expect(found?.status).toBe('pending');
    
    // 4. Complete flow
    await db.completeRegistration(token);
    
    // 5. Verify final state
    expect(await db.isEmailRegistered(email)).toBe(true);
  });
});
```

## Error Testing

Test both success and failure scenarios:

```typescript
test('should handle database constraint violations', async () => {
  const email = 'duplicate@example.com';
  
  // Create first record
  await db.createUser(email);
  
  // Attempt duplicate should fail
  await expect(
    db.createUser(email)
  ).rejects.toThrow();
});
```

## Mock Guidelines

When mocking external services, use Bun's built-in mocking:

```typescript
import { mock } from 'bun:test';

const mockMailgun = mock(() => ({
  messages: {
    create: mock(() => Promise.resolve({ id: 'test-message-id' }))
  }
}));
```

## Running Tests

### Commands
```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test packages/back/src/database/__tests__/users.test.ts

# Run tests with coverage
bun test --coverage
```

### Test Environment
- Tests automatically use in-memory SQLite database
- Environment variables are isolated per test run
- Database state is reset between test files
- Each test should clean up its own data in `beforeEach`

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Descriptive Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
4. **Error Cases**: Always test both success and failure scenarios
5. **Database Cleanup**: Clean up test data between tests to prevent interference
6. **Realistic Data**: Use realistic test data that matches production scenarios
7. **Performance**: Keep tests fast by using in-memory databases and minimal setup

## Common Patterns

### Testing Database Operations
```typescript
test('should create and retrieve user', async () => {
  const userData = { email: 'test@example.com', permissions: ['user'] };
  
  const created = await db.createUser(userData);
  expect(created.id).toBeDefined();
  
  const retrieved = await db.findUserByEmail(userData.email);
  expect(retrieved).toMatchObject(userData);
});
```

### Testing API Endpoints
```typescript
test('should handle POST /api/register', async () => {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
});
```

This testing approach ensures reliable, fast, and maintainable tests across the ChatMesh codebase.
# Composable Service Pattern

## Overview
All services in ChatMesh should use the composable pattern instead of class-based services for cleaner, more functional code.

## Pattern Guidelines

### Use Composable Functions
Instead of creating service classes, create composable functions that return objects with methods:

```typescript
// ✅ Good - Composable pattern
export function useEmail() {
  return {
    async sendRegistrationEmail(email: string, magicLink: string): Promise<EmailSendResult> {
      // implementation
    },
    
    async sendLoginMagicLink(email: string, magicLink: string): Promise<EmailSendResult> {
      // implementation
    }
  };
}

// Usage
const mail = useEmail();
await mail.sendRegistrationEmail(email, link);
```

```typescript
// ❌ Avoid - Class-based services
export class EmailService {
  constructor() {
    // initialization
  }
  
  async sendRegistrationEmail(email: string, magicLink: string): Promise<EmailSendResult> {
    // implementation
  }
}

// Usage (more verbose)
const emailService = new EmailService();
await emailService.sendRegistrationEmail(email, link);
```

### Benefits
- **Cleaner syntax**: `const mail = useEmail()` vs `const emailService = new EmailService()`
- **Functional approach**: More aligned with modern JavaScript/TypeScript patterns
- **Less boilerplate**: No need for constructor logic or class inheritance
- **Better testability**: Easier to mock and test individual functions
- **Composability**: Can easily combine multiple composables

### Implementation Rules
1. All service functions should start with `use` prefix (e.g., `useAuth`, `useEmail`, `useDatabase`)
2. Return an object with methods, not a class instance
3. Handle initialization internally (singletons, connections, etc.)
4. Keep the API surface clean and minimal
5. Use TypeScript interfaces for return types, not for service contracts

### Examples
```typescript
// Database operations
const db = useDatabase();
await db.createUser(userData);
```

This pattern should be applied to all new services and existing services should be refactored when touched.
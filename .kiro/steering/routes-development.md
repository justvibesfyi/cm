# Route Development Guidelines

## File Naming Convention
- Route files should be named `[feature]Routes.ts` (e.g., `companyRoutes.ts`, `manageRoutes.ts`)
- Place all route files in `back/routes/` directory
- Use camelCase for the exported constant matching the filename

## Route Structure Pattern

### Basic Setup
```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import requiresAuth from "./middleware/requiresAuth";
import useServiceName from "../svc/serviceName";

// Define validation schemas at the top
const updateSchema = z.object({
  field: z.string().min(1).max(50),
  // ... other fields
});

export const featureRoutes = new Hono()
  .use("*", requiresAuth) // Protect all routes
  .get("/endpoint", async (c) => {
    // Implementation
  })
  .post("/endpoint", zValidator("json", updateSchema), async (c) => {
    // Implementation
  });
```

## Authentication Requirements
- **Always use `requiresAuth` middleware** on all routes with `.use("*", requiresAuth)`
- Access authenticated user via `c.var.user.id` and `c.var.user.email`
- The middleware automatically handles session validation and user lookup

## Database Access Pattern
- **Never use direct SQL in routes** - all database operations must go through service files
- Import services using the composable pattern: `const serviceName = useServiceName()`
- Services are located in `back/svc/[service].ts`

## Validation
- Use Zod schemas for request validation with `zValidator("json", schema)` for POST/PUT/DELETE
- Use `zValidator("query", schema)` for GET request query parameters
- Define schemas at the top of the file before the route definitions
- Use descriptive schema names (e.g., `updateCompanySchema`, `createUserSchema`)
- For query params: use `z.coerce.number()` for numeric values, not string transforms

## Error Handling
- Return consistent error responses: `c.json({ error: "Message" }, statusCode)`
- Use appropriate HTTP status codes (400 for bad request, 401 for unauthorized, etc.)
- Return success responses: `c.json({ success: true, ...data })`

## Service Integration
- Import services at the top: `import useServiceName from "../svc/serviceName"`
- Instantiate services within route handlers: `const service = useServiceName()`
- Let services handle all business logic and database operations

## Example Route Structure
```typescript
export const companyRoutes = new Hono()
  .use("*", requiresAuth)
  .post("/onboard", zValidator("json", updateCompanySchema), async (c) => {
    const { name, description, icon } = c.req.valid("json");
    
    const { company_id } = c.var.user;

    if (!company_id) {
      return c.json({ error: "You're already in a company" }, 401);
    }
    
    const comp = useCompany();
    const new_company_id = await comp.createCompany(
      c.var.user.id,
      name,
      description,
      icon
    );
    
    return c.json({ success: true, company_id: new_company_id });
  });
```

## Key Rules
1. All routes must be protected with `requiresAuth`
2. Database access only through service files in `svc/`
3. Use Zod validation for all request bodies and query parameters
4. Follow consistent error/success response format
5. Keep route handlers focused on HTTP concerns, not business logic
6. Avoid path params - use query params for GET requests, JSON body for POST/PUT/DELETE
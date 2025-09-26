# Design Document

## Overview

The User Invitations feature extends ChatMesh's authentication and onboarding system to support company-based user invitations. The design leverages the existing composable service pattern, authentication middleware, and database architecture while adding new invitation management capabilities.

The system enables existing company users to invite new users via email, manages invitation lifecycle, and integrates with the onboarding flow to allow seamless company joining. The design ensures data integrity by preventing duplicate company assignments and cleaning up stale invitations.

## Architecture

### Database Layer
The invitation system adds a new `invitation` table to the existing schema, following the established patterns with proper indexing and relationships. The table stores invitation tokens, email addresses, company associations, and timestamps.

### Service Layer
A new `useInvitation()` composable service handles all invitation-related business logic, following the established pattern used by `useAuth()`, `useEmployee()`, and `useCompany()`. This service manages invitation creation, validation, acceptance, and cleanup operations.

### API Layer
New endpoints are added to the existing `manageRoutes.ts` file, maintaining consistency with current authentication and validation patterns. The routes handle invitation CRUD operations and integrate with the authentication middleware.

### Authentication Integration
The invitation system extends the existing authentication flow by adding invitation-based login that bypasses email verification. This maintains security while providing a streamlined experience for invited users.

## Components and Interfaces

### Database Schema

#### Invitation Table
```typescript
export const invitation = sqliteTable("invitation", {
    id: text().primaryKey(), // UUID token for invitation links
    email: text().notNull(),
    company_id: integer().notNull().references(() => company.id, { onDelete: "cascade" }),
    created_by: text().notNull().references(() => employee.id),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    expires_at: text().notNull(), // 7 days from creation
});
```

#### Indexes
- `idx_invitation_email`: For efficient lookup by email
- `idx_invitation_company`: For company-based queries
- `idx_invitation_expires`: For cleanup operations

#### Relations
- Invitation belongs to Company (cascade delete)
- Invitation created by Employee
- No direct user relation (email-based lookup)

### Service Interface

#### useInvitation() Composable
```typescript
interface InvitationService {
    createInvitation(email: string, company_id: number, created_by: string): Promise<string>
    getCompanyInvitations(company_id: number): Promise<Invitation[]>
    getUserInvitations(email: string): Promise<Invitation[]>
    revokeInvitation(invitation_id: string, company_id: number): Promise<boolean>
    validateInvitation(invitation_id: string): Promise<Invitation | null>
    acceptInvitation(invitation_id: string, user_id: string): Promise<boolean>
    cleanupUserInvitations(email: string): Promise<void>
    isUserEligible(email: string): Promise<boolean>
}
```

### API Endpoints

#### Manage Routes Extensions
```typescript
// POST /api/manage/invite
// Body: { email: string }
// Creates new invitation for company user's company

// GET /api/manage/invitations
// Returns list of pending invitations for user's company

// DELETE /api/manage/invitations/:id
// Revokes specific invitation (company ownership verified)

// GET /api/auth/invitation/:token
// Validates invitation and logs user in

// GET /api/onboard/invitations
// Returns invitations for authenticated user's email

// POST /api/onboard/accept-invitation
// Body: { invitation_id: string }
// Accepts invitation and assigns user to company
```

## Data Models

### Core Types
```typescript
interface Invitation {
    id: string; // UUID token
    email: string;
    company_id: number;
    created_by: string;
    created_at: string;
    expires_at: string;
    company_name?: string; // Joined data for display
    creator_name?: string; // Joined data for display
}

interface InvitationCreateRequest {
    email: string;
}

interface InvitationAcceptRequest {
    invitation_id: string;
}
```

### Validation Schemas
```typescript
const invitationCreateSchema = z.object({
    email: z.string().email().max(255)
});

const invitationAcceptSchema = z.object({
    invitation_id: z.string().uuid()
});
```

## Error Handling

### Invitation Creation Errors
- **User Already Has Company**: Return 400 with descriptive message
- **Invalid Email**: Return 400 with validation error
- **Duplicate Invitation**: Allow overwrite with new expiration
- **Email Service Failure**: Log error, return 500 with generic message

### Invitation Acceptance Errors
- **Invalid/Expired Token**: Return 404 with "Invitation not found"
- **User Already Has Company**: Return 400 with "Already assigned to company"
- **Database Constraint Violation**: Return 500 with generic error

### Authorization Errors
- **Unauthorized Access**: Return 401 via existing middleware
- **Cross-Company Access**: Return 403 when accessing other company's invitations

## Testing Strategy

### Unit Tests
- **Service Layer**: Test all `useInvitation()` methods with in-memory SQLite
- **Validation**: Test Zod schemas with valid/invalid inputs
- **Business Logic**: Test invitation eligibility and cleanup logic

### Integration Tests
- **API Endpoints**: Test complete request/response cycles
- **Authentication Flow**: Test invitation-based login integration
- **Database Operations**: Test transaction handling and constraint enforcement

### Test Data Management
```typescript
beforeEach(async () => {
    await sql`DELETE FROM invitation`;
    await sql`DELETE FROM employee`;
    await sql`DELETE FROM company`;
    await sql`DELETE FROM session`;
});
```

### Key Test Scenarios
1. **Invitation Lifecycle**: Create → List → Accept → Cleanup
2. **Cross-Company Security**: Verify users can't access other companies' invitations
3. **Email Eligibility**: Test prevention of inviting users with existing companies
4. **Expiration Handling**: Test expired invitation rejection
5. **Onboarding Integration**: Test invitation display and acceptance during onboarding

## Security Considerations

### Token Security
- Use cryptographically secure UUIDs for invitation tokens
- Implement 7-day expiration for all invitations
- Validate token ownership before any operations

### Access Control
- Verify company membership before invitation management
- Prevent cross-company invitation access
- Validate user eligibility before invitation creation

### Data Integrity
- Use database transactions for invitation acceptance
- Implement cascade deletes for company removal
- Clean up stale invitations on user company assignment

## Integration Points

### Authentication System
- Extend `useAuth()` to support invitation-based login
- Maintain existing session management patterns
- Preserve security model while adding invitation bypass

### Onboarding Flow
- Integrate invitation display into existing employee onboarding
- Maintain current company creation flow for business owners
- Add invitation acceptance to employee registration path

### Email System
- Leverage existing `useEmail()` service for invitation emails
- Follow established email template patterns
- Include invitation links with secure tokens

### Company Management
- Integrate with existing company service patterns
- Maintain current employee-company relationship model
- Ensure proper cleanup on company operations
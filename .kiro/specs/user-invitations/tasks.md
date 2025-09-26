# Implementation Plan

- [x] 1. Create database schema for invitations




  - Add invitation table to back/db/schema.ts with proper fields and relationships
  - Add indexes for email, company_id, and expires_at columns
  - Add invitation relations to existing company and employee tables
  - _Requirements: 5.1, 5.5_

- [x] 2. Implement invitation service with core business logic





  - Create back/svc/invitation.ts using composable pattern
  - Implement createInvitation method with email eligibility validation
  - Implement getCompanyInvitations method for listing company invitations
  - Implement revokeInvitation method with company ownership verification
  - _Requirements: 1.2, 1.5, 2.2, 5.4_

- [x] 3. Add invitation validation and acceptance methods
  - Implement validateInvitation method for token verification
  - Implement acceptInvitation method with transaction handling
  - Implement cleanupUserInvitations method for removing stale invitations
  - Implement isUserEligible method to check if user can be invited
  - _Requirements: 4.4, 4.5, 5.2, 5.4_

- [ ] 4. Create invitation management API endpoints



  - Create a new route file for invitation management endpoints
  - Make sure the routes are implemented similarly to the existing ones
  - Add POST /invite endpoint to a new route file for creating invitations
  - Add GET /invitations endpoint to manageRoutes for listing company invitations
  - Add DELETE /invitations/:id endpoint to manageRoutes for revoking invitations
  - Implement proper validation schemas using Zod for all endpoints
  - Add new routes to index.ts
  - _Requirements: 1.1, 1.2, 2.1, 2.3, 6.1, 6.2, 6.3_

- [ ] 5. Implement invitation-based authentication




  - Add GET /auth/invitation/:token endpoint for invitation login
  - Extend useAuth service to support invitation-based login without email verification
  - Implement automatic user creation and session management for invitation login
  - Add proper error handling for invalid or expired invitations
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Create onboarding invitation endpoints





  - Then you'll need to update the frontend onboard.tsx to display and handle invitations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.4_

- [ ] 7. Add email service integration for invitation emails




  - Extend useEmail service to support invitation email templates
  - Implement sendInvitationEmail method with invitation link generation
  - Create HTML and text email templates for invitations
  - Integrate email sending into invitation creation flow
  - _Requirements: 1.4_

- [ ] 8. Write comprehensive unit tests for invitation service
  - Create back/svc/__tests__/invitation.test.ts with in-memory database setup
  - Test invitation creation, validation, and acceptance flows
  - Test email eligibility validation and cleanup operations
  - Test error scenarios and edge cases
  - _Requirements: All requirements validation_

- [ ] 9. Write integration tests for invitation API endpoints
  - Create back/routes/__tests__/invitation.test.ts for API endpoint testing
  - Test complete invitation lifecycle through API calls
  - Test authentication and authorization for all endpoints
  - Test cross-company security and access control
  - _Requirements: All requirements validation_

- [ ] 10. Update database migrations and deployment
  - Create database migration script for invitation table
  - Test migration with existing data
  - Verify all indexes and constraints are properly created
  - Test rollback scenarios for safe deployment
  - _Requirements: 5.1, 5.5_
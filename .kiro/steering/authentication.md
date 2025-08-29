# Authentication System

## Overview
ChatMesh uses a magic link authentication system with email-based verification codes. No passwords are required - users authenticate using 6-digit codes sent to their email.

## Authentication Flow

### 1. Login Request (`POST /auth/start-login`)
- User submits email address via form
- System generates a 6-digit numeric code
- Code is stored in `auth_codes` table with 1-minute expiry
- Email with code is sent to user
- Rate limited: only one code per email per minute

### 2. Code Verification (`POST /auth/verify-login`)
- User submits email and 6-digit code via form
- System validates code against stored value
- If valid:
  - Creates user account if doesn't exist
  - Deletes any existing sessions for the user
  - Creates new session with 30-day expiry
  - Sets secure HTTP-only session cookie
  - Redirects to `/app`

### 3. Session Management
- Sessions stored in `sessions` table with expiry timestamps
- Session cookies are HTTP-only, secure, and SameSite strict
- Session expires after 30 days or manual logout

### 4. Logout (`GET /auth/logout`)
- Requires email in JSON body
- Deletes session from database
- Clears session cookie
- Redirects to `/login`

## Database Schema

### Users Table
- `id`: UUID primary key
- `email`: Unique email address
- `created_at`, `updated_at`: Timestamps

### Sessions Table
- `id`: UUID session identifier
- `user_id`: Foreign key to users table
- `expires_at`: Session expiration timestamp
- Cascading delete when user is removed

### Auth Codes Table
- `email`: Email address for code
- `code`: 6-digit numeric verification code
- `created_at`: Code generation timestamp
- Codes expire after 1 minute

## Security Features

### Rate Limiting
- Only one verification code per email per minute
- Prevents code spam and brute force attempts

### Session Security
- HTTP-only cookies prevent XSS access
- Secure flag requires HTTPS
- SameSite strict prevents CSRF
- 30-day expiration with automatic cleanup

### Code Security
- 6-digit numeric codes (1 million combinations)
- 1-minute expiry window
- Single-use codes (deleted after verification)
- Automatic cleanup of old codes

## Usage in Routes

### Authentication Check
```typescript
const auth = useAuth();
const sessionId = getCookie(c, "session");
const user = await auth.getSessionUser(sessionId);

if (!user) {
  return c.redirect('/login');
}
```

### Logout
```typescript
const auth = useAuth();
await auth.logoutSession(email, sessionId);
deleteCookie(c, "session");
```

## Email Integration
- Uses `useEmail()` composable for sending codes
- Email service handles delivery and formatting
- Codes are sent immediately after generation

## Auto-Registration
- Users are automatically registered on first successful login
- No separate registration flow required
- User accounts created with UUID and email only

This passwordless system provides secure authentication while maintaining a simple user experience.
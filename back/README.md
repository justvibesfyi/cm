# ChatMesh Backend

A multi-platform messaging aggregation system built with Bun, TypeScript, and SQLite.

## Features

- **Multi-platform Support**: Telegram, Zalo, and extensible architecture for additional platforms
- **Real-time Communication**: WebSocket support for live message updates
- **Magic Link Authentication**: Passwordless authentication system
- **RESTful API**: Comprehensive API for frontend integration
- **Link-based Architecture**: Isolated platform-specific components
- **TypeScript**: Full type safety and excellent developer experience

## Project Structure

```
src/
├── api/           # REST API endpoints and middleware
├── config/        # Application configuration
├── links/         # Platform-specific link implementations
├── models/        # Database models and repositories
├── services/      # Core business logic services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions and helpers
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime (v1.0.0 or higher)
- Node.js (for compatibility)

### Installation

```bash
# Install dependencies
bun install

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
```

### Development

```bash
# Start development server with hot reload
bun run dev

# Start production server
bun run start

# Type checking
bun run type-check

# Run tests
bun run test
```

### Configuration

The application uses environment variables for configuration. See `.env.example` for all available options.

Key configuration areas:
- **Database**: SQLite database path and settings
- **Authentication**: Magic link and session configuration
- **Email**: SMTP or email service provider settings
- **Platform APIs**: Telegram Bot API, Zalo API credentials
- **CORS**: Frontend application origins

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Magic link generation
- `GET /api/auth/magic-link/:token` - Magic link validation
- `POST /api/auth/logout` - Session termination

### Chat Management
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/conversations/:id/messages` - Send message

### Admin
- `GET /api/admin/staff` - Manage staff members
- `GET /api/admin/platforms` - Platform configurations

## WebSocket

Real-time communication is available via WebSocket at the same server port. Authentication is required for WebSocket connections.

## Architecture

The system follows a link-based architecture where:

1. **Platform Links** handle platform-specific communication
2. **Ingress Service** processes inbound messages
3. **Outflow Service** handles outbound message routing
4. **WebSocket Service** manages real-time updates
5. **Authentication Service** handles user management

## Development Status

This is the initial project structure setup. Individual components are placeholder implementations that need to be developed according to the implementation plan.

## License

Private project - All rights reserved.

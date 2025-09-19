# Technology Stack & Build System

## Runtime & Build Tools
- **Bun**: Primary JavaScript runtime and package manager
- **TypeScript**: Strict typing with ESNext target
- **Vite**: Frontend build tool and dev server

## Frontend Stack
- **React 19**: UI framework with latest features
- **TanStack Router**: Type-safe routing with devtools
- **Lucide React**: Icon library
- **React Icons**: Additional icon set

## Backend Stack
- **Bun**: Server runtime with native TypeScript support
- **Native Web APIs**: Using standard Request/Response objects
- **Custom routing**: File-based route organization
- **Mailgun.js**: Email service for magic links and notifications

## Development Configuration
- **Workspace**: Monorepo with Bun workspaces
- **Module System**: ESM with `"type": "module"`
- **Path Mapping**: Shared types accessible via `@shared/types`
- **Strict TypeScript**: Enhanced type checking enabled
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

## Common Commands

### Development
```bash
# Install dependencies
bun install

# Start frontend dev server (port 3001)
bun run dev

# Start backend server
bun run start

# Type checking across all packages
bun run type-check
```

### Build & Deploy
```bash
# Build frontend for production
bun run build

# Build backend
bun run --filter=back build

# Preview frontend build
bun run --filter=front serve
```

### Package-Specific Commands
```bash
# Backend development with watch mode
cd packages/back && bun run dev

# Frontend development
cd packages/front && bun run dev

# Run tests (when configured)
cd packages/back && bun test
```

### Code style

- When importing types from shared package, use `import ... from 'shared';` and add the package as `'shared': 'workspace:*'` in package.json

### Email Configuration

- Use mailgun.js library for all email sending functionality
- Configure Mailgun API key and domain via environment variables
- Implement email templates for registration and login magic links
- Use HTML and text formats for better compatibility
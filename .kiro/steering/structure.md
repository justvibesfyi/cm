# Project Structure & Organization

## Monorepo Layout
```
chatmesh/
├── packages/
│   ├── back/           # Backend API server
│   ├── front/          # React frontend application
│   └── shared/         # Shared types and utilities
├── .kiro/              # Kiro configuration and steering
├── package.json        # Root workspace configuration
└── tsconfig.json       # Global TypeScript configuration
```

## Backend Structure (`packages/back/`)
```
back/
├── src/
│   └── routes/         # API route handlers
│       ├── auth.ts     # Authentication endpoints
│       ├── chat.ts     # Chat/messaging endpoints
│       └── utils.ts    # Shared route utilities
├── index.ts            # Server entry point
└── package.json        # Backend dependencies
```

## Frontend Structure (`packages/front/`)
```
front/
├── src/                # React application source
├── package.json        # Frontend dependencies
└── vite.config.ts      # Vite configuration
```

## Shared Package (`packages/shared/`)
```
shared/
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── chat.ts         # Chat/messaging types
│   ├── admin.ts        # Admin interface types
│   └── api.ts          # API response types
├── index.ts            # Main exports
└── package.json        # Shared package config
```

## Conventions

### File Organization
- Route handlers in `packages/back/src/routes/` with descriptive names
- Shared utilities in `packages/back/src/routes/utils.ts`
- Type definitions organized by domain in `packages/shared/types/`
- All TypeScript files use `.ts` extension

### Import Patterns
- Use `shared` for imports from the shared package
- Do not use relative imports for other files in the project. Use absolute ones
- ESM import/export syntax throughout

### API Route Structure
- Routes organized as objects with HTTP method keys
- Consistent error handling using utility functions
- Request context creation for logging and tracing
- Standard response format with success/error structure
- Code should be self-documenting without inline comments
- Minimal logging - only add logs when specifically needed for debugging

### Naming Conventions
- camelCase for variables and functions
- PascalCase for types and interfaces
- kebab-case for file names and API endpoints
- Descriptive route handler names matching endpoints
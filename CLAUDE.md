# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI (via Anthropic's API) to generate React components based on natural language descriptions. The app runs components in a virtual file system with in-browser preview using blob URLs and ES modules.

## Development Commands

### Setup
```bash
npm run setup          # Install deps, generate Prisma client, run migrations
```

### Development
```bash
npm run dev            # Start dev server with Turbopack
npm run dev:daemon     # Start dev server in background, logs to logs.txt
```

### Build & Run
```bash
npm run build          # Production build
npm start              # Start production server
npm run lint           # Run ESLint
```

### Testing
```bash
npm test               # Run all tests with Vitest
npm test -- <file>     # Run a specific test file
npm test -- --watch    # Run tests in watch mode
```

### Database
```bash
npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma migrate dev # Create and apply new migration
npm run db:reset       # Reset database (drops all data)
npx prisma studio      # Open Prisma Studio for database inspection
```

## Architecture

### Virtual File System (VFS)
- **Core**: `src/lib/file-system.ts` - `VirtualFileSystem` class manages an in-memory file tree
- **No disk I/O**: All files exist only in memory during component generation
- **Serialization**: Files are serialized to JSON and stored in the database (`Project.data` field)
- **Operations**: Create, read, update, delete, rename files/directories. Supports text editor commands (view, str_replace, insert)

### AI Component Generation Flow
1. **Chat Interface** (`src/components/chat/ChatInterface.tsx`): User enters component description
2. **API Route** (`src/app/api/chat/route.ts`):
   - Receives messages, files (VFS state), and projectId
   - Injects system prompt from `src/lib/prompts/generation.tsx`
   - Configures AI with two tools: `str_replace_editor` and `file_manager`
   - Uses `streamText` from Vercel AI SDK for streaming responses
3. **AI Tools** (`src/lib/tools/`):
   - `str_replace.ts`: Text editor tool for viewing/creating/editing files in VFS
   - `file-manager.ts`: File operations (list, create directory, delete, rename)
4. **Provider** (`src/lib/provider.ts`):
   - Returns `anthropic(MODEL)` if `ANTHROPIC_API_KEY` is set
   - Returns `MockLanguageModel` otherwise (generates static Counter/Form/Card components)
5. **Persistence**: On stream finish, saves messages and VFS state to database (for authenticated users)

### Preview System
- **Transform** (`src/lib/transform/jsx-transformer.ts`):
  - Uses Babel standalone to transform JSX/TSX to executable JavaScript
  - Creates blob URLs for each transformed module
  - Generates ES module import map mapping file paths to blob URLs
  - Handles `@/` alias (maps to root directory)
  - Collects CSS imports and inlines them
  - Supports third-party packages via esm.sh
- **Render** (`src/components/preview/Preview.tsx`):
  - Generates iframe with HTML containing import map
  - Entry point is always `/App.jsx`
  - Includes Tailwind CSS via CDN
  - Error boundary catches runtime errors
  - Syntax errors are displayed as styled error messages
- **Hot Reload**: When AI modifies files, VFS updates → transform runs → new blob URLs → iframe reloads

### Authentication
- **JWT-based**: `src/lib/auth.ts` - Session tokens stored in httpOnly cookies
- **Middleware**: `src/middleware.ts` - Protects API routes (e.g., `/api/projects`)
- **Anonymous Mode**: Users can generate components without signing up, but data isn't persisted
- **Protected Routes**: Only authenticated users can save/load projects

### Database Schema (Prisma)
- **Schema File**: `prisma/schema.prisma` - Reference this file to understand the structure of data stored in the database
- **User**: id, email, password (bcrypt hashed), timestamps
- **Project**: id, name, userId (nullable), messages (JSON array), data (VFS serialized as JSON), timestamps
- **Database**: SQLite (`prisma/dev.db`)
- **Client Location**: Generated to `src/generated/prisma/` (custom output path)

### State Management (React Context)
- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`):
  - Manages VFS instance and file operations
  - Provides file tree, selected file, file operations
- **ChatContext** (`src/lib/contexts/chat-context.tsx`):
  - Manages chat messages, streaming state
  - Integrates with Vercel AI SDK's `useChat` hook

### Key Conventions
- **Import Alias**: `@/` maps to `/` in VFS (e.g., `@/components/Foo` → `/components/Foo.jsx`)
- **Entry Point**: Every project must have `/App.jsx` as the root component
- **Styling**: Tailwind CSS only, no inline styles
- **No HTML Files**: Components are pure React, rendered via client-side import map

## Code Style

### Comments
Use comments sparingly. Only comment complex code that isn't self-explanatory. Prefer clear variable names and function names over comments.

## Environment Variables
- `ANTHROPIC_API_KEY`: Required for AI generation (optional, falls back to mock provider)
- `JWT_SECRET`: Used for session token signing (defaults to "development-secret-key")
- `DATABASE_URL`: Set in Prisma schema (`file:./dev.db`)

## Common Workflows

### Adding New AI Tools
1. Create tool definition in `src/lib/tools/`
2. Implement execute function that operates on VFS
3. Register tool in `src/app/api/chat/route.ts` (tools object)
4. Update system prompt if needed (`src/lib/prompts/generation.tsx`)

### Modifying Transform Logic
- Edit `src/lib/transform/jsx-transformer.ts`
- Tests are in `src/lib/transform/__tests__/jsx-transformer.test.ts`
- Changes affect how JSX is compiled for browser preview

### Database Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>`
3. Run `npx prisma generate` to update client types

## Tech Stack Summary
- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma + SQLite
- **AI**: Anthropic Claude (via Vercel AI SDK)
- **Testing**: Vitest + React Testing Library
- **Bundler**: Turbopack (dev), Webpack (prod)
- **Code Transform**: Babel Standalone (browser-side)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint for code quality checks
```

### Database Management
```bash
npx prisma migrate dev             # Create and apply migrations in development
npx prisma generate                # Generate Prisma Client (auto-runs on npm install)
npx prisma studio                  # Open Prisma Studio GUI
npx prisma db seed                 # Seed database with initial data (uses scripts/seed.ts)
```

## Architecture Overview

This is a Next.js 14 application using the App Router for managing recharge codes from Excel spreadsheets.

### Key Technical Stack
- **Framework**: Next.js 14 with App Router
- **Database**: SQLite (development) with Prisma ORM
- **UI Components**: Shadcn/ui components in `components/ui/`
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context (sidebar), Zustand for complex state
- **File Processing**: XLSX library for Excel file parsing

### Core Application Flow
1. **Upload**: Users upload Excel files through drag-and-drop interface
2. **Processing**: System extracts codes from columns A and D (starting row 3)
3. **Storage**: Codes are stored in SQLite via Prisma with session tracking
4. **Management**: Users can view, send (WhatsApp/Email), and archive codes
5. **History**: All actions are logged with timestamps and status

### Database Schema
- **UploadSession**: Tracks file uploads and code counts
- **Code**: Stores individual codes with status (available/sent/archived)
- **HistoryItem**: Logs all actions performed on codes
- **ApiSetting**: Stores encrypted API configurations for services

### API Routes Structure
All API endpoints are in `app/api/`:
- `/upload` - Handles Excel file upload and parsing
- `/codes` - CRUD operations for codes
- `/codes/archive` & `/codes/unarchive` - Archive management
- `/send/email` & `/send/whatsapp` - Code sending endpoints
- `/settings/email` & `/settings/whatsapp` - Service configuration
- `/history` - Retrieve action history
- `/statistics` - Get usage metrics

### Component Architecture
- **Page Components**: Located in `app/[page]/page.tsx`
- **Shared Components**: In `components/` (e.g., upload-area, codes-grid)
- **UI Primitives**: Radix UI based components in `components/ui/`
- **Context Providers**: Sidebar and Theme providers wrap the application

### Key Implementation Details
- Excel files are parsed to extract codes from specific columns (A and D)
- Data extraction starts from row 3 to skip headers
- All database operations use Prisma Client with proper error handling
- File uploads are validated for type (.xlsx, .xls only)
- Status tracking: codes can be available, sent, or archived
- Responsive design with mobile-first approach using Tailwind breakpoints
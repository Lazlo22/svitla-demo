# Svitla Demo - React + TypeScript + Vite

A modern file system manager application built with React, TypeScript, and Vite. Similar to Google Drive or Dropbox, this application allows users to organize, manage, and view PDF documents with an intuitive drag-and-drop interface and persistent storage.

## Demo

[Live Demo Link](https://svitla-demo.vercel.app/)

## Overview

This project is a file system manager that provides a cloud storage-like experience for managing PDF documents. Users can create folders, organize files with drag-and-drop, view PDFs in-browser, and have their file structure persist locally using IndexedDB.

Key features include:

- Modern React 19 with TypeScript
- Fast development with Vite and SWC
- Drag-and-drop interfaces using react-dnd
- Form management with react-hook-form and Zod validation
- PDF viewing capabilities with react-pdf
- State management with Zustand
- Persistent storage with IndexedDB (idb-keyval)
- Routing with React Router v7
- UI components built with shadcn/ui
- Styling with Tailwind CSS v4
- Comprehensive test coverage with Vitest

## Tech Stack

### Core
- **React 19.2** - Latest React with improved performance and features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.2** - Lightning-fast build tool with HMR
- **SWC** - Super-fast TypeScript/JavaScript compiler

### UI & Styling
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI and Tailwind CSS
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - Type-safe component variants
- **tw-animate-css** - Tailwind animation utilities

### State & Data Management
- **Zustand 5.0** - Lightweight state management
- **Immer 11.0** - Immutable state updates
- **idb-keyval 6.2** - Simple IndexedDB wrapper for persistence
- **React Hook Form 7.68** - Performant form handling
- **Zod 4.2** - TypeScript-first schema validation

### Features
- **React DnD 16.0** - Drag-and-drop functionality
- **React PDF 10.2** - PDF viewing and rendering
- **React Router 7.10** - Client-side routing

### Development & Testing
- **Vitest 4.0** - Fast unit testing framework
- **Testing Library** - React component testing utilities
- **ESLint 9** - Code linting
- **@vitest/coverage-v8** - Code coverage reporting

## Setup Guide

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd svitla-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Testing Guide

This project uses Vitest with React Testing Library for comprehensive testing.

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are organized in the `__tests__` directory, mirroring the `src` structure:

```
__tests__/
├── components/    # Component tests
├── constants/     # Constants and configuration tests
├── hooks/         # Custom hooks tests
├── lib/           # Utility function tests
├── pages/         # Page component tests
└── stores/        # State management tests
```

### Coverage Reports

After running `npm run test:coverage`, open `coverage/index.html` in your browser to view detailed coverage reports.

### Test Configuration

- **Environment**: jsdom (simulates browser environment)
- **Setup**: `src/test/setup.ts` (global test configuration)
- **Coverage exclusions**: node_modules, test files, type definitions

## Project Structure

```
src/
├── components/    # Reusable UI components
├── constants/     # App constants and routes
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── lib/           # Utility functions and helpers
├── pages/         # Page components
├── stores/        # Zustand state stores
├── test/          # Test utilities and setup
├── types/         # TypeScript type definitions
└── zod/           # Zod validation schemas
```

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/` → `src/`
- `@pages/` → `src/pages/`
- `@layouts/` → `src/layouts/`
- `@components/` → `src/components/`
- `@ui/` → `src/components/ui/`
- `@hooks/` → `src/hooks/`
- `@constants/` → `src/constants/`
- `@lib/` → `src/lib/`
- `@stores/` → `src/stores/`
- `@type/` → `src/types/`
- `@zod/` → `src/zod/`

## Possible Improvements

### Performance
- Implement code splitting with React.lazy for route-based chunking
- Use more memoization with useMemo, useCallback, and memo
- Optimize bundle size with dynamic imports for heavy libraries (react-pdf)
- Implement virtual scrolling for large lists

### Features
- Add internationalization (i18n) support
- Add user authentication and authorization
- Add error boundary components for better error handling

### Developer Experience
- Add Storybook for component documentation
- Set up Husky for pre-commit hooks
- Add Prettier for consistent code formatting
- Implement conventional commits with commitlint
- Add GitHub Actions for CI/CD
- Set up automated dependency updates with Dependabot

### Testing
- Increase test coverage to 90%+
- Add E2E tests with Playwright or Cypress

### Code Quality
- Enable stricter TypeScript rules (strict mode)
- Add type-aware ESLint rules
- Implement accessibility audits with axe-core
- Add bundle size monitoring
- Set up performance monitoring (Web Vitals)

### Infrastructure
- Add Docker configuration for containerization
- Set up environment-specific configurations
- Implement feature flags system
- Set up monitoring and logging (Sentry, LogRocket)

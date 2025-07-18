# Next.js 15 Migration Guide for DayTradeDakCRM

## Overview
This document outlines the steps to migrate DayTradeDakCRM from Next.js 14.2.4 to Next.js 15.2.0.

## Breaking Changes

### 1. Async Request APIs
APIs that rely on runtime request information are now **async**:
- `cookies()`
- `headers()`
- `draftMode()`
- `params` in `layout.js`, `page.js`, `route.js`, `default.js`, `opengraph-image.js`, etc.
- `searchParams` in `page.js`

### 2. Caching Defaults
- **Route Handlers**: GET functions are no longer cached by default
- **Client Router Cache**: No longer caches page components by default

### 3. React 19
Next.js 15 uses React 19 RC. Key changes:
- Removed deprecated React APIs
- Stricter type checking
- New features available

## Migration Steps

### Step 1: Update Dependencies
```bash
npm install next@latest react@rc react-dom@rc
npm install -D @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

### Step 2: Run Codemod
```bash
npx @next/codemod@latest upgrade latest
```

### Step 3: Manual Updates Required

#### Update Async APIs
Before:
```typescript
export default function Page({ params }) {
  const { id } = params;
  // ...
}
```

After:
```typescript
export default async function Page({ params }) {
  const { id } = await params;
  // ...
}
```

#### Update Route Handlers
Add caching where needed:
```typescript
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour
```

### Step 4: Update Configuration
Update `next.config.mjs` for any deprecated options.

### Step 5: Test Thoroughly
- Run development server
- Build for production
- Test all routes
- Verify authentication flows
- Check data fetching

## Rollback Plan
If issues arise:
1. Revert package.json changes
2. Run `npm install`
3. Restore any code changes

## Timeline
- Preparation: 1 hour
- Migration: 2-4 hours
- Testing: 2-3 hours
- Total: ~1 day
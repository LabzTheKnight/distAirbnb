# React Hydration Error Fix

## Problem
The application was throwing a **React Error #418** (Hydration Mismatch) when built and run in Docker. This occurred because the server-rendered HTML didn't match the client-side rendered content.

## Root Causes

### 1. **AuthContext** - Immediate API Calls
- The `useEffect` in `AuthContext` was immediately calling `checkAuthStatus()` on mount
- This function accessed `AsyncStorage` (localStorage on web) during SSR
- Server-side: No storage access → no user data
- Client-side: Storage accessed → user data loaded
- Result: **Content mismatch** between server and client

### 2. **ListingContext** - Immediate Data Fetching
- The `useEffect` in `ListingContext` was immediately calling `refreshListings()` on mount
- This fetched data from the API during initial render
- Server-side: Empty listings array
- Client-side: Listings populated from API
- Result: **Content mismatch** between server and client

### 3. **AsyncStorage Access During SSR**
- `AsyncStorage` (localStorage) doesn't exist during server-side rendering
- No browser environment checks before accessing storage
- This caused errors and inconsistent state

## Solutions Implemented

### 1. Added Hydration Guards to Contexts

**AuthContext** (`context/AuthContext.tsx`):
```typescript
const [isHydrated, setIsHydrated] = useState(false);

// First effect: Mark as hydrated on client
useEffect(() => {
    setIsHydrated(true);
}, []);

// Second effect: Check auth status only after hydration
useEffect(() => {
    if (!isHydrated) return;
    // ... API calls here
}, [isHydrated]);
```

**ListingContext** (`context/ListingContent.tsx`):
```typescript
const [isHydrated, setIsHydrated] = useState(false);

// First effect: Mark as hydrated on client
useEffect(() => {
    setIsHydrated(true);
}, []);

// Second effect: Load listings only after hydration
useEffect(() => {
    if (!isHydrated) return;
    // ... API calls here
}, [isHydrated]);
```

### 2. Added Browser Environment Check to Storage

**tokenStorage.ts** (`services/storage/tokenStorage.ts`):
```typescript
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const saveToken = async (token: string) => {
    if (!isBrowser) return;
    // ... storage operations
};

export const getToken = async (): Promise<string | null> => {
    if (!isBrowser) return null;
    // ... storage operations
};
```

## How It Works

1. **Server-Side Rendering (SSR)**:
   - `isHydrated` starts as `false`
   - No API calls or storage access happens
   - Renders initial "loading" state consistently

2. **Client-Side Hydration**:
   - First `useEffect` runs, sets `isHydrated` to `true`
   - Second `useEffect` triggers, runs API calls
   - Content updates after hydration is complete

3. **No Mismatch**:
   - Server and client render the same initial state
   - Client updates after hydration, which is expected and allowed
   - React doesn't throw hydration errors

## Testing

After applying these fixes, rebuild and run your Docker container:

```bash
# Rebuild the frontend
docker-compose build dist_airbnb

# Run the container
docker-compose up dist_airbnb
```

The hydration error should be resolved, and the app should load without the React #418 error.

## Additional Notes

- This pattern is similar to how `useColorScheme` handles hydration (see `hooks/use-color-scheme.web.ts`)
- The initial loading state is consistent between server and client
- Data fetching happens only after React confirms the client has hydrated
- This is the recommended approach for SSR/SSG with Expo Router

## References

- [React Hydration Errors](https://react.dev/link/hydration-mismatch)
- [React Error #418](https://react.dev/errors/418)
- [Expo Router SSR Guide](https://docs.expo.dev/router/reference/static-rendering/)

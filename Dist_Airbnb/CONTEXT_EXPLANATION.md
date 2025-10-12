# React Context: When to Use It & Why

## 🤔 **The Question:**
**"Do I need Context for API calls, or can I just call the API service directly?"**

## ✅ **Short Answer:**
**YES, you should use Context for listings because:**
- Listings are used in multiple screens (Home, Explore, Favorites, Detail)
- You want to cache data and avoid duplicate API calls
- You need global state (favorites, recently viewed)
- Better user experience (instant navigation, no loading delays)

---

## 📊 **Comparison: With vs Without Context**

### **❌ WITHOUT Context (Direct API Calls)**

```typescript
// Explore Screen
const ExploreScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings().then(data => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  return <ListingList listings={listings} loading={loading} />;
}

// Home Screen
const HomeScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings().then(data => { // ⚠️ Same API call again!
      setListings(data);
      setLoading(false);
    });
  }, []);

  return <FeaturedListings listings={listings.slice(0, 5)} />;
}

// Detail Screen
const DetailScreen = ({ id }) => {
  const [listing, setListing] = useState(null);
  
  useEffect(() => {
    getListing(id).then(setListing); // ⚠️ Could be cached!
  }, [id]);

  return <ListingDetail listing={listing} />;
}
```

**Problems:**
- 🔴 Multiple API calls for same data
- 🔴 Slow navigation (loading on every screen)
- 🔴 No data sharing between screens
- 🔴 Favorites/bookmarks reset on navigation
- 🔴 Inconsistent loading states
- 🔴 More code repetition

---

### **✅ WITH Context (Smart Caching)**

```typescript
// App Layout
<ListingProvider>
  <AuthProvider>
    <Stack />
  </AuthProvider>
</ListingProvider>

// Explore Screen
const ExploreScreen = () => {
  const { listings, loading, refreshListings } = useListings();

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={loading} onRefresh={refreshListings} />
    }>
      <ListingList listings={listings} />
    </ScrollView>
  );
}

// Home Screen
const HomeScreen = () => {
  const { listings } = useListings(); // ✅ Instant! Data already loaded

  return <FeaturedListings listings={listings.slice(0, 5)} />;
}

// Detail Screen
const DetailScreen = ({ id }) => {
  const { selectedListing, selectListing } = useListings();

  useEffect(() => {
    selectListing(id); // ✅ Cached if recently viewed
  }, [id]);

  return <ListingDetail listing={selectedListing} />;
}

// Favorites Screen
const FavoritesScreen = () => {
  const { listings, favorites, isFavorite } = useListings();
  
  const favoriteListings = listings.filter(l => isFavorite(l.id));
  
  return <ListingList listings={favoriteListings} />;
}
```

**Benefits:**
- ✅ API called once, data shared everywhere
- ✅ Instant navigation (no loading delays)
- ✅ Global favorites that persist
- ✅ Pull-to-refresh works everywhere
- ✅ Consistent loading/error states
- ✅ Much cleaner code

---

## 🎯 **When to Use Context**

### **✅ USE Context When:**

1. **Data is shared across multiple components**
   - User authentication
   - Shopping cart
   - App settings/theme
   - **Listings in your Airbnb app** ✅

2. **You need caching/persistence**
   - Avoid refetching same data
   - Maintain state during navigation
   - **Listings should be cached** ✅

3. **Global actions affect multiple screens**
   - Login/logout
   - Add to favorites
   - **Toggle favorite on any screen** ✅

4. **You want to avoid prop drilling**
   - Passing data through many levels
   - Makes code harder to maintain

---

### **❌ DON'T Use Context When:**

1. **Data is only used in one place**
   ```typescript
   // Bad: Context for one-time user profile edit
   const ProfileEditScreen = () => {
     const { profile } = useProfile(); // Overkill!
   }

   // Good: Direct API call
   const ProfileEditScreen = () => {
     const [profile, setProfile] = useState(null);
     useEffect(() => {
       getUserProfile().then(setProfile);
     }, []);
   }
   ```

2. **Temporary/transient data**
   - Form inputs
   - Modal open/close state
   - Search query (unless you want to persist it)

3. **Frequently changing data**
   - Real-time counters
   - Animation values
   - Mouse position
   - *Use local state or other solutions*

4. **You're already using Redux/Zustand/Jotai**
   - Context becomes redundant
   - State management library is better

---

## 🏗️ **Architecture Pattern**

### **Recommended Structure:**

```
Context Layer (Global State)
    ↓
Service Layer (API Calls)
    ↓
API Client (Axios/Fetch)
    ↓
Backend
```

### **Example:**

```typescript
// ❌ Bad: Context makes API calls directly
const AuthContext = () => {
  const login = async (username, password) => {
    const response = await axios.post('/login', { username, password });
    // Handle response...
  }
}

// ✅ Good: Context uses service layer
import { login as loginAPI } from '@/services/api/authService';

const AuthContext = () => {
  const login = async (username, password) => {
    const response = await loginAPI({ username, password });
    setUser(response.user);
  }
}
```

**Why?**
- ✅ Separation of concerns
- ✅ Easier to test
- ✅ Reusable API functions
- ✅ Can call API without Context if needed

---

## 🧪 **Your Airbnb App - Analysis**

### **AuthContext** ✅ **Good Use Case**
```typescript
✅ User data needed everywhere (header, profile, bookings)
✅ Login state affects routing (show auth screens vs main app)
✅ Token management (store/retrieve/refresh)
✅ Global logout action
```

### **ListingContext** ✅ **Good Use Case**
```typescript
✅ Listings shown in multiple screens (Home, Explore, Search)
✅ Need caching (avoid refetching on every navigation)
✅ Favorites feature (global state across screens)
✅ Recently viewed (track user history)
✅ Pull-to-refresh should update all screens
```

### **ThemeContext** ⚠️ **Maybe (Depends on App)**
```typescript
✅ If you have dark/light mode
❌ If theme never changes, use constants instead
```

---

## 💡 **Best Practices**

### **1. Keep Context Focused**
```typescript
// ❌ Bad: One massive context
const AppContext = {
  user, listings, theme, cart, notifications, settings...
}

// ✅ Good: Separate concerns
<AuthProvider>
  <ListingProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ListingProvider>
</AuthProvider>
```

### **2. Provide Loading States**
```typescript
const { listings, isLoading, error } = useListings();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
return <ListingList listings={listings} />;
```

### **3. Optimize Re-renders**
```typescript
// Only re-render when specific values change
const { listings } = useListings(); // ✅
const context = useListings(); // ❌ Re-renders on any change
```

### **4. Add Refresh Actions**
```typescript
const { refreshListings } = useListings();

<ScrollView
  refreshControl={
    <RefreshControl onRefresh={refreshListings} />
  }
>
```

---

## 📝 **Summary for Your App**

### **What You Have Now:**

✅ **AuthContext** - Manages user authentication
✅ **ListingContext** - Manages listing data, favorites, caching
✅ **API Services** - Clean separation of API calls
✅ **Type Safety** - Full TypeScript types

### **How to Use:**

```typescript
// In _layout.tsx
<AuthProvider>
  <ListingProvider>
    <Stack />
  </ListingProvider>
</AuthProvider>

// In any screen
import { useListings } from '@/context/ListingContent';
import { useAuth } from '@/context/AuthContext';

const MyScreen = () => {
  const { user } = useAuth();
  const { listings, loading, toggleFavorite } = useListings();
  
  // Use the data!
}
```

---

## 🎯 **Final Answer:**

**YES, you need ListingContext because:**
1. Listings are used in 5+ screens (Home, Explore, Detail, Favorites, Search)
2. Caching prevents duplicate API calls and improves performance
3. Favorites/bookmarks need to persist across navigation
4. Better UX with instant navigation and consistent states

**You DON'T need Context for:**
- One-time API calls (e.g., submit contact form)
- Local component state (e.g., form inputs)
- Data only used in one screen with no sharing

**Your current architecture is correct!** ✅
- Context manages state
- Services handle API calls
- Components consume data via hooks

This is the recommended React pattern! 🚀

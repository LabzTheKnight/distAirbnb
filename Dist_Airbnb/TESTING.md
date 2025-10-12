# Frontend-Backend Integration Testing Guide

## ✅ Current Status

### Backend (Auth Service)
- **Running on:** http://localhost:8001
- **Status:** ✅ Operational
- **Endpoints Available:**
  - `POST /api/auth/register/` - User registration
  - `POST /api/auth/login/` - User login
  - `POST /api/auth/logout/` - User logout (requires auth)
  - `GET /api/auth/profile/` - Get user profile (requires auth)

### Frontend (Expo App)
- **Running on:** http://localhost:8081
- **Status:** ✅ Operational
- **Auth Screens:**
  - `/login` - Modern login screen with validation
  - `/register` - Beautiful registration form with full validation

## 🧪 Test Accounts

### Existing Test User
- **Username:** `testuser123`
- **Password:** `testpass123`
- **Email:** `test@example.com`
- **Name:** Test User

## 📱 How to Test

### Option 1: Test Login Flow
1. Open your Expo app in browser/simulator
2. Navigate to **Login screen** (`/(auth)/login`)
3. Enter credentials:
   - Username: `testuser123`
   - Password: `testpass123`
4. Click **"Sign In"** button
5. **Expected Result:**
   - ✅ Success alert with "Welcome back, testuser123!"
   - ✅ Redirects to home screen
   - ✅ User info stored in AuthContext
   - ✅ Token saved in AsyncStorage

### Option 2: Test Registration Flow
1. Open your Expo app
2. Navigate to **Register screen** (`/(auth)/register`)
3. Fill out the form:
   - Username: (choose unique, 3+ chars)
   - Email: (valid email format)
   - First Name: (any)
   - Last Name: (any)
   - Password: (8+ characters)
   - Confirm Password: (must match)
4. Click **"Create Account"** button
5. **Expected Result:**
   - ✅ Success alert with "Welcome, [YourName]!"
   - ✅ Account created in backend
   - ✅ User automatically logged in
   - ✅ Token saved
   - ✅ Redirects to home screen

## 🔍 What to Look For

### Success Indicators
- ✅ Detailed success alerts showing username/name
- ✅ Smooth navigation to home screen after login/register
- ✅ Backend responds with user data and token
- ✅ No console errors

### Error Handling
The app now shows **detailed error messages** from the backend:

#### Server Errors
- "Cannot reach server. Is the backend running on localhost:8001?"
  - **Cause:** Backend is down
  - **Fix:** Start auth service with Docker

#### Validation Errors
- "Invalid credentials or server error"
  - **Cause:** Wrong username/password
  - **Fix:** Use correct credentials

#### Field-Specific Errors
- Shows which fields are invalid (red borders)
- Displays error messages under each field
- Backend validation errors displayed in alert

## 🐛 Debugging

### Check Backend Response
```bash
# Test login endpoint
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123","password":"testpass123"}'

# Expected response:
# {"message":"Login successful","user":{...},"token":"..."}
```

### Check Frontend Logs
1. Open browser DevTools console (if testing on web)
2. Look for:
   - "Login error:" or "Registration error:" messages
   - Axios request/response details
   - Any network errors

### Verify Token Storage
The app uses AsyncStorage to persist auth tokens. After successful login:
- Token is saved automatically
- On app restart, AuthContext checks for existing token
- If token exists, user stays logged in

## 🎯 Integration Points

### What's Connected
1. ✅ **Login Screen** → `AuthContext.signIn()` → `authService.login()` → Backend `/login/`
2. ✅ **Register Screen** → `AuthContext.signUp()` → `authService.register()` → Backend `/register/`
3. ✅ **Token Management** → `tokenStorage` → AsyncStorage
4. ✅ **API Interceptor** → Automatically adds token to requests
5. ✅ **Error Handling** → Backend errors → Detailed alerts

### What's NOT Connected Yet
- ⏳ Profile screen (needs implementation)
- ⏳ Listing management (Phase 2)
- ⏳ Token refresh logic
- ⏳ Logout functionality (UI exists, needs testing)

## 📋 Next Steps

After confirming login/register works:
1. Test logout flow
2. Implement profile screen
3. Add token refresh mechanism
4. Connect listing management
5. Add persistent login (remember me)

## 🔗 Files Changed

### Fixed/Updated
- `/app/(auth)/login.tsx` - Redesigned with modern UI + detailed error handling
- `/app/(auth)/register.tsx` - Now uses AuthContext.signUp() properly
- `/services/api/authService.ts` - Fixed removeToken() bug
- **Deleted:** `/app/(tabs)/login.tsx` - Was duplicate, kept the one in (auth)

### Key Files
- `/context/AuthContext.tsx` - Auth state management
- `/services/api/authService.ts` - API calls to backend
- `/services/api/apiClient.ts` - Axios instances with interceptors
- `/services/storage/tokenStorage.ts` - AsyncStorage wrapper

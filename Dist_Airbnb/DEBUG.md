# Login Debug Guide

## ✅ What Changed

### Immediate Navigation
- **Before:** Alert appears first, user must click "OK" to navigate
- **After:** App navigates to home immediately, then shows success alert

### Enhanced Logging
Added comprehensive console logging to track the entire login flow:

```
Login Button Clicked
  ↓
🔐 Login Screen: "Attempting login with: testuser123"
  ↓
📞 AuthContext: "Calling login API..."
  ↓
🌐 authService: "Sending login request to backend..."
  ↓
📡 authService: "Received response: 200 {message, user, token}"
  ↓
💾 authService: "Saving token..."
  ↓
✅ authService: "Token saved, returning data"
  ↓
📦 AuthContext: "Received response: {...}"
  ↓
👤 AuthContext: "Setting user: {id, username, email...}"
  ↓
✅ AuthContext: "User set successfully"
  ↓
✅ Login Screen: "Login successful! Navigating to home..."
  ↓
🏠 Router: Navigate to /(tabs)
  ↓
💬 Success Alert: "Welcome back, testuser123!"
```

## 🧪 How to Test

### Option 1: Web Browser (Easiest for debugging)
1. Open `http://localhost:8081` in Chrome/Firefox
2. Open DevTools Console (F12)
3. Navigate to login page
4. Enter credentials:
   - Username: `testuser123`
   - Password: `testpass123`
5. Click "Sign In"
6. **Watch the console** - you should see all the emoji logs
7. **Expected:** Immediate redirect to home, then success alert

### Option 2: iOS Simulator
1. Run app in simulator
2. To see logs: In terminal run `npx expo start` and watch output
3. Test login flow

### Option 3: Android Emulator  
1. Run app in emulator
2. Use `adb logcat` or check Metro bundler output for logs

## 🔍 What to Look For

### ✅ Success Indicators
1. **Console Logs:**
   ```
   🔐 Attempting login with: testuser123
   📞 AuthContext: Calling login API...
   🌐 authService: Sending login request to backend...
   📡 authService: Received response: 200
   💾 authService: Saving token...
   ✅ authService: Token saved
   📦 AuthContext: Received response
   👤 AuthContext: Setting user
   ✅ AuthContext: User set successfully
   ✅ Login successful! Navigating to home...
   ```

2. **Backend Logs (Docker):**
   ```
   [11/Oct/2025 19:46:21] "POST /api/auth/login/ HTTP/1.1" 200 249
   ```

3. **Visual Behavior:**
   - Form button shows loading spinner
   - Screen immediately changes to home (tabs)
   - Success alert appears on home screen
   - User info displayed on home screen

### ❌ Error Indicators

#### Network Error
- **Console:** `Cannot reach server. Is the backend running on localhost:8001?`
- **Fix:** Check Docker containers are running

#### Invalid Credentials
- **Console:** `❌ authService: Login error`
- **Backend:** `"POST /api/auth/login/ HTTP/1.1" 401` or `400`
- **Fix:** Check username/password

#### Token Not Saving
- **Console:** Stops after "Saving token..."
- **Fix:** Check AsyncStorage permissions

## 🐛 About Those 404 Errors

You saw these in Docker logs:
```
Not Found: /api/auth/
[11/Oct/2025 19:46:19] "GET /api/auth/ HTTP/1.1" 404 3209
```

**What causes this:**
- On app startup, if there's a cached token, AuthContext tries to fetch user profile
- If the cached token is invalid/expired, it might cause issues
- The repeated 404s suggest something is polling

**To fix:**
1. Clear AsyncStorage: Add this to your test:
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   await AsyncStorage.clear();
   ```
2. Or check if there's any polling code

## 📊 Backend Response Format

### Successful Login (200)
```json
{
  "message": "Login successful",
  "user": {
    "id": 2,
    "username": "testuser123",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "is_active": true,
    "date_joined": "2025-10-11T19:26:40.683104Z"
  },
  "token": "1e682c36aee837755bae5a87de52e4332..."
}
```

### Failed Login (400/401)
```json
{
  "error": "Invalid credentials",
  "detail": "Unable to log in with provided credentials."
}
```

## 🔧 Quick Fixes

### Problem: Not navigating after login
**Solution:** ✅ Already fixed! Now navigates immediately.

### Problem: Can't see console logs
**Solution:** 
- Web: Open browser DevTools (F12)
- Expo Go: Shake device → "Debug Remote JS"
- Metro: Watch terminal output

### Problem: Still shows login screen
**Possible causes:**
1. JavaScript error preventing navigation
2. Router not configured properly
3. Check console for errors

### Problem: Backend not responding
**Check:**
```bash
# Test backend directly
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123","password":"testpass123"}'
```

## 📝 Next Steps After Successful Login

1. ✅ Login works
2. ✅ Token saved
3. ✅ User data in AuthContext
4. ✅ Navigated to home

**Then test:**
- [ ] Close and reopen app (should stay logged in)
- [ ] Logout functionality
- [ ] Access protected routes
- [ ] Token refresh on expiry

## 💡 Pro Tips

1. **Keep DevTools open** - Watch the console logs in real-time
2. **Check both frontend AND backend logs** - See the full request/response cycle
3. **Clear cache** - If weird issues, clear AsyncStorage and restart
4. **Test error cases** - Try wrong password to ensure error handling works
5. **Test offline** - Stop backend, verify error messages are helpful

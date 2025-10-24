# 🔧 Login Page Not Displaying - Troubleshooting Guide

## Issue
The login page at `http://localhost/login` appears blank or not rendering.

## Common Causes & Solutions

### 1. **JavaScript Not Loading** ✅

Check browser console (Press F12):
```
Look for:
- Red errors in Console tab
- Failed requests in Network tab
- JavaScript bundle loading errors
```

**Solution:** Clear browser cache
- Chrome: Ctrl+Shift+Delete → Clear cache
- Or open in Incognito/Private mode: Ctrl+Shift+N

### 2. **Routing Issue** 🔄

Expo Router might need the correct URL format.

**Try these URLs:**
```
http://localhost/
http://localhost/(auth)/login
http://localhost/login
http://localhost/#/login
```

### 3. **React Hydration Issue** ⚛️

The app might be a Single Page Application (SPA) that needs to load the root first.

**Solution:**
1. Go to `http://localhost/` first
2. Then navigate to login using the app's navigation
3. Or click on a "Login" button in the UI

### 4. **Check if JavaScript is Enabled** 📜

The app requires JavaScript to render React components.

**In Browser Settings:**
- Ensure JavaScript is enabled
- Check if any extensions are blocking scripts

### 5. **CORS or API Issues** 🌐

The login page might be trying to fetch data and failing.

**Check:**
```bash
# Test if auth API is accessible
curl http://localhost:8001/api/auth/register/

# Should return an error about missing fields (which is OK)
```

### 6. **Rebuild the Frontend** 🔨

If nothing works, rebuild:

```bash
# Stop services
docker-compose down

# Rebuild frontend without cache
docker-compose build --no-cache frontend

# Start again
docker-compose up -d

# Wait 30 seconds for services to start
sleep 30

# Open browser
```

---

## Quick Debug Script

Run this script to diagnose the issue:

```bash
#!/bin/bash

echo "🔍 Diagnosing Login Page Issue..."
echo ""

echo "1️⃣ Checking if services are running..."
docker-compose ps | grep -E "frontend|auth-service"

echo ""
echo "2️⃣ Testing frontend accessibility..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/

echo ""
echo "3️⃣ Testing login page..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/login

echo ""
echo "4️⃣ Checking if JavaScript bundle exists..."
curl -s http://localhost/login | grep -o "entry.*js"

echo ""
echo "5️⃣ Testing auth API..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:8001/api/auth/register/

echo ""
echo "6️⃣ Checking frontend logs for errors..."
docker-compose logs --tail=20 frontend | grep -i "error"

echo ""
echo "✅ Diagnosis complete!"
echo ""
echo "If all tests pass, the issue is likely in the browser."
echo "Try opening http://localhost/ in an incognito window."
```

---

## Step-by-Step Testing

### Test 1: Root Page First
```
1. Open: http://localhost/
2. Does the homepage load?
3. Look for a "Login" or "Sign In" button
4. Click it to navigate to login
```

### Test 2: Direct Login URL
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Open new tab
3. Navigate to: http://localhost/login
4. Wait 5 seconds for JavaScript to load
5. Press F12 and check Console for errors
```

### Test 3: Check Network Requests
```
1. Open http://localhost/login
2. Press F12 → Network tab
3. Reload page (Ctrl+R)
4. Look for:
   ✓ HTML file loaded (200 status)
   ✓ JS bundle loaded (200 status)
   ✓ CSS files loaded (200 status)
   ✗ Any failed requests (red in Network tab)
```

### Test 4: Check React Rendering
```
1. Open http://localhost/login
2. Press F12 → Elements/Inspector tab
3. Look for <div id="root">
4. Does it have child elements?
   - If yes: React rendered, styling issue
   - If no: React not rendering, JS issue
```

---

## Browser Console Checks

Open Dev Tools (F12) and run these in Console:

```javascript
// Check if React loaded
console.log(typeof React !== 'undefined' ? 'React loaded' : 'React NOT loaded');

// Check if root element exists
console.log(document.getElementById('root') ? 'Root exists' : 'No root');

// Check if app mounted
console.log(document.getElementById('root').children.length > 0 ? 'App mounted' : 'App NOT mounted');
```

---

## Alternative: Use Register Page

If login page doesn't work, try the register page:

```
http://localhost/register
http://localhost/(auth)/register
```

They share similar code, so if one works, the other should too.

---

## Nuclear Option: Complete Restart

```bash
# Stop everything
docker-compose down -v

# Remove frontend image
docker rmi distairbnb-frontend

# Rebuild from scratch
docker-compose build --no-cache frontend

# Start services
docker-compose up -d

# Wait for startup
sleep 30

# Test
curl http://localhost/
```

---

## What Should Work

Based on your setup:

1. ✅ Frontend is running (Nginx on port 80)
2. ✅ HTML files exist (`login.html` confirmed)
3. ✅ JavaScript bundle exists
4. ✅ Services are up

**Most likely issue:** 
- Browser caching
- JavaScript error preventing render
- Need to navigate from root page first

**Best solution:**
1. Open http://localhost/ first
2. Navigate to login using the UI
3. Or try Incognito mode

---

## Get More Help

**View frontend logs:**
```bash
docker-compose logs -f frontend
```

**View browser console:**
Press F12 → Console tab

**Test in different browser:**
Try Chrome, Firefox, or Edge

**Check if it's a web-specific issue:**
The app was built for React Native but exported for web.
Some components might not render properly on web.

---

## Expected Behavior

When working correctly:
1. Page loads white/gray background
2. Gradient header appears ("Welcome Back")
3. Username input field
4. Password input field
5. "Login" button
6. "Forgot Password?" link
7. "Don't have an account? Sign up" link

If you see a blank white page:
- JavaScript isn't executing
- React isn't mounting
- Check browser console for errors

---

## Quick Fix Commands

```bash
# Restart just the frontend
docker-compose restart frontend

# Rebuild and restart
docker-compose up -d --force-recreate frontend

# View real-time logs
docker-compose logs -f frontend
```

---

## Contact Support

If nothing works:
1. Share browser console errors (F12 → Console)
2. Share network tab (F12 → Network)  
3. Share screenshot of blank page
4. Mention which browser/version you're using

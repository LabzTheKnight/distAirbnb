# 🌐 How to Access Your Application in a Web Browser

## Quick Start - Just 3 Steps!

### Step 1: Make Sure Services Are Running ✅

Your services are already running! You can verify with:
```bash
docker-compose ps
```

All services should show "Up" status.

### Step 2: Open Your Web Browser 🌐

Open any modern web browser:
- **Chrome** / **Chromium**
- **Firefox**
- **Edge**
- **Safari** (if on Mac)
- **Brave**

### Step 3: Navigate to the Application 🚀

Type this URL in your browser's address bar:

```
http://localhost
```

Or try:
```
http://127.0.0.1
```

**That's it!** Your Airbnb application should load! 🎉

---

## 🖥️ What You'll See

When you open http://localhost, you should see:

1. **Homepage** - The main landing page with listings
2. **Navigation Tabs** - Explore, Favorites, Profile, etc.
3. **Listing Cards** - 5 pre-loaded sample listings with images
4. **Interactive Elements** - Click on listings to see details

---

## 🔗 All Access Points

### Main Application (Frontend)
**URL:** http://localhost  
**Port:** 80

This is your React/Expo web application - the main user interface.

### API Endpoints (for testing)

**Auth Service API:**
- http://localhost:8001/api/auth/register/
- http://localhost:8001/api/auth/login/

**Listing Service API:**
- http://localhost:5000/api/listings - View all listings
- http://localhost:5000/api/listings/10006546 - View specific listing

---

## 🧪 Testing in the Browser

### 1. View Listings
- Open http://localhost
- You should see 5 sample listings displayed

### 2. Test Navigation
- Click through different tabs/pages
- Explore the user interface
- Check if images load correctly

### 3. Test User Registration
- Look for a "Sign Up" or "Register" button
- Fill out the registration form
- Try creating an account

### 4. Test Login
- Use the login form
- Try logging in with credentials

### 5. Test API in Browser

Open these URLs directly in your browser to see the API responses:

**View all listings (JSON):**
```
http://localhost:5000/api/listings
```

**View specific listing:**
```
http://localhost:5000/api/listings/10006546
```

You'll see the JSON data that the frontend uses!

---

## 🔧 Troubleshooting

### ❌ Can't Connect / Page Not Loading

**1. Verify services are running:**
```bash
docker-compose ps
```

All should show "Up" status.

**2. Check if port 80 is available:**
```bash
sudo netstat -tulpn | grep :80
```

**3. Try alternative URL:**
```
http://127.0.0.1
```

**4. Check frontend logs:**
```bash
docker-compose logs frontend
```

**5. Restart the frontend:**
```bash
docker-compose restart frontend
```

**6. Try a different browser:**
Some browsers cache heavily - try opening in incognito/private mode.

### ❌ Page Shows Error

**Check all services:**
```bash
docker-compose logs -f
```

Look for any error messages.

### ❌ API Data Not Loading

**Test API directly:**
```bash
curl http://localhost:5000/api/listings
```

Should return JSON with 5 listings.

**Check CORS settings:**
Open browser developer tools (F12) and look for CORS errors in the console.

---

## 🛠️ Browser Developer Tools

To debug and test:

1. **Open Developer Tools:**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)

2. **Check Console Tab:**
   - Look for JavaScript errors
   - Look for API request errors

3. **Check Network Tab:**
   - See all API requests
   - Check response status codes
   - View request/response data

4. **Check Application/Storage Tab:**
   - View stored tokens
   - Check local storage
   - Check cookies

---

## 📱 Mobile Testing (Optional)

If you want to test on your phone while it's on the same network:

1. **Find your computer's IP address:**
   ```bash
   hostname -I | awk '{print $1}'
   ```

2. **Access from phone:**
   ```
   http://YOUR_IP_ADDRESS
   ```

   For example: http://192.168.1.100

---

## 🎨 What to Look For

### Frontend Should Show:
- ✅ Clean, modern UI
- ✅ Listing cards with images
- ✅ Navigation bar/tabs
- ✅ Working buttons and links
- ✅ Responsive design

### Listings Should Display:
- ✅ Title
- ✅ Location
- ✅ Price per night
- ✅ Image
- ✅ Click to view details

### User Features:
- ✅ Registration form
- ✅ Login form
- ✅ Profile page
- ✅ Create listing form
- ✅ Edit listing functionality
- ✅ Favorites/wishlist

---

## 📊 Browser Console Testing

Open browser console (F12) and run these commands:

**Test fetch API:**
```javascript
fetch('http://localhost:5000/api/listings')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Test auth API:**
```javascript
fetch('http://localhost:8001/api/auth/register/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@test.com',
    password: 'testpass123',
    password_confirm: 'testpass123'
  })
}).then(r => r.json()).then(data => console.log(data));
```

---

## 🚀 Quick Commands

**Start services:**
```bash
docker-compose up -d
```

**Stop services:**
```bash
docker-compose down
```

**Restart frontend:**
```bash
docker-compose restart frontend
```

**View logs:**
```bash
docker-compose logs -f frontend
```

**Check status:**
```bash
docker-compose ps
```

---

## 📞 Quick Access Reminder

### 🌐 Open in Browser:
```
http://localhost
```

### 🔍 Test API in Browser:
```
http://localhost:5000/api/listings
```

### 📱 On Phone (Same Network):
```
http://YOUR_COMPUTER_IP
```

---

## ✅ Success Checklist

Before deploying to VPS, verify in browser:

- [ ] Homepage loads without errors
- [ ] All 5 sample listings are visible
- [ ] Images load correctly
- [ ] Can navigate between pages
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can view listing details
- [ ] Can create new listings (when logged in)
- [ ] Can add to favorites
- [ ] Responsive design works on different screen sizes
- [ ] No console errors (check F12)
- [ ] API calls succeed (check Network tab)

---

## 🎉 That's It!

Your application is live at **http://localhost**

Just open any web browser and type that in! 

For detailed testing instructions, see `TESTING.md`

Happy browsing! 🚀

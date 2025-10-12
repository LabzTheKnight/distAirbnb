# 🔧 CORS Fix for Listing Service

## Problem
The listing service was blocking requests from the frontend due to missing CORS headers:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/listings' from origin 'http://localhost:8081' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## Solution Implemented

### 1. Added flask-cors Dependency
**File:** `/list_service/requirements.txt`
```python
flask==3.0.3
flask-cors==4.0.0  # ← Added this
mongoengine==0.27.0
python-dotenv==1.0.1
requests==2.31.0
pymongo==4.6.1
```

### 2. Configured CORS in Flask App
**File:** `/list_service/app.py`
```python
from flask import Flask
from flask_cors import CORS
from routes import bp as listings_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8081", "http://localhost:19006", "exp://*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    app.register_blueprint(listings_bp)
    return app
```

**Allowed Origins:**
- `http://localhost:8081` - Expo web development server
- `http://localhost:19006` - Alternative Expo port
- `exp://*` - Expo mobile app development

### 3. Rebuilt Docker Container
```bash
docker-compose up -d --build list-service
```

## Authentication Flow

### Important: Listings Require Authentication
The listing service requires users to be logged in:
- **GET /api/listings** - Requires `@token_required` (any authenticated user)
- **GET /api/listings/:id** - Requires `@token_required` (any authenticated user)
- **POST /api/listings** - Requires `@admin_required` (admin only)
- **PUT/DELETE /api/listings/:id** - Requires `@admin_required` (admin only)

### Token Flow:
1. User logs in → Auth service returns token
2. Token stored in AsyncStorage (via tokenStorage service)
3. listingAPI interceptor automatically adds token to all requests:
   ```typescript
   listingAPI.interceptors.request.use(async(config) => {
     const token = await getToken();
     if (token) {
       config.headers.Authorization = `Token ${token}`;
     }
     return config;
   });
   ```

## Testing Steps

### 1. Verify CORS is Fixed
Refresh your browser - the CORS error should be gone.

### 2. Test Authenticated Access
```bash
# Login first
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123","password":"testpass123"}'

# Get token from response, then test listings
curl -X GET "http://localhost:5000/api/listings?limit=5&offset=0" \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 3. Test in App
1. **Refresh browser** (http://localhost:8081)
2. **Login** with testuser123 / testpass123
3. Navigate to **Explore** tab
4. Listings should load successfully!

## What Changed

### Before:
❌ CORS error - requests blocked  
❌ No flask-cors installed  
❌ No CORS headers in responses  

### After:
✅ CORS properly configured  
✅ flask-cors installed and configured  
✅ Requests from Expo web/mobile allowed  
✅ Authorization header passed through  
✅ Credentials supported for authenticated requests  

## Troubleshooting

### Still seeing "Token is missing!"?
- Make sure you're **logged in** first
- Check browser DevTools → Application → Storage → Local Storage for token
- Token should be stored with key like `@auth_token`

### Still seeing CORS errors?
1. Check container is running: `docker ps | grep list-service`
2. Check logs: `docker logs distairbnb-list-service-1`
3. Rebuild container: `docker-compose up -d --build list-service`

### Listings not loading?
1. Check if logged in (token exists)
2. Check Network tab in DevTools - look for 401 errors
3. Check listing service logs for authentication errors

## Next Steps

If you want to make listings **public** (no auth required):
1. Remove `@token_required` decorator from GET endpoints in `routes.py`
2. Keep `@admin_required` for create/update/delete operations
3. Rebuild container

Current setup is secure - only authenticated users can browse listings! 🔒

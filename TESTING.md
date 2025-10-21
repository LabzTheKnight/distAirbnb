# 🧪 Testing Guide - Local Docker Environment

## ✅ All Services Running

Your distributed Airbnb application is now running locally with Docker!

### Service Status

| Service | Status | Port | URL |
|---------|--------|------|-----|
| **Frontend** | ✅ Running | 80 | http://localhost |
| **Auth Service** | ✅ Running | 8001 | http://localhost:8001 |
| **Listing Service** | ✅ Running | 5000 | http://localhost:5000 |
| **MongoDB** | ✅ Running | 27017 | Internal |

### Database Status
- ✅ 5 sample listings added
- ✅ MongoDB connected and operational

---

## 🌐 Access Points

### Frontend (Main Application)
**URL:** http://localhost

This is your main web application built with Expo/React Native for web.

### API Endpoints

#### Auth Service API
**Base URL:** http://localhost:8001/api/auth/

Available endpoints:
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/update/` - Update profile
- `POST /api/auth/verify/` - Verify token

#### Listing Service API
**Base URL:** http://localhost:5000/api/

Available endpoints:
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing (auth required)
- `GET /api/listings/{id}` - Get specific listing
- `PUT /api/listings/{id}` - Update listing (auth required)
- `DELETE /api/listings/{id}` - Delete listing (auth required)
- `POST /api/listings/{id}/reviews` - Add review (auth required)
- `GET /api/listings/{id}/reviews` - Get reviews
- `DELETE /api/listings/{id}/reviews/{review_id}` - Delete review

---

## 🧪 Testing Instructions

### 1. Test the Frontend
1. Open http://localhost in your browser
2. You should see the main application interface
3. Navigate through different tabs/pages
4. Test the listing views

### 2. Test User Registration & Login

**Register a new user:**
```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePass123"
  }'
```

This will return a token. Save it for authenticated requests.

### 3. Test Listings

**Get all listings:**
```bash
curl http://localhost:5000/api/listings
```

**Get specific listing:**
```bash
curl http://localhost:5000/api/listings/10006546
```

**Create a new listing (requires auth token):**
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Test Listing",
    "location": "New York, NY",
    "price": 150.0,
    "imageUrl": "https://example.com/image.jpg",
    "description": "A nice place to stay"
  }'
```

### 4. Test Reviews

**Add a review (requires auth token):**
```bash
curl -X POST http://localhost:5000/api/listings/10006546/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -d '{
    "rating": 5,
    "comment": "Amazing place!"
  }'
```

**Get reviews:**
```bash
curl http://localhost:5000/api/listings/10006546/reviews
```

---

## 📊 Sample Data

### Pre-loaded Listings

1. **Ribeira Charming Duplex** (Porto, Portugal) - $80/night
2. **Horto flat with small garden** (Rio de Janeiro, Brazil) - $317/night
3. **Private Room in Bushwick** (Brooklyn, NY) - $60/night
4. **Apt Linda Vista Lagoa** (Rio de Janeiro, Brazil) - $200/night
5. **Cozy Brooklyn Studio** (Brooklyn, NY) - $125/night

---

## 🔍 Monitoring & Debugging

### View Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f frontend
docker-compose logs -f auth-service
docker-compose logs -f list-service
docker-compose logs -f mongo
```

### Check Service Status
```bash
docker-compose ps
```

### Run Health Check
```bash
./health-check.sh
```

### Restart a Service
```bash
docker-compose restart frontend
docker-compose restart auth-service
docker-compose restart list-service
```

---

## 🛑 Stopping Services

**Stop all services:**
```bash
docker-compose down
```

**Stop and remove data:**
```bash
docker-compose down -v
```

**Stop without removing containers:**
```bash
docker-compose stop
```

**Start stopped containers:**
```bash
docker-compose start
```

---

## 🧹 Cleanup & Reset

**Remove everything and start fresh:**
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove Docker images
docker-compose down --rmi all

# Rebuild and start
docker-compose build
docker-compose up -d

# Re-populate data
docker-compose exec list-service python populate_data.py
```

---

## ✅ What to Test

### Frontend Testing
- [ ] Homepage loads correctly
- [ ] Navigation between tabs works
- [ ] Listing cards display properly
- [ ] Images load correctly
- [ ] Search/filter functionality
- [ ] User registration form
- [ ] Login form
- [ ] User profile page
- [ ] Create listing form
- [ ] Edit listing functionality
- [ ] Favorites feature
- [ ] Responsive design

### API Testing
- [ ] User can register
- [ ] User can login
- [ ] User can view profile
- [ ] User can update profile
- [ ] Listings are displayed
- [ ] Single listing details work
- [ ] Authenticated user can create listing
- [ ] Authenticated user can update listing
- [ ] Authenticated user can delete listing
- [ ] Reviews can be added
- [ ] Reviews are displayed
- [ ] CORS works correctly

### Database Testing
- [ ] Data persists after restart
- [ ] MongoDB connection is stable
- [ ] Listings are stored correctly
- [ ] Users are stored correctly
- [ ] Reviews are linked properly

---

## 🚨 Common Issues

### Frontend doesn't load
- Check if port 80 is available
- Check frontend logs: `docker-compose logs frontend`
- Ensure all services are running: `docker-compose ps`

### API returns CORS errors
- CORS is configured for `localhost:8081` and `localhost:19006`
- Check browser console for actual origin
- Update CORS settings if needed

### Auth service returns 404
- Ensure you're using the correct endpoints with `/api/auth/`
- Check auth-service logs: `docker-compose logs auth-service`

### Listing service not responding
- Check if MongoDB is running: `docker-compose ps mongo`
- Check list-service logs: `docker-compose logs list-service`
- Verify database connection

### Database is empty
- Run populate script: `docker-compose exec list-service python populate_data.py`
- Check if data persists: `curl http://localhost:5000/api/listings`

---

## 📝 Notes

- **Development Mode**: All services run in development mode with hot-reload
- **Data Persistence**: MongoDB data is stored in a Docker volume (`distairbnb_mongo_data`)
- **Network**: All services communicate through Docker network `distairbnb_default`
- **Auto-Restart**: Services will automatically restart if they crash

---

## 🎯 Next Steps

Once local testing is complete:

1. ✅ Verify all features work
2. ✅ Test edge cases
3. ✅ Check error handling
4. ⬜ Prepare for production deployment
5. ⬜ Update environment variables for VPS
6. ⬜ Run `./deploy.sh` on your VPS

---

## 📞 Quick Reference

**Start everything:**
```bash
docker-compose up -d
```

**Check status:**
```bash
docker-compose ps
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop everything:**
```bash
docker-compose down
```

**Access frontend:**
Open http://localhost in your browser

**Health check:**
```bash
./health-check.sh
```

---

Happy Testing! 🚀

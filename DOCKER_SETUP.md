# Docker Setup Summary

## What Has Been Added

Your project is now fully containerized with Docker support for easy VPS deployment!

### New Files Created

1. **Dist_Airbnb/Dockerfile** - Builds the frontend as a static web application
2. **Dist_Airbnb/nginx.conf** - Nginx configuration for serving the frontend
3. **Dist_Airbnb/.dockerignore** - Excludes unnecessary files from Docker build
4. **docker-compose.prod.yml** - Production-ready Docker Compose configuration
5. **deploy.sh** - Automated deployment script
6. **VPS_DEPLOYMENT.md** - Comprehensive deployment guide
7. **QUICK_DEPLOY.md** - Quick reference guide
8. **.env.example** - Environment variable template

### Modified Files

1. **docker-compose.yml** - Added frontend service and restart policies
2. **Dist_Airbnb/services/api/apiClient.ts** - Now uses environment variables for API URLs

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    VPS Server                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  Frontend Container (Nginx)                 │  │
│  │  Port: 80                                   │  │
│  └─────────────────────────────────────────────┘  │
│                      │                             │
│         ┌────────────┴────────────┐                │
│         ▼                         ▼                │
│  ┌─────────────────┐      ┌──────────────────┐   │
│  │  Auth Service   │      │  Listing Service │   │
│  │  (Django)       │      │  (Flask)         │   │
│  │  Port: 8001     │      │  Port: 5000      │   │
│  └─────────────────┘      └──────────────────┘   │
│         │                         │                │
│         └────────────┬────────────┘                │
│                      ▼                             │
│              ┌───────────────┐                     │
│              │   MongoDB     │                     │
│              │  Port: 27017  │                     │
│              └───────────────┘                     │
└─────────────────────────────────────────────────────┘
```

### Build Process

The frontend Dockerfile uses a multi-stage build:

1. **Stage 1 (Builder)**:
   - Installs Node.js dependencies
   - Exports Expo project for web (static HTML/CSS/JS)
   - Creates optimized production build

2. **Stage 2 (Production)**:
   - Uses lightweight Nginx Alpine image
   - Copies built files from builder stage
   - Serves static files with Nginx

### Environment Variables

The application now uses environment variables for configuration:

- `EXPO_PUBLIC_AUTH_URL` - Auth service URL (accessible from browser)
- `EXPO_PUBLIC_LISTING_URL` - Listing service URL (accessible from browser)
- `AUTH_SERVICE_URL` - Auth service URL (internal Docker network)
- `MONGO_URI` - MongoDB connection string
- `DEBUG` - Django debug mode
- `ALLOWED_HOSTS` - Django allowed hosts

## Deployment Steps

### Quick Deployment (Recommended)

```bash
# On your VPS
git clone https://github.com/LabzTheKnight/distAirbnb.git
cd distAirbnb
./deploy.sh
```

### Manual Deployment

```bash
# 1. Edit configuration
nano docker-compose.prod.yml

# 2. Build images
docker-compose -f docker-compose.prod.yml build

# 3. Start services
docker-compose -f docker-compose.prod.yml up -d

# 4. Check status
docker-compose -f docker-compose.prod.yml ps
```

## Configuration Checklist

Before deploying to VPS, update these values:

- [ ] Replace `YOUR_VPS_IP` with your actual VPS IP address
- [ ] Replace `YOUR_DOMAIN` with your domain (if you have one)
- [ ] Set `DEBUG=False` for production
- [ ] Update `ALLOWED_HOSTS` to include your domain/IP
- [ ] Consider using HTTPS with SSL certificates
- [ ] Set up firewall rules
- [ ] Configure log rotation
- [ ] Set up automatic backups for MongoDB

## Accessing Your Application

After deployment:

- **Frontend**: http://YOUR_VPS_IP
- **Auth API**: http://YOUR_VPS_IP:8001/api/auth/
- **Listing API**: http://YOUR_VPS_IP:5000/api/

## Useful Commands

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f frontend

# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart frontend

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes database)
docker-compose -f docker-compose.prod.yml down -v

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Check resource usage
docker stats

# Execute command in container
docker-compose -f docker-compose.prod.yml exec frontend sh
docker-compose -f docker-compose.prod.yml exec auth-service bash
```

## Advantages of This Setup

1. **Easy Deployment**: Single command to deploy entire stack
2. **Consistent Environment**: Same Docker images work everywhere
3. **Isolated Services**: Each service runs in its own container
4. **Auto-Restart**: Services automatically restart on failure
5. **Easy Updates**: Pull new code and rebuild
6. **Port Management**: All ports are clearly defined
7. **Volume Persistence**: MongoDB data persists across restarts
8. **Scalability**: Easy to scale individual services

## Security Considerations

1. **Firewall**: Only expose necessary ports (80, 443, 22)
2. **SSL/TLS**: Use Let's Encrypt for HTTPS
3. **Reverse Proxy**: Use Nginx to proxy API requests
4. **MongoDB**: Don't expose port 27017 to the internet
5. **Secrets**: Use Docker secrets or environment files for sensitive data
6. **Updates**: Keep Docker images and system packages updated
7. **Monitoring**: Set up monitoring and alerting
8. **Backups**: Regularly backup MongoDB data

## Troubleshooting

### Frontend not loading
- Check if container is running: `docker-compose ps`
- Check logs: `docker-compose logs frontend`
- Verify port 80 is not in use: `sudo netstat -tulpn | grep :80`

### API connection errors
- Verify API URLs in browser console
- Check if services are running: `docker-compose ps`
- Verify environment variables are set correctly
- Check CORS configuration in backend services

### MongoDB connection issues
- Verify MongoDB is running: `docker-compose ps mongo`
- Check MongoDB logs: `docker-compose logs mongo`
- Verify connection string is correct

### Build failures
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`
- Check disk space: `df -h`

## Next Steps

1. Set up domain name and DNS
2. Configure SSL certificates with Let's Encrypt
3. Set up Nginx reverse proxy for cleaner URLs
4. Configure automated backups
5. Set up monitoring (e.g., Prometheus + Grafana)
6. Implement CI/CD pipeline for automatic deployments
7. Set up log aggregation (e.g., ELK stack)

## Support

For detailed information, refer to:
- [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md) - Complete deployment guide
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick reference
- [CORS_FIX.md](./CORS_FIX.md) - CORS configuration

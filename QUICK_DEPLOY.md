# Quick Deployment Guide

## Local Development

To run locally with Docker:

```bash
docker-compose up -d
```

Access the application at:
- Frontend: http://localhost
- Auth API: http://localhost:8001/api/auth/
- Listing API: http://localhost:5000/api/

## VPS Deployment

### Option 1: Using the Deployment Script (Easiest)

```bash
./deploy.sh
```

The script will:
1. Check for Docker installation
2. Ask for your VPS IP/domain
3. Build all Docker images
4. Start all services automatically

### Option 2: Manual Deployment

1. Edit `docker-compose.prod.yml` with your VPS details
2. Build and start:

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Transferring to VPS

### Method 1: Using Git (Recommended)

On your VPS:
```bash
git clone https://github.com/LabzTheKnight/distAirbnb.git
cd distAirbnb
./deploy.sh
```

### Method 2: Using SCP

From your local machine:
```bash
scp -r distAirbnb user@YOUR_VPS_IP:/home/user/
```

Then SSH into your VPS:
```bash
ssh user@YOUR_VPS_IP
cd distAirbnb
./deploy.sh
```

## Important Configuration

Before deploying, make sure to:

1. **Update API URLs** in `docker-compose.prod.yml`:
   - Replace `YOUR_VPS_IP` with your actual VPS IP
   - Replace `YOUR_DOMAIN` with your domain if you have one

2. **Security Settings**:
   - Set `DEBUG=False` for production
   - Update `ALLOWED_HOSTS` in auth service
   - Consider setting up SSL certificates

## Managing Services

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart specific service
docker-compose -f docker-compose.prod.yml restart frontend

# Update and redeploy
git pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Ports Used

- **80**: Frontend (Web UI)
- **8001**: Auth Service API
- **5000**: Listing Service API
- **27017**: MongoDB (internal only in production)

## Next Steps

For detailed instructions, security configurations, and troubleshooting, see:
- [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md) - Complete deployment guide
- [CORS_FIX.md](./CORS_FIX.md) - API CORS configuration

## Troubleshooting

If services fail to start:

1. Check logs: `docker-compose logs -f [service-name]`
2. Verify ports are not in use: `sudo netstat -tulpn | grep -E '80|8001|5000'`
3. Rebuild images: `docker-compose build --no-cache`
4. Check disk space: `df -h`

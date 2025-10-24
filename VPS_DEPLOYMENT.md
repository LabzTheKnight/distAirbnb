# VPS Deployment Guide

This guide will help you deploy the distributed Airbnb application on your VPS server using Docker.

## Prerequisites

- VPS server with Docker and Docker Compose installed
- SSH access to your VPS
- Domain name (optional but recommended)

## Step 1: Install Docker on VPS

If Docker is not already installed, run these commands on your VPS:

```bash
# Update package index
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and log back in for the group change to take effect
```

## Step 2: Transfer Project to VPS

From your local machine, transfer the project to your VPS:

```bash
# Option 1: Using rsync
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'venv_auth' \
  /home/aaafo/portfolio_projects/distAirbnb/ user@YOUR_VPS_IP:/home/user/distAirbnb/

# Option 2: Using Git (recommended)
# On VPS:
git clone https://github.com/LabzTheKnight/distAirbnb.git
cd distAirbnb
```

## Step 3: Configure Environment Variables

On your VPS, edit the production docker-compose file:

```bash
cd distAirbnb
nano docker-compose.prod.yml
```

Replace the following placeholders:
- `YOUR_VPS_IP` - Your VPS IP address (e.g., 192.168.1.100)
- `YOUR_DOMAIN` - Your domain name if you have one (e.g., myapp.com)

Example configuration:
```yaml
environment:
  - EXPO_PUBLIC_AUTH_URL=http://192.168.1.100:8001/api/auth
  - EXPO_PUBLIC_LISTING_URL=http://192.168.1.100:5000/api
```

## Step 4: Build and Deploy

Run these commands on your VPS:

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 5: Verify Deployment

1. **Frontend**: Open `http://YOUR_VPS_IP` in your browser
2. **Auth Service**: Check `http://YOUR_VPS_IP:8001/api/auth/`
3. **Listing Service**: Check `http://YOUR_VPS_IP:5000/api/`

## Step 6: Populate Initial Data

```bash
# Enter the listing service container
docker-compose -f docker-compose.prod.yml exec list-service bash

# Run the population script
python populate_data.py

# Exit the container
exit
```

## Port Configuration

The following ports are exposed:
- **80**: Frontend (Web interface)
- **8001**: Authentication Service API
- **5000**: Listing Service API
- **27017**: MongoDB (consider closing this in production)

## Security Recommendations

### 1. Set up a Firewall

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow API ports (or use reverse proxy instead)
sudo ufw allow 8001/tcp
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable
```

### 2. Use Nginx Reverse Proxy (Recommended)

Instead of exposing ports 8001 and 5000 directly, use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
    }

    # Auth API
    location /api/auth {
        proxy_pass http://localhost:8001;
    }

    # Listing API
    location /api/listings {
        proxy_pass http://localhost:5000;
    }
}
```

### 3. Set up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. Secure MongoDB

Edit `docker-compose.prod.yml` and remove MongoDB port exposure (27017:27017) so it's only accessible internally.

## Updating the Application

To update your application:

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### View logs for a specific service

```bash
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f auth-service
docker-compose -f docker-compose.prod.yml logs -f list-service
```

### Restart a specific service

```bash
docker-compose -f docker-compose.prod.yml restart frontend
```

### Check service health

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Clean up and rebuild

```bash
docker-compose -f docker-compose.prod.yml down -v
docker system prune -a
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

### Check resource usage

```bash
docker stats
```

### Set up log rotation

Create `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Then restart Docker:

```bash
sudo systemctl restart docker
```

## Backup

### Backup MongoDB data

```bash
docker-compose -f docker-compose.prod.yml exec mongo mongodump --out /data/backup
docker cp $(docker-compose -f docker-compose.prod.yml ps -q mongo):/data/backup ./mongo-backup
```

### Restore MongoDB data

```bash
docker cp ./mongo-backup $(docker-compose -f docker-compose.prod.yml ps -q mongo):/data/backup
docker-compose -f docker-compose.prod.yml exec mongo mongorestore /data/backup
```

## Notes

- The frontend is built as a static web application using Expo's web export
- All services are configured with `restart: unless-stopped` for automatic recovery
- Development volumes are removed in production for better security
- Consider using Docker secrets for sensitive data in production

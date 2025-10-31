#!/bin/bash

# VPS Deployment Script
# This script helps deploy the Airbnb application to a VPS server

set -e

echo "==================================="
echo "Airbnb VPS Deployment Script"
echo "==================================="

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Detect docker compose command (support both v1 binary and v2 plugin)
COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
else
  echo "Error: Docker Compose is not installed. Install the 'docker-compose' binary or the Docker Compose v2 plugin."
  exit 1
fi

# If VPS_HOST is already set (for non-interactive runs / GitHub Actions), use it.
# Otherwise fall back to prompting the user.
if [ -z "$VPS_HOST" ]; then
  # allow a pre-existing .env on the VPS to set VPS_HOST and other values
  if [ -f /srv/distairbnb/.env ]; then
    echo "Sourcing /srv/distairbnb/.env"
    set -o allexport
    # shellcheck disable=SC1091
    source /srv/distairbnb/.env
    set +o allexport
  fi

  if [ -z "$VPS_HOST" ]; then
    read -p "Enter your VPS IP address or domain: " VPS_HOST
  fi

  if [ -z "$VPS_HOST" ]; then
    echo "Error: VPS host cannot be empty"
    exit 1
  fi
fi

echo ""
echo "Creating production configuration..."

# Create a temporary production docker-compose file
cat > docker-compose.prod.tmp.yml <<EOF
version: '3.8'

services:
  frontend:
    build: ./Dist_Airbnb
    ports:
      # map container port 80 -> host 8080 so host NGINX can continue to listen on port 80
      - "8080:80"
    environment:
      # For browser clients, use same-origin relative paths; NGINX on the host will proxy these
      - EXPO_PUBLIC_AUTH_URL=/api/auth
      - EXPO_PUBLIC_LISTING_URL=/api/listings
    depends_on:
      - auth-service
      - list-service
    restart: unless-stopped

  auth-service:
    build: ./auth_service
    ports:
      - "8001:8001"
    environment:
      - DEBUG=False
      - ALLOWED_HOSTS=${VPS_HOST},localhost
    restart: unless-stopped

  list-service:
    build: ./list_service
    ports:
      - "5000:5000"
    environment:
      - AUTH_SERVICE_URL=http://auth-service:8001/api/auth
      - MONGO_URI=${MONGO_URI:-mongodb://mongo:27017/airbnb}
    depends_on:
      - auth-service
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
EOF

echo "Configuration created successfully!"
echo ""
echo "Building Docker images... (this may take several minutes)"
${COMPOSE_CMD} -f docker-compose.prod.tmp.yml build

echo ""
echo "Starting services..."
${COMPOSE_CMD} -f docker-compose.prod.tmp.yml up -d

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "Checking service status..."
${COMPOSE_CMD} -f docker-compose.prod.tmp.yml ps

echo ""
echo "==================================="
echo "Deployment Complete!"
echo "==================================="
echo ""
echo "Your application is now running at:"
echo "  Frontend:    http://${VPS_HOST}"
echo "  Auth API:    http://${VPS_HOST}:8001/api/auth/"
echo "  Listing API: http://${VPS_HOST}:5000/api/"
echo ""
echo "To view logs, run:"
echo "  ${COMPOSE_CMD} -f docker-compose.prod.tmp.yml logs -f"
echo ""
echo "To stop services, run:"
echo "  ${COMPOSE_CMD} -f docker-compose.prod.tmp.yml down"
echo ""

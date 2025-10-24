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

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Prompt for VPS IP or domain
read -p "Enter your VPS IP address or domain: " VPS_HOST

if [ -z "$VPS_HOST" ]; then
    echo "Error: VPS host cannot be empty"
    exit 1
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
      - "80:80"
    environment:
      - EXPO_PUBLIC_AUTH_URL=http://${VPS_HOST}:8001/api/auth
      - EXPO_PUBLIC_LISTING_URL=http://${VPS_HOST}:5000/api
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
      - MONGO_URI=mongodb://mongo:27017/airbnb
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
docker-compose -f docker-compose.prod.tmp.yml build

echo ""
echo "Starting services..."
docker-compose -f docker-compose.prod.tmp.yml up -d

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "Checking service status..."
docker-compose -f docker-compose.prod.tmp.yml ps

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
echo "  docker-compose -f docker-compose.prod.tmp.yml logs -f"
echo ""
echo "To stop services, run:"
echo "  docker-compose -f docker-compose.prod.tmp.yml down"
echo ""

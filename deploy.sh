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
echo "Using committed docker-compose.prod.yml for production configuration."
echo "Ensure /srv/distairbnb/.env contains the production variables you want (VPS_HOST, EXPO_PUBLIC_*, MONGO_URI, etc.)."

# Verify compose file exists
if [ ! -f docker-compose.prod.yml ]; then
  echo "Error: docker-compose.prod.yml not found in repository. Please add it and re-run."
  exit 1
fi

# If ALLOWED_HOSTS isn't provided explicitly, set it from VPS_HOST so Django accepts requests
if [ -z "$ALLOWED_HOSTS" ]; then
  ALLOWED_HOSTS="${VPS_HOST},localhost"
  export ALLOWED_HOSTS
fi

echo ""
echo "Building Docker images... (this may take several minutes)"
${COMPOSE_CMD} -f docker-compose.prod.yml build

echo ""
echo "Starting services..."
${COMPOSE_CMD} -f docker-compose.prod.yml up -d

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "Checking service status..."
${COMPOSE_CMD} -f docker-compose.prod.yml ps

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
echo "  ${COMPOSE_CMD} -f docker-compose.prod.yml logs -f"
echo ""
echo "To stop services, run:"
echo "  ${COMPOSE_CMD} -f docker-compose.prod.yml down"
echo ""

#!/bin/bash

# Health Check Script
# This script checks if all services are running correctly

echo "=================================="
echo "Service Health Check"
echo "=================================="
echo ""

# Get the host from argument or use localhost
HOST=${1:-localhost}

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Checking $name... "
    
    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Check Docker containers
echo "Docker Container Status:"
echo "------------------------"
docker-compose ps
echo ""

# Check services
echo "Service Endpoints:"
echo "------------------"
check_service "Frontend      " "http://$HOST"
check_service "Auth API      " "http://$HOST:8001/api/auth/"
check_service "Listing API   " "http://$HOST:5000/api/"
echo ""

# Check MongoDB
echo -n "Checking MongoDB... "
if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

echo ""
echo "=================================="
echo "Health Check Complete"
echo "=================================="
echo ""
echo "To view logs for a service:"
echo "  docker-compose logs -f [service-name]"
echo ""

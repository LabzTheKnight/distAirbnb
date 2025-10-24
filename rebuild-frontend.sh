#!/bin/bash

# Hydration Fix Rebuild Script
# This script rebuilds the frontend with all hydration fixes applied

echo "🔧 Rebuilding Frontend with Hydration Fixes..."
echo "=============================================="
echo ""

# Stop and remove existing containers
echo "📦 Stopping existing containers..."
docker-compose down frontend

# Remove old images to force rebuild
echo "🗑️  Removing old frontend image..."
docker rmi distairbnb-frontend 2>/dev/null || true

# Rebuild the frontend with no cache
echo "🏗️  Building frontend (this may take a few minutes)..."
docker-compose build --no-cache frontend

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "🚀 Starting frontend container..."
    docker-compose up -d frontend
    
    echo ""
    echo "=============================================="
    echo "✅ Frontend is running on http://localhost:8080"
    echo ""
    echo "📝 Changes applied:"
    echo "   - Added hydration guards to AuthContext"
    echo "   - Added hydration guards to ListingContext"
    echo "   - Added hydration guards to listing detail page"
    echo "   - Added browser checks to tokenStorage"
    echo "   - Fixed Platform.select() usage"
    echo "   - Simplified HelloWave component"
    echo "   - Removed volume mount that was overwriting build"
    echo ""
    echo "🔍 Check the browser console - the React #418 error should be gone!"
    echo ""
    echo "📊 To view logs:"
    echo "   docker-compose logs -f frontend"
else
    echo ""
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi

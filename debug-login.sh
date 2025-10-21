#!/bin/bash

echo "🔍 Diagnosing Login Page Issue..."
echo ""

echo "1️⃣ Checking if services are running..."
docker-compose ps | grep -E "frontend|auth-service"

echo ""
echo "2️⃣ Testing frontend accessibility..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/

echo ""
echo "3️⃣ Testing login page..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost/login

echo ""
echo "4️⃣ Checking if JavaScript bundle exists..."
curl -s http://localhost/login | grep -o "entry.*js"

echo ""
echo "5️⃣ Testing auth API..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:8001/api/auth/register/

echo ""
echo "6️⃣ Checking for JavaScript errors in page..."
echo "Login page size:"
curl -s http://localhost/login | wc -c

echo ""
echo "✅ Diagnosis complete!"
echo ""
echo "📋 Results:"
echo "  - If HTTP Status is 200: Page is being served correctly"
echo "  - If JavaScript bundle found: JS should load"
echo "  - If page size > 20000: Page has content"
echo ""
echo "🌐 Try these steps:"
echo "  1. Open http://localhost/ in your browser"
echo "  2. Press F12 to open Developer Tools"
echo "  3. Check Console tab for any red errors"
echo "  4. Navigate to login from the homepage"
echo ""
echo "Or try opening in incognito mode: Ctrl+Shift+N"

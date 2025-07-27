#!/bin/bash

# Test script for Django Authentication Service
echo "Testing Django Authentication Service..."
echo "======================================="

BASE_URL="http://127.0.0.1:8001/api/auth"

echo "1. Testing user registration..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }' \
  $BASE_URL/register/ | python -m json.tool

echo -e "\n\n2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }' \
  $BASE_URL/login/)

echo $LOGIN_RESPONSE | python -m json.tool

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
  echo -e "\n\n3. Testing user profile (authenticated)..."
  curl -X GET \
    -H "Authorization: Token $TOKEN" \
    $BASE_URL/profile/ | python -m json.tool

  echo -e "\n\n4. Testing token verification..."
  curl -X POST \
    -H "Authorization: Token $TOKEN" \
    $BASE_URL/verify/ | python -m json.tool
else
  echo "Failed to get token, skipping authenticated tests"
fi

echo -e "\n\nTest completed!"

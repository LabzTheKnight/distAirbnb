#!/bin/bash

# Integration test for auth and list services communication
echo "Testing Auth + List Services Integration..."
echo "=========================================="

AUTH_URL="http://localhost:8001/api/auth"
LIST_URL="http://localhost:5000/api"

# Step 1: Register a new user
echo "1. Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }' \
  $AUTH_URL/register/)

echo "Register Response:"
echo $REGISTER_RESPONSE | python3 -m json.tool 2>/dev/null || echo $REGISTER_RESPONSE

# Step 2: Extract token from registration
TOKEN=$(echo $REGISTER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token from registration"
  exit 1
fi

echo -e "\n2. Token obtained: ${TOKEN:0:20}..."

# Step 3: Test list service endpoints with auth token
echo -e "\n3. Testing list service with authentication..."

# Test creating a listing (requires auth)
echo -e "\n3a. Creating a listing..."
CREATE_LISTING_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Token $TOKEN" \
  -d '{
    "title": "Test Listing",
    "description": "A test listing",
    "price": 100,
    "location": "Test City",
    "property_type": "apartment"
  }' \
  $LIST_URL/listings/)

echo "Create Listing Response:"
echo $CREATE_LISTING_RESPONSE | python3 -m json.tool 2>/dev/null || echo $CREATE_LISTING_RESPONSE

# Test getting listings (may or may not require auth)
echo -e "\n3b. Getting all listings..."
GET_LISTINGS_RESPONSE=$(curl -s -X GET \
  -H "Authorization: Token $TOKEN" \
  $LIST_URL/listings/)

echo "Get Listings Response:"
echo $GET_LISTINGS_RESPONSE | python3 -m json.tool 2>/dev/null || echo $GET_LISTINGS_RESPONSE

# Step 4: Test without authentication
echo -e "\n4. Testing list service WITHOUT authentication..."
NO_AUTH_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Listing",
    "description": "This should fail",
    "price": 50
  }' \
  $LIST_URL/listings/)

echo "No Auth Response:"
echo $NO_AUTH_RESPONSE | python3 -m json.tool 2>/dev/null || echo $NO_AUTH_RESPONSE

echo -e "\n✅ Integration test completed!"
echo "Check the responses above to verify:"
echo "- Registration worked (got token)"
echo "- List service accepts valid tokens"  
echo "- List service rejects requests without tokens"
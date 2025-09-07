#!/bin/bash

# Test script for Zod validation in Todo API
# Make sure the server is running on localhost:3000

echo "🧪 Testing Zod Validation Implementation"
echo "========================================"

BASE_URL="http://localhost:3000/api/todos"

echo -e "\n✅ Test 1: Valid todo creation"
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Zod", "description": "Study Zod validation library"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n❌ Test 2: Missing title (should fail)"
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"description": "No title provided"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n❌ Test 3: Empty title (should fail)"
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"title": "", "description": "Empty title"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n❌ Test 4: Whitespace-only title (should fail)"
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"title": "   ", "description": "Whitespace title"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n❌ Test 5: Title too long (should fail)"
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"title": "This is an extremely long title that definitely exceeds the maximum allowed length of 200 characters and should trigger a validation error because it is way too long to be a reasonable title for a todo item in any application", "description": "Long title test"}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n❌ Test 6: Invalid UUID in GET request (should fail)"
curl -X GET "$BASE_URL/invalid-uuid" \
  -w "\nStatus: %{http_code}\n"

echo -e "\n❌ Test 7: Empty update body (should fail)"
curl -X PUT "$BASE_URL/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n✅ Test 8: Valid update"
curl -X PUT "$BASE_URL/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n🎉 Validation testing complete!"

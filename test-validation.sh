#!/bin/bash

# Test script for Zod validation in Todo API
# Make sure the server is running on localhost:3000

echo "🧪 Testing Zod Validation Implementation"
echo "========================================"

BASE_URL="http://localhost:3000/api/todos"

# Helper function to extract ID from JSON response without jq
extract_id() {
    local response="$1"
    # Try multiple patterns to extract the ID
    local id=$(echo "$response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    if [ -z "$id" ]; then
        # Alternative pattern
        id=$(echo "$response" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
    fi
    echo "$id"
}

# Helper function to check if jq is available and use it, otherwise fallback
parse_json_id() {
    local response="$1"
    if command -v jq >/dev/null 2>&1; then
        echo "$response" | jq -r '.data.id // empty' 2>/dev/null || extract_id "$response"
    else
        extract_id "$response"
    fi
}

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

echo -e "\n🧪 INVALID_TODO_STATE Business Logic Tests"
echo "==========================================="

# First, create a todo that we can test business logic with
echo -e "\n📝 Setting up test todo for business logic tests"
TEST_TODO_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"title": "Business Logic Test Todo", "description": "For testing state transitions"}')

# Extract ID using helper function
TEST_TODO_ID=$(parse_json_id "$TEST_TODO_RESPONSE")

if [ -n "$TEST_TODO_ID" ] && [ "$TEST_TODO_ID" != "null" ] && [ "$TEST_TODO_ID" != "empty" ]; then
    echo "✅ Created test todo with ID: $TEST_TODO_ID"
    
    # First, mark the todo as completed
    echo -e "\n📋 Marking todo as completed for business logic tests"
    curl -s -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"completed": true}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n❌ Test 9: Cannot mark completed todo as incomplete (INVALID_TODO_STATE)"
    curl -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"completed": false}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n❌ Test 10: Cannot update title of completed todo (INVALID_TODO_STATE)"
    curl -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"title": "Updated title for completed todo"}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n❌ Test 11: Cannot update description of completed todo (INVALID_TODO_STATE)"
    curl -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"description": "Updated description for completed todo"}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n❌ Test 12: Cannot update both title and description of completed todo (INVALID_TODO_STATE)"
    curl -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"title": "New title", "description": "New description"}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n❌ Test 13: Cannot update title and mark as incomplete simultaneously (INVALID_TODO_STATE)"
    curl -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"title": "New title", "completed": false}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n✅ Test 14: Can keep completed todo as completed (should succeed)"
    curl -X PUT "$BASE_URL/$TEST_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"completed": true}' \
      -w "\nStatus: %{http_code}\n"
    
else
    echo "❌ Failed to create test todo for business logic tests"
fi

# Test business logic with incomplete todo
echo -e "\n📝 Testing business logic with incomplete todo"
INCOMPLETE_TODO_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"title": "Incomplete Todo Test", "description": "Testing incomplete todo updates"}')

# Extract ID using helper function
INCOMPLETE_TODO_ID=$(parse_json_id "$INCOMPLETE_TODO_RESPONSE")

if [ -n "$INCOMPLETE_TODO_ID" ] && [ "$INCOMPLETE_TODO_ID" != "null" ] && [ "$INCOMPLETE_TODO_ID" != "empty" ]; then
    echo "✅ Created incomplete test todo with ID: $INCOMPLETE_TODO_ID"
    
    echo -e "\n✅ Test 15: Can update title of incomplete todo"
    curl -X PUT "$BASE_URL/$INCOMPLETE_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"title": "Updated incomplete todo title"}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n✅ Test 16: Can update description of incomplete todo"
    curl -X PUT "$BASE_URL/$INCOMPLETE_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"description": "Updated incomplete todo description"}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n✅ Test 17: Can mark incomplete todo as completed"
    curl -X PUT "$BASE_URL/$INCOMPLETE_TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{"completed": true}' \
      -w "\nStatus: %{http_code}\n"
    
    echo -e "\n✅ Test 18: Can update title and mark as completed simultaneously"
    # Create another incomplete todo for this test
    ANOTHER_TODO_RESPONSE=$(curl -s -X POST "$BASE_URL" \
      -H "Content-Type: application/json" \
      -d '{"title": "Another Test Todo", "description": "For simultaneous update test"}')
    
    # Extract ID using helper function
    ANOTHER_TODO_ID=$(parse_json_id "$ANOTHER_TODO_RESPONSE")
    
    if [ -n "$ANOTHER_TODO_ID" ] && [ "$ANOTHER_TODO_ID" != "null" ] && [ "$ANOTHER_TODO_ID" != "empty" ]; then
        curl -X PUT "$BASE_URL/$ANOTHER_TODO_ID" \
          -H "Content-Type: application/json" \
          -d '{"title": "Updated and completed", "completed": true}' \
          -w "\nStatus: %{http_code}\n"
    fi
else
    echo "❌ Failed to create incomplete test todo for business logic tests"
fi

# Test edge cases for business logic
echo -e "\n🔍 Edge cases for INVALID_TODO_STATE"

echo -e "\n❌ Test 19: Attempt to update non-existent todo (TODO_NOT_FOUND)"
curl -X PUT "$BASE_URL/00000000-0000-0000-0000-000000000000" \
  -H "Content-Type: application/json" \
  -d '{"completed": false}' \
  -w "\nStatus: %{http_code}\n"

# Test with invalid UUID format (should fail validation before business logic)
echo -e "\n❌ Test 20: Invalid UUID format in update (VALIDATION_ERROR)"
curl -X PUT "$BASE_URL/invalid-uuid-format" \
  -H "Content-Type: application/json" \
  -d '{"completed": false}' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n🎉 INVALID_TODO_STATE business logic testing complete!"

#!/bin/bash

echo "Testing Todo List API Health Check..."
echo "========================================="

# Wait a moment for server to start
sleep 2

# Test the health endpoint
echo "Testing http://localhost:3000/health..."
response=$(curl -s -w "%{http_code}" http://localhost:3000/health)
http_code="${response: -3}"
body="${response%???}"

echo "HTTP Status Code: $http_code"
echo "Response Body: $body"

if [ "$http_code" = "200" ]; then
    echo "✅ Health check endpoint is working!"
else
    echo "❌ Health check endpoint failed with status $http_code"
fi

echo ""
echo "Testing other endpoints..."

# Test the versioned API health endpoint
echo "Testing http://localhost:3000/api/v1/health..."
response2=$(curl -s -w "%{http_code}" http://localhost:3000/api/v1/health)
http_code2="${response2: -3}"
body2="${response2%???}"

echo "HTTP Status Code: $http_code2"
echo "Response Body: $body2"

# Test a non-existent endpoint to verify 404 handling
echo "Testing http://localhost:3000/nonexistent..."
response3=$(curl -s -w "%{http_code}" http://localhost:3000/nonexistent)
http_code3="${response3: -3}"
body3="${response3%???}"

echo "HTTP Status Code: $http_code3"
echo "Response Body: $body3"

echo ""
echo "Test completed!"

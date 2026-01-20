#!/bin/bash

# Script untuk test callback endpoint
# Usage: ./test-callback.sh

echo "🧪 Testing Callback Endpoint"
echo "============================"
echo ""

# Test Success Callback
echo "1. Testing Success Callback..."
curl -X POST https://apps-import-data.vercel.app/api/import-callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "message": "Data sudah masuk dan update ke database",
    "recordCount": 100,
    "platform": "Lazada",
    "brand": "Brighty",
    "branch": "Brighty Official Store",
    "dataType": "order",
    "timestamp": "2025-01-18 12:00:00.000"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# Test Error Callback
echo "2. Testing Error Callback..."
curl -X POST https://apps-import-data.vercel.app/api/import-callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "error",
    "message": "Gagal memproses data: Database connection failed",
    "recordCount": 0,
    "platform": "Lazada",
    "brand": "Brighty",
    "branch": "Brighty Official Store",
    "dataType": "order",
    "timestamp": "2025-01-18 12:00:00.000"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "✅ Test completed!"

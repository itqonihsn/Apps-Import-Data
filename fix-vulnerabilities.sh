#!/bin/bash

# Script untuk fix npm vulnerabilities
echo "🔒 Fixing npm vulnerabilities..."

# Fix vulnerabilities
npm audit fix

if [ $? -eq 0 ]; then
    echo "✅ Vulnerabilities fixed!"
    echo ""
    echo "Checking remaining vulnerabilities..."
    npm audit
else
    echo "⚠️ Some vulnerabilities may require manual fixing"
    echo "Run 'npm audit' for details"
fi

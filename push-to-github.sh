#!/bin/bash

# Script untuk push ke GitHub dan trigger Vercel redeploy
# Usage: ./push-to-github.sh

echo "🚀 Pushing changes to GitHub..."

# Push ke GitHub
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "📦 Vercel will automatically redeploy in a few moments..."
    echo ""
    echo "You can check deployment status at:"
    echo "https://vercel.com/dashboard"
else
    echo "❌ Failed to push. Please check your GitHub credentials."
    echo ""
    echo "If you need to setup credentials:"
    echo "1. Generate a Personal Access Token at: https://github.com/settings/tokens"
    echo "2. Use the token as password when prompted"
    exit 1
fi

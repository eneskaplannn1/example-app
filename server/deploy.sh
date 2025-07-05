#!/bin/bash

# Plant Care Notification Server Deployment Script

echo "🚀 Deploying Plant Care Notification Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your configuration."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Test the build
echo "🧪 Testing build..."
node dist/cronJob.js

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your cron job scheduler (e.g., GitHub Actions, AWS EventBridge, etc.)"
echo "2. Configure the cron job to run every 5 minutes:"
echo "   */5 * * * * cd /path/to/server && node dist/cronJob.js"
echo "3. Monitor the logs to ensure notifications are being sent"
echo ""
echo "🔧 For testing, you can run: npm run dev" 
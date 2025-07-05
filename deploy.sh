#!/bin/bash

# BCI Ritual Game Production Deployment Script

echo "🚀 Starting BCI Ritual Game deployment..."

# Navigate to app directory
cd /home/ubuntu/bci-ritual-game/app

# Clean environment variables that cause issues
unset NEXT_DIST_DIR
unset __NEXT_TEST_MODE

echo "📦 Installing dependencies..."
npm ci

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "🔨 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Kill any existing server process
    pkill -f "next start" || true
    
    echo "🌐 Starting production server..."
    NODE_ENV=production npm start &
    SERVER_PID=$!
    
    echo "⏳ Waiting for server to start..."
    sleep 5
    
    # Test if server is running
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Production server is running successfully at http://localhost:3000"
        echo "🎮 BCI Ritual Game is ready for use!"
        echo "📝 Server PID: $SERVER_PID"
        echo ""
        echo "🔗 Access your app at: http://localhost:3000"
        echo "📊 Monitor logs with: tail -f server.log"
        echo "🛑 Stop server with: kill $SERVER_PID"
    else
        echo "❌ Server failed to start properly"
        echo "📋 Check logs for details:"
        tail -20 server.log 2>/dev/null || echo "No server logs found"
        exit 1
    fi
else
    echo "❌ Build failed!"
    echo "📋 Check build logs for details"
    exit 1
fi

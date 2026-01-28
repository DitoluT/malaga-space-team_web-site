#!/bin/bash

# Deploy script for Malaga Space Team Inventory & Website

echo "🚀 Starting deployment..."

# Stop existing containers
echo "🛑 Stopping containers..."
docker-compose down

# Build and start
echo "🏗️ Building and starting services..."
docker-compose up --build -d

echo "✅ Deployment complete!"
echo "🌍 Frontend available at http://localhost"
echo "🔌 Backend available at http://localhost:3001"
echo "📊 Database mounted in ./data"

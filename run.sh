#!/bin/bash

# The Court of Oaths - Docker Runner Script

set -e

echo "🏰 The Court of Oaths"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Download: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose not found. Using 'docker compose' instead."
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo "🔨 Building Docker image..."
$COMPOSE_CMD build

echo ""
echo "✅ Build complete!"
echo ""
echo "🚀 Starting The Court of Oaths..."
echo ""

$COMPOSE_CMD up

echo ""
echo "The game is running! Open your browser and go to:"
echo "👉 http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server."

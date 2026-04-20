#!/bin/bash

# The Court of Oaths - Local Development Server
# Uses Python's built-in HTTP server (no dependencies needed)

echo "🏰 The Court of Oaths - Local Development Server"
echo "=================================================="
echo ""

# Check Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed."
    echo "   On macOS: brew install python3"
    echo "   On Windows: https://www.python.org/downloads/"
    exit 1
fi

echo "📂 Starting local web server..."
echo ""
echo "The game will be available at:"
echo "👉 http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Change to script directory and start server
cd "$(dirname "$0")"
python3 -m http.server 8000 --bind 127.0.0.1

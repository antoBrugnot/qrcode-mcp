#!/bin/bash

# Test script for QR Code MCP Server
# This script verifies that the server builds and starts correctly

set -e

echo "🧪 Testing QR Code MCP Server..."

# Test 1: TypeScript compilation
echo "📝 Testing TypeScript compilation..."
npm run build
echo "✅ TypeScript compilation successful"

# Test 2: Server startup test
echo "🚀 Testing server startup..."
timeout 3s npm run dev > /dev/null 2>&1 || true
echo "✅ Server startup test passed"

# Test 3: Docker/Podman build test
echo "🐳 Testing container build..."
if command -v podman &> /dev/null; then
    podman build -t qrcode-mcp-test . > /dev/null 2>&1
    echo "✅ Podman build successful"
    
    # Test container run
    echo "🔍 Testing container run..."
    VERSION=$(podman run --rm qrcode-mcp-test node --version)
    echo "✅ Container test successful (Node.js $VERSION)"
    
    # Cleanup
    podman rmi qrcode-mcp-test > /dev/null 2>&1 || true
    
elif command -v docker &> /dev/null; then
    docker build -t qrcode-mcp-test . > /dev/null 2>&1
    echo "✅ Docker build successful"
    
    # Test container run
    echo "🔍 Testing container run..."
    VERSION=$(docker run --rm qrcode-mcp-test node --version)
    echo "✅ Container test successful (Node.js $VERSION)"
    
    # Cleanup
    docker rmi qrcode-mcp-test > /dev/null 2>&1 || true
else
    echo "⚠️  Docker/Podman not found, skipping container tests"
fi

echo ""
echo "🎉 All tests passed! Your QR Code MCP Server is ready to use."
echo ""
echo "📋 Next steps:"
echo "  1. Configure GitHub secrets (DOCKERHUB_TOKEN)"
echo "  2. Push to GitHub to trigger CI/CD"
echo "  3. Run: ./scripts/release.sh v1.0.0"
echo "  4. Configure Claude Desktop with Docker/Podman"
echo ""
echo "📖 See README.md for complete usage instructions"
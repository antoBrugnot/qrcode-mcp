#!/bin/bash

# QR Code MCP Server Release Script
# Usage: ./scripts/release.sh [version]
# Example: ./scripts/release.sh v1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if version is provided
if [ -z "$1" ]; then
    log_error "Version argument is required!"
    echo "Usage: $0 <version>"
    echo "Example: $0 v1.0.0"
    exit 1
fi

VERSION="$1"

# Validate version format
if [[ ! $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_error "Invalid version format: $VERSION"
    echo "Expected format: vX.Y.Z (e.g., v1.0.0)"
    exit 1
fi

log_info "Starting release process for version: $VERSION"

# Check if we're on master branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "master" ]; then
    log_warning "You are not on the master branch (current: $CURRENT_BRANCH)"
    read -p "Do you want to continue? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Release cancelled"
        exit 0
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    log_error "You have uncommitted changes. Please commit or stash them first."
    git status
    exit 1
fi

# Pull latest changes
log_info "Pulling latest changes..."
git pull origin master

# Run tests
log_info "Running tests and type checking..."
npm ci
npx tsc --noEmit
npm run build

if [ $? -ne 0 ]; then
    log_error "Tests or build failed!"
    exit 1
fi

log_success "Tests and build completed successfully"

# Update package.json version
log_info "Updating package.json version..."
CLEAN_VERSION="${VERSION#v}"
npm version $CLEAN_VERSION --no-git-tag-version

# Build Docker image locally for testing
log_info "Building Docker image locally for testing..."
podman build -t qrcode-mcp-server:$VERSION .

if [ $? -ne 0 ]; then
    log_error "Docker build failed!"
    exit 1
fi

log_success "Docker image built successfully"

# Test Docker image
log_info "Testing Docker image..."
podman run --rm qrcode-mcp-server:$VERSION node --version

if [ $? -ne 0 ]; then
    log_error "Docker image test failed!"
    exit 1
fi

log_success "Docker image test passed"

# Commit version bump
log_info "Committing version bump..."
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"

# Create and push tag
log_info "Creating and pushing tag..."
git tag $VERSION
git push origin master
git push origin $VERSION

log_success "Tag $VERSION created and pushed"

# Trigger GitHub Action for release
log_info "GitHub Actions will now handle the release process"
log_info "You can monitor the progress at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"

log_success "Release process initiated successfully!"
log_info "The following will happen automatically:"
echo "  • Docker image will be built and pushed to DockerHub"
echo "  • GitHub Release will be created"
echo "  • Security scans will be performed"
echo "  • Release notes will be generated"

echo ""
log_info "Once the release is complete, you can use the Docker image with:"
echo "  docker pull antobrugnot/qrcode-mcp-server:$VERSION"
echo "  docker pull antobrugnot/qrcode-mcp-server:latest"
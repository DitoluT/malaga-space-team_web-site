#!/bin/bash

# Configuration
APP_NAME="liquid-glass-mst"
CONTAINER_NAME="liquid-glass-mst-container"
IMAGE_NAME="liquid-glass-mst:latest"
PORT=3000
ENV_FILE=".env"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if .env file exists (create from example if not)
if [ ! -f "$ENV_FILE" ]; then
    if [ -f ".env.example" ]; then
        print_warning "No .env file found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your EmailJS credentials before running the app."
    else
        print_error "No .env or .env.example file found. Please create .env file with required variables."
        exit 1
    fi
fi

# Function to check if container is running
is_container_running() {
    docker ps -q -f name="$CONTAINER_NAME" | grep -q .
}

# Function to check if container exists (running or stopped)
container_exists() {
    docker ps -aq -f name="$CONTAINER_NAME" | grep -q .
}

# Main deployment logic
echo "🚀 Starting deployment for $APP_NAME..."

# Check if already deployed
if is_container_running; then
    print_warning "Container $CONTAINER_NAME is already running."
    read -p "Do you want to redeploy? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping existing container..."
        docker stop "$CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
    else
        print_status "Deployment cancelled. Container is still running on port $PORT."
        exit 0
    fi
elif container_exists; then
    print_warning "Container $CONTAINER_NAME exists but is not running."
    print_status "Removing existing container..."
    docker rm "$CONTAINER_NAME"
fi

# Build the Docker image
print_status "Building Docker image..."
if docker build -t "$IMAGE_NAME" .; then
    print_status "Docker image built successfully."
else
    print_error "Failed to build Docker image."
    exit 1
fi

# Run the container
print_status "Starting container..."
if docker run -d \
    --name "$CONTAINER_NAME" \
    -p "$PORT:80" \
    --env-file "$ENV_FILE" \
    --restart unless-stopped \
    "$IMAGE_NAME"; then
    
    print_status "Container started successfully."
    
    # Wait for container to be healthy
    print_status "Waiting for application to be ready..."
    sleep 3
    
    # Check if container is still running
    if is_container_running; then
        print_status "Deployment successful! 🎉"
        echo
        echo "Application is running at: http://localhost:$PORT"
        echo
        echo "Useful commands:"
        echo "  - View logs: docker logs -f $CONTAINER_NAME"
        echo "  - Stop container: docker stop $CONTAINER_NAME"
        echo "  - Start container: docker start $CONTAINER_NAME"
        echo "  - Remove container: docker rm -f $CONTAINER_NAME"
    else
        print_error "Container failed to start. Check logs with: docker logs $CONTAINER_NAME"
        exit 1
    fi
else
    print_error "Failed to start container."
    exit 1
fi
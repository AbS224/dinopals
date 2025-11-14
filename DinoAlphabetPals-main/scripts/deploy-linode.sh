#!/bin/bash

# DinoAlphabet Pals - Linode Deployment Script
# Usage: ./scripts/deploy-linode.sh [server-ip]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="dinoalphabet-pals"
REMOTE_USER="dinoapp"
REMOTE_DIR="/home/dinoapp/dinoalphabet-pals"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if server IP is provided
if [ -z "$1" ]; then
    echo -e "${BLUE}🦕 DinoAlphabet Pals - Linode Deployment${NC}"
    echo ""
    echo "Usage: $0 <server-ip>"
    echo ""
    echo "Example: $0 192.168.1.100"
    echo ""
    exit 1
fi

SERVER_IP="$1"

log "🦕 Starting deployment to Linode server: $SERVER_IP"

# Check if we can connect to the server
log "🔍 Testing connection to server..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$REMOTE_USER@$SERVER_IP" exit 2>/dev/null; then
    error "Cannot connect to $REMOTE_USER@$SERVER_IP. Please check your SSH configuration."
fi

log "✅ Connection successful!"

# Check if Docker is installed on the server
log "🐳 Checking Docker installation..."
if ! ssh "$REMOTE_USER@$SERVER_IP" "command -v docker >/dev/null 2>&1"; then
    warn "Docker not found on server. Please install Docker first."
    echo ""
    echo "Run this on your server:"
    echo "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    echo "sudo usermod -aG docker $REMOTE_USER"
    echo ""
    exit 1
fi

log "✅ Docker is installed!"

# Build the application locally
log "📦 Building application locally..."
npm run build

# Create deployment package
log "📦 Creating deployment package..."
TEMP_DIR=$(mktemp -d)
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='out' \
    --exclude='*.log' \
    -czf "$TEMP_DIR/$APP_NAME.tar.gz" .

log "📤 Uploading application to server..."
scp "$TEMP_DIR/$APP_NAME.tar.gz" "$REMOTE_USER@$SERVER_IP:/tmp/"

# Deploy on server
log "🚀 Deploying on server..."
ssh "$REMOTE_USER@$SERVER_IP" << EOF
set -e

# Create application directory
mkdir -p $REMOTE_DIR
cd $REMOTE_DIR

# Backup current deployment
if [ -d "current" ]; then
    echo "📦 Backing up current deployment..."
    mv current backup-\$(date +%Y%m%d_%H%M%S) || true
fi

# Extract new deployment
echo "📦 Extracting new deployment..."
mkdir -p current
cd current
tar -xzf /tmp/$APP_NAME.tar.gz
rm /tmp/$APP_NAME.tar.gz

# Copy environment file if it exists
if [ -f ../production.env ]; then
    cp ../production.env .env.local
    echo "✅ Environment file copied"
else
    echo "⚠️  No environment file found. Creating template..."
    cat > .env.local << 'EOL'
# Add your API keys here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
EOL
fi

# Stop existing container
echo "🛑 Stopping existing container..."
docker stop $APP_NAME 2>/dev/null || true
docker rm $APP_NAME 2>/dev/null || true

# Build new image
echo "🔨 Building Docker image..."
docker build -t $APP_NAME .

# Start new container
echo "🚀 Starting new container..."
docker run -d \
  --name $APP_NAME \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  $APP_NAME

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Check if container is running
if docker ps | grep -q $APP_NAME; then
    echo "✅ Container is running!"
    
    # Test the application
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Application is responding!"
    else
        echo "⚠️  Application may not be fully ready yet"
    fi
else
    echo "❌ Container failed to start"
    echo "Logs:"
    docker logs $APP_NAME
    exit 1
fi

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"
EOF

# Cleanup local temp files
rm -rf "$TEMP_DIR"

log "🎉 Deployment completed successfully!"
log "🌐 Your app should be available at: http://$SERVER_IP"
log "📊 To check status: ssh $REMOTE_USER@$SERVER_IP 'docker ps'"
log "📋 To view logs: ssh $REMOTE_USER@$SERVER_IP 'docker logs $APP_NAME'"

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Set up a domain name (optional)"
echo "2. Configure SSL with Let's Encrypt"
echo "3. Set up monitoring and backups"
echo "4. Configure your API keys in the environment file"
echo ""
echo -e "${YELLOW}To update your app in the future, just run this script again!${NC}"
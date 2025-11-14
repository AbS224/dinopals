#!/bin/bash

# DinoAlphabet Pals - Linode Server Setup Script
# Run this script on your fresh Linode server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run this script as root (or with sudo)"
fi

log "🦕 Setting up Linode server for DinoAlphabet Pals..."

# Update system
log "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
log "📦 Installing essential packages..."
apt install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    htop \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Create application user
log "👤 Creating application user..."
if ! id "dinoapp" &>/dev/null; then
    adduser --disabled-password --gecos "" dinoapp
    usermod -aG sudo dinoapp
    log "✅ User 'dinoapp' created"
else
    log "✅ User 'dinoapp' already exists"
fi

# Setup SSH for application user
log "🔑 Setting up SSH for application user..."
if [ -d "/root/.ssh" ] && [ -f "/root/.ssh/authorized_keys" ]; then
    mkdir -p /home/dinoapp/.ssh
    cp /root/.ssh/authorized_keys /home/dinoapp/.ssh/
    chown -R dinoapp:dinoapp /home/dinoapp/.ssh
    chmod 700 /home/dinoapp/.ssh
    chmod 600 /home/dinoapp/.ssh/authorized_keys
    log "✅ SSH keys copied to dinoapp user"
fi

# Install Docker
log "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker dinoapp
    rm get-docker.sh
    log "✅ Docker installed"
else
    log "✅ Docker already installed"
fi

# Install Docker Compose
log "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log "✅ Docker Compose installed"
else
    log "✅ Docker Compose already installed"
fi

# Install Nginx
log "🌐 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    log "✅ Nginx installed"
else
    log "✅ Nginx already installed"
fi

# Configure firewall
log "🔥 Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log "✅ Firewall configured"

# Configure fail2ban
log "🛡️ Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
EOF

systemctl restart fail2ban
systemctl enable fail2ban
log "✅ Fail2ban configured"

# Setup automatic updates
log "🔄 Setting up automatic security updates..."
apt install -y unattended-upgrades
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/50unattended-upgrades
dpkg-reconfigure -f noninteractive unattended-upgrades
log "✅ Automatic updates configured"

# Create application directories
log "📁 Creating application directories..."
sudo -u dinoapp mkdir -p /home/dinoapp/dinoalphabet-pals
sudo -u dinoapp mkdir -p /home/dinoapp/backups
sudo -u dinoapp mkdir -p /home/dinoapp/logs

# Create basic Nginx configuration
log "🌐 Creating basic Nginx configuration..."
cat > /etc/nginx/sites-available/dinoalphabet << 'EOF'
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    location /login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static file caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/dinoalphabet /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

log "✅ Nginx configured"

# Create useful scripts for the dinoapp user
log "📝 Creating management scripts..."

# Update script
cat > /home/dinoapp/update-app.sh << 'EOF'
#!/bin/bash
set -e

echo "🦕 Updating DinoAlphabet Pals..."

cd ~/dinoalphabet-pals/current

# Stop container
docker stop dinoalphabet-pals || true
docker rm dinoalphabet-pals || true

# Rebuild and start
docker build -t dinoalphabet-pals .
docker run -d \
  --name dinoalphabet-pals \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  dinoalphabet-pals

echo "✅ Update complete!"
EOF

# Backup script
cat > /home/dinoapp/backup-app.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/dinoapp/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/dinoalphabet_$DATE.tar.gz \
  ~/dinoalphabet-pals \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git

# Keep only last 7 backups
find $BACKUP_DIR -name "dinoalphabet_*.tar.gz" -mtime +7 -delete

echo "✅ Backup created: dinoalphabet_$DATE.tar.gz"
EOF

# Status script
cat > /home/dinoapp/status.sh << 'EOF'
#!/bin/bash

echo "🦕 DinoAlphabet Pals Status"
echo "=========================="
echo ""

echo "🐳 Docker Status:"
docker ps --filter name=dinoalphabet-pals --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "🌐 Nginx Status:"
systemctl is-active nginx
echo ""

echo "💾 Disk Usage:"
df -h /
echo ""

echo "🔥 Firewall Status:"
ufw status
echo ""

echo "📊 System Resources:"
free -h
echo ""

if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Application is responding"
else
    echo "❌ Application is not responding"
fi
EOF

# Make scripts executable
chmod +x /home/dinoapp/*.sh
chown dinoapp:dinoapp /home/dinoapp/*.sh

log "✅ Management scripts created"

# Install Certbot for SSL
log "🔒 Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx
log "✅ Certbot installed"

# Create environment template
log "📝 Creating environment template..."
sudo -u dinoapp cat > /home/dinoapp/production.env << 'EOF'
# DinoAlphabet Pals Environment Configuration
# Copy this file to your application directory as .env.local

# Google Gemini AI API Key for adaptive difficulty and personalized encouragement
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs API Key for premium voice synthesis
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Custom ElevenLabs Voice ID (defaults to a child-friendly voice)
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
EOF

log "✅ Environment template created"

# Final setup
log "🔧 Final setup..."
systemctl daemon-reload

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "unknown")

log "🎉 Server setup completed successfully!"
echo ""
echo -e "${BLUE}=== Setup Summary ===${NC}"
echo "• Server IP: $SERVER_IP"
echo "• Application user: dinoapp"
echo "• Application directory: /home/dinoapp/dinoalphabet-pals"
echo "• Nginx configuration: /etc/nginx/sites-available/dinoalphabet"
echo "• Environment template: /home/dinoapp/production.env"
echo ""
echo -e "${BLUE}=== Next Steps ===${NC}"
echo "1. Switch to the dinoapp user: su - dinoapp"
echo "2. Deploy your application using the deployment script"
echo "3. Configure your API keys in the environment file"
echo "4. (Optional) Set up SSL: sudo certbot --nginx -d yourdomain.com"
echo ""
echo -e "${BLUE}=== Useful Commands ===${NC}"
echo "• Check app status: /home/dinoapp/status.sh"
echo "• Update app: /home/dinoapp/update-app.sh"
echo "• Backup app: /home/dinoapp/backup-app.sh"
echo "• View app logs: docker logs dinoalphabet-pals"
echo ""
echo -e "${GREEN}Your Linode server is ready for DinoAlphabet Pals! 🦕${NC}"
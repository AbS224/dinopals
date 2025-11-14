# Linode Self-Hosting Guide for DinoAlphabet Pals

## Overview
This guide will help you deploy DinoAlphabet Pals on a Linode server with Docker, SSL, and proper security.

## Prerequisites
- Linode account
- Domain name (optional but recommended)
- Basic command line knowledge

## Step 1: Create Linode Server

### 1.1 Create a Linode Instance
1. Log into [Linode Cloud Manager](https://cloud.linode.com)
2. Click "Create Linode"
3. Choose:
   - **Distribution**: Ubuntu 22.04 LTS
   - **Region**: Closest to your location
   - **Plan**: Nanode 1GB ($5/month) is sufficient for family use
   - **Root Password**: Create a strong password
   - **SSH Keys**: Add your SSH key (recommended)

### 1.2 Initial Server Setup
```bash
# Connect to your server
ssh root@YOUR_LINODE_IP

# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git ufw fail2ban

# Create a non-root user
adduser dinoapp
usermod -aG sudo dinoapp

# Setup SSH for new user
mkdir -p /home/dinoapp/.ssh
cp ~/.ssh/authorized_keys /home/dinoapp/.ssh/
chown -R dinoapp:dinoapp /home/dinoapp/.ssh
chmod 700 /home/dinoapp/.ssh
chmod 600 /home/dinoapp/.ssh/authorized_keys
```

## Step 2: Install Docker

```bash
# Switch to your user
su - dinoapp

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker dinoapp

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
ssh dinoapp@YOUR_LINODE_IP
```

## Step 3: Setup Firewall

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Check status
sudo ufw status
```

## Step 4: Deploy the Application

### 4.1 Clone and Setup
```bash
# Clone your repository (or upload files)
git clone https://github.com/yourusername/dinoalphabet-pals.git
cd dinoalphabet-pals

# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 4.2 Build and Run with Docker
```bash
# Build the Docker image
docker build -t dinoalphabet-pals .

# Run the container
docker run -d \
  --name dinoalphabet-pals \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  dinoalphabet-pals

# Check if it's running
docker ps
curl http://localhost:3000
```

## Step 5: Setup Reverse Proxy with Nginx

### 5.1 Install Nginx
```bash
sudo apt install -y nginx
```

### 5.2 Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/dinoalphabet
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

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
}
```

### 5.3 Enable the Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/dinoalphabet /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Step 6: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 7: Setup Monitoring and Maintenance

### 7.1 Create Update Script
```bash
# Create update script
nano ~/update-dinoalphabet.sh
```

Add this content:
```bash
#!/bin/bash
set -e

echo "🦕 Updating DinoAlphabet Pals..."

cd ~/dinoalphabet-pals

# Pull latest changes
git pull origin main

# Rebuild Docker image
docker build -t dinoalphabet-pals .

# Stop old container
docker stop dinoalphabet-pals || true
docker rm dinoalphabet-pals || true

# Start new container
docker run -d \
  --name dinoalphabet-pals \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  dinoalphabet-pals

echo "✅ Update complete!"
```

```bash
# Make it executable
chmod +x ~/update-dinoalphabet.sh
```

### 7.2 Setup Log Rotation
```bash
# Create log rotation config
sudo nano /etc/logrotate.d/dinoalphabet
```

Add:
```
/var/log/dinoalphabet/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 dinoapp dinoapp
}
```

### 7.3 Setup Backup Script
```bash
# Create backup script
nano ~/backup-dinoalphabet.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/home/dinoapp/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application data
tar -czf $BACKUP_DIR/dinoalphabet_$DATE.tar.gz \
  ~/dinoalphabet-pals \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git

# Keep only last 7 backups
find $BACKUP_DIR -name "dinoalphabet_*.tar.gz" -mtime +7 -delete

echo "✅ Backup created: dinoalphabet_$DATE.tar.gz"
```

```bash
# Make it executable
chmod +x ~/backup-dinoalphabet.sh

# Add to crontab for daily backups
crontab -e
# Add this line:
# 0 2 * * * /home/dinoapp/backup-dinoalphabet.sh
```

## Step 8: Security Hardening

### 8.1 Configure Fail2Ban
```bash
# Create Nginx jail
sudo nano /etc/fail2ban/jail.local
```

Add:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
```

```bash
# Restart fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

### 8.2 Setup Automatic Updates
```bash
# Install unattended upgrades
sudo apt install -y unattended-upgrades

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Step 9: Domain Setup (Optional)

If you have a domain:

1. **Point your domain to Linode IP**:
   - Add an A record: `yourdomain.com` → `YOUR_LINODE_IP`
   - Add a CNAME record: `www.yourdomain.com` → `yourdomain.com`

2. **Update Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/dinoalphabet
   # Change server_name to your domain
   ```

3. **Get SSL certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Step 10: Monitoring and Maintenance

### 10.1 Check Application Status
```bash
# Check if container is running
docker ps

# View application logs
docker logs dinoalphabet-pals

# Check Nginx status
sudo systemctl status nginx

# Check system resources
htop
df -h
```

### 10.2 Regular Maintenance Tasks

**Weekly**:
- Check logs for errors
- Monitor disk space
- Review security logs

**Monthly**:
- Update system packages: `sudo apt update && sudo apt upgrade`
- Review backup integrity
- Check SSL certificate expiry

## Troubleshooting

### Common Issues

1. **Container won't start**:
   ```bash
   docker logs dinoalphabet-pals
   # Check for environment variable issues
   ```

2. **502 Bad Gateway**:
   ```bash
   # Check if app is running on port 3000
   curl http://localhost:3000
   # Check Nginx configuration
   sudo nginx -t
   ```

3. **SSL issues**:
   ```bash
   # Renew certificate manually
   sudo certbot renew
   ```

4. **High memory usage**:
   ```bash
   # Restart the container
   docker restart dinoalphabet-pals
   ```

## Cost Estimation

- **Linode Nanode 1GB**: $5/month
- **Domain (optional)**: $10-15/year
- **Total**: ~$5-6/month

## Security Best Practices

1. ✅ Use SSH keys instead of passwords
2. ✅ Keep system updated
3. ✅ Use firewall (UFW)
4. ✅ Enable fail2ban
5. ✅ Use SSL/HTTPS
6. ✅ Regular backups
7. ✅ Monitor logs
8. ✅ Use non-root user for application

## Next Steps

1. Set up monitoring (optional): Consider tools like Uptime Robot for external monitoring
2. Set up email alerts for system issues
3. Consider setting up a staging environment for testing updates

Your DinoAlphabet Pals app is now securely hosted on Linode! 🦕🎉
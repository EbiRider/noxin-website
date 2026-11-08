#!/bin/bash
# One-time server setup script for a fresh Ubuntu 22.04/24.04 VM.
# Run as root: bash server-setup.sh
set -e

DOMAIN="noxin.ir"
APP_DIR="/var/www/noxin"
REPO_URL="git@github.com:EbiRider/noxin-website.git"
DEPLOY_USER="deploy"
NVM_VERSION="v0.40.3"
NODE_VERSION="20"

echo "=== [0/7] Switch to ArvanCloud mirror (accessible from Iran) ==="
cat > /etc/apt/sources.list <<'EOF'
deb http://mirror.arvancloud.ir/ubuntu noble main restricted universe multiverse
deb http://mirror.arvancloud.ir/ubuntu noble-updates main restricted universe multiverse
deb http://mirror.arvancloud.ir/ubuntu noble-security main restricted universe multiverse
EOF

echo "=== [1/7] Install base packages (git, nginx, certbot) ==="
apt-get update
apt-get install -y git nginx certbot python3-certbot-nginx

echo "=== [2/7] Install Node.js $NODE_VERSION via binary tarball ==="
tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1
node -v && npm -v

echo "=== [3/7] Install PM2 ==="
npm install -g pm2

echo "=== [4/7] Create deploy user ==="
id -u $DEPLOY_USER &>/dev/null || useradd -m -s /bin/bash $DEPLOY_USER
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
# node/npm/pm2 are in /usr/local/bin from the tarball install — no extra setup needed
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh

echo "=== [5/7] Clone repo & first build ==="
mkdir -p $APP_DIR
chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR
sudo -u $DEPLOY_USER git clone $REPO_URL $APP_DIR
cd $APP_DIR
sudo -u $DEPLOY_USER npm ci
sudo -u $DEPLOY_USER npm run build

echo "=== [6/7] Start app with PM2 ==="
sudo -u $DEPLOY_USER pm2 start $APP_DIR/ecosystem.config.js
sudo -u $DEPLOY_USER pm2 save
pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER | tail -1 | bash

echo "=== [7/7] Configure Nginx ==="
cp $APP_DIR/nginx/noxin.conf /etc/nginx/sites-available/noxin
ln -sf /etc/nginx/sites-available/noxin /etc/nginx/sites-enabled/noxin
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "=== Done! Next steps: ==="
echo "1. Add deploy user SSH key to authorized_keys:"
echo "   sudo -u deploy ssh-keygen -t ed25519 -C gitlab-ci -f /home/deploy/.ssh/gitlab_ci -N ''"
echo "   cat /home/deploy/.ssh/gitlab_ci.pub >> /home/deploy/.ssh/authorized_keys"
echo "2. Point DNS A record: $DOMAIN → $(curl -s ifconfig.me)"
echo "3. Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "App is running at http://localhost:3000"

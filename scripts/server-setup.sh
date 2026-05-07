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

echo "=== [1/7] Install base packages (git, nginx, certbot) ==="
apt-get update --fix-missing || true
apt-get install -y git nginx certbot python3-certbot-nginx --fix-missing

echo "=== [2/7] Install Node.js $NODE_VERSION via nvm ==="
export NVM_DIR="/root/.nvm"
curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash
# Load nvm in this shell session
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install $NODE_VERSION
nvm alias default $NODE_VERSION
nvm use default
node -v && npm -v

echo "=== [3/7] Install PM2 ==="
npm install -g pm2

echo "=== [4/7] Create deploy user ==="
id -u $DEPLOY_USER &>/dev/null || useradd -m -s /bin/bash $DEPLOY_USER
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
# Copy root's nvm to deploy user
cp -r /root/.nvm /home/$DEPLOY_USER/.nvm
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.nvm
# Add nvm init to deploy user's bashrc
cat >> /home/$DEPLOY_USER/.bashrc <<'BASHRC'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
BASHRC
# Symlink node/npm/pm2 to /usr/local/bin so non-login shells find them
NODE_BIN=$(find /root/.nvm/versions/node -name "node" -type f | head -1)
ln -sf "$NODE_BIN" /usr/local/bin/node
ln -sf "$(dirname $NODE_BIN)/npm" /usr/local/bin/npm
ln -sf "$(dirname $NODE_BIN)/npx" /usr/local/bin/npx
PM2_BIN=$(find /root/.nvm/versions/node -name "pm2" -type f | head -1)
ln -sf "$PM2_BIN" /usr/local/bin/pm2
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

#!/bin/bash
# One-time server setup script for a fresh Ubuntu 22.04 VM.
# Run as root or with sudo: bash server-setup.sh
set -e

DOMAIN="noxin.ir"
APP_DIR="/var/www/noxin"
REPO_URL="git@gitlab.com:Ebi_rider/noxin-website.git"
DEPLOY_USER="deploy"

echo "=== [1/7] System update ==="
apt-get update && apt-get upgrade -y

echo "=== [2/7] Install Node.js 20 LTS ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v && npm -v

echo "=== [3/7] Install PM2 ==="
npm install -g pm2

echo "=== [4/7] Install Nginx & Certbot ==="
apt-get install -y nginx certbot python3-certbot-nginx git

echo "=== [5/7] Create deploy user ==="
id -u $DEPLOY_USER &>/dev/null || useradd -m -s /bin/bash $DEPLOY_USER
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
# Paste the GitLab CI public key here after generating it:
# echo "ssh-ed25519 AAAA... gitlab-ci" >> /home/$DEPLOY_USER/.ssh/authorized_keys
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh

echo "=== [6/7] Clone repo & first build ==="
mkdir -p $APP_DIR
chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR
sudo -u $DEPLOY_USER git clone $REPO_URL $APP_DIR
cd $APP_DIR
sudo -u $DEPLOY_USER npm ci
sudo -u $DEPLOY_USER npm run build

echo "=== [6b/7] Start app with PM2 ==="
sudo -u $DEPLOY_USER pm2 start $APP_DIR/ecosystem.config.js
sudo -u $DEPLOY_USER pm2 save
# Make PM2 start on reboot (run the printed command as root):
sudo -u $DEPLOY_USER pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER

echo "=== [7/7] Configure Nginx ==="
cp $APP_DIR/nginx/noxin.conf /etc/nginx/sites-available/noxin
# Replace placeholder domain if different:
sed -i "s/noxin.ir/$DOMAIN/g" /etc/nginx/sites-available/noxin
ln -sf /etc/nginx/sites-available/noxin /etc/nginx/sites-enabled/noxin
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "=== Done! Next steps: ==="
echo "1. Point your domain DNS A record to this server's IP"
echo "2. Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "3. Add the deploy user's public SSH key to GitLab CI/CD variables"
echo ""
echo "App is running at http://localhost:3000"

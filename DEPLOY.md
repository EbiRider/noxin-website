# Deployment Guide

## Overview

```
git push → GitLab CI → SSH into VM → git pull + npm build + pm2 restart
```

Every push to `main` automatically deploys in ~2 minutes.

---

## One-time server setup

### 1. Run the setup script

SSH into your fresh Ubuntu 22.04 VM as root:

```bash
ssh root@YOUR_SERVER_IP
```

Upload and run the setup script:

```bash
curl -o setup.sh https://gitlab.com/Ebi_rider/noxin-website/-/raw/main/scripts/server-setup.sh
bash setup.sh
```

This installs Node.js 20, PM2, Nginx, Certbot, clones the repo, builds it, and starts the app.

### 2. Generate an SSH key for CI/CD

On the **server**, as the `deploy` user:

```bash
sudo -u deploy ssh-keygen -t ed25519 -C "gitlab-ci" -f /home/deploy/.ssh/gitlab_ci -N ""
```

Add the **public** key to authorized keys:

```bash
cat /home/deploy/.ssh/gitlab_ci.pub >> /home/deploy/.ssh/authorized_keys
```

Print the **private** key — you'll paste this into GitLab:

```bash
cat /home/deploy/.ssh/gitlab_ci
```

### 3. Add CI/CD variables to GitLab

Go to **GitLab → Your project → Settings → CI/CD → Variables** and add:

| Variable | Value | Type | Masked |
|----------|-------|------|--------|
| `SSH_PRIVATE_KEY` | Contents of `gitlab_ci` private key | File | ✅ |
| `SERVER_IP` | Your VM's IP address | Variable | ✅ |
| `DEPLOY_USER` | `deploy` | Variable | ❌ |
| `SERVER_KNOWN_HOSTS` | Output of `ssh-keyscan YOUR_SERVER_IP` | Variable | ❌ |

To get `SERVER_KNOWN_HOSTS`, run this **on your local machine**:

```bash
ssh-keyscan YOUR_SERVER_IP
```

### 4. Point your domain & get SSL

In your domain registrar, add an **A record**:
```
noxin.ir   →   YOUR_SERVER_IP
www.noxin.ir →  YOUR_SERVER_IP
```

Then on the server:

```bash
sudo certbot --nginx -d noxin.ir -d www.noxin.ir
```

Certbot auto-renews — nothing else needed.

---

## Future deployments (automatic)

Just push to `main`:

```bash
git push origin main
```

GitLab CI will SSH in, pull the latest code, rebuild, and restart PM2. Monitor it under **GitLab → CI/CD → Pipelines**.

---

## Manual deploy (if needed)

SSH into the server and run:

```bash
ssh deploy@YOUR_SERVER_IP "cd /var/www/noxin && git pull && npm ci && npm run build && pm2 restart noxin"
```

---

## Environment variables

Create a `.env.local` file on the server (not in git):

```bash
nano /var/www/noxin/.env.local
```

Add secrets here (email credentials, SMS API key, etc.):

```env
SMS_API_KEY=your_key_here
EMAIL_FROM=info@noxin.ir
EMAIL_APP_PASSWORD=your_app_password
NOTIFY_EMAIL=info@noxin.ir
NOTIFY_PHONE=09xxxxxxxxx
```

After changing `.env.local`, restart the app:

```bash
pm2 restart noxin
```

---

## Useful PM2 commands

```bash
pm2 status               # see if app is running
pm2 logs noxin           # live logs
pm2 restart noxin        # manual restart
pm2 stop noxin           # stop
pm2 monit                # CPU/RAM monitor
```

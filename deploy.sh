#!/usr/bin/env bash
# One-command deploy for InviteMart (run ON the VPS).
#   bash /home/invitemart/deploy.sh
# Pulls latest code, reinstalls deps, rebuilds Next, and reloads the pm2 app.
set -e

SITE_DIR="/home/invitemart"
APP_NAME="invitemart"
PORT=3007

cd "$SITE_DIR"

echo "==> 1/4 Pulling latest code"
git pull --ff-only

echo "==> 2/4 Installing dependencies"
npm ci --no-fund --no-audit

echo "==> 3/4 Building Next.js (memory-capped)"
NODE_OPTIONS="--max-old-space-size=1536" npm run build

echo "==> 4/4 Reloading pm2 app on :$PORT"
export PORT
pm2 reload "$APP_NAME" --update-env 2>/dev/null || PORT=$PORT pm2 start npm --name "$APP_NAME" -- start
pm2 save >/dev/null 2>&1

echo ""
echo "✅ Deployed. App live on 127.0.0.1:$PORT (behind nginx)."

#!/usr/bin/env bash
# LOCAL one-command "push = deploy". Run from the repo root:
#   bash scripts/push-deploy.sh "commit message"
#
# Does both tasks the user asks for when they say "push":
#   1. commit any pending changes + push to GitHub (origin/main)
#   2. trigger the remote deploy on the VPS (git pull + build + pm2 reload)
#
# Requires the SSH alias 'invitemart-vps' (set up in ~/.ssh/config with the
# im_deploy key) so no password is needed.
set -e

MSG="${1:-Deploy update}"
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "==> committing pending changes"
  git add -A
  git commit -m "$MSG"
else
  echo "==> no local changes to commit"
fi

echo "==> pushing to GitHub (origin/main)"
git push origin main

echo "==> deploying on VPS"
ssh invitemart-vps 'bash /home/invitemart/deploy.sh'

echo ""
echo "✅ push + deploy complete."

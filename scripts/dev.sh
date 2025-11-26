#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

if [[ -f .env.local ]]; then
  export $(grep -v '^#' .env.local | xargs)
fi

echo "Starting Nuxt dev server on http://localhost:3000"
npm run dev

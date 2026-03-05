#!/usr/bin/env bash
# Build script for Render

# Install dependencies
npm install

# Install Chromium for Puppeteer
# This ensures Chromium is correctly downloaded in the Render environment
echo "Installing Chromium for Puppeteer..."
npx puppeteer browsers install chrome

# Run Prisma migrations if needed (optional, assuming DATABASE_URL is set)
# npx prisma migrate deploy

# Run Prisma generate
npx prisma generate

# Build the Next.js application
npm run build

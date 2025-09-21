#!/bin/bash
cd /root/pickfresh

# Build once before starting
npm run build

# Start NestJS with PM2
pm2 start dist/main.js --name pickfresh --time

# Start ngrok with PM2
pm2 start "ngrok http --domain=pickfresh.ngrok.app 8080" --name ngrok --time

# Save PM2 process list so it restarts on reboot
pm2 save

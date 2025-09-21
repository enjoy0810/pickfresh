#!/bin/bash
cd /root/pickfresh

# Run app detached, logs saved
nohup npm run start:dev > app.log 2>&1 &

# Run ngrok detached, logs saved
nohup ngrok http --domain=pickfresh.ngrok.app 8080 > ngrok.log 2>&1 &

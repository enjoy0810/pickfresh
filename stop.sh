#!/bin/bash

echo "Stopping NestJS app..."
pkill -f "npm run start:dev"

echo "Stopping ngrok..."
pkill -f "ngrok"

echo "✅ All processes stopped."

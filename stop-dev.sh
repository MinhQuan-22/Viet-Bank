#!/bin/bash

# VietBank Development Stop Script
# Dừng tất cả services đang chạy

echo "🛑 Stopping VietBank Development Environment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Stop Vite dev server
if lsof -Pi :5175 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${BLUE}Stopping Vite dev server...${NC}"
    lsof -ti:5175 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Vite stopped${NC}"
else
    echo -e "${BLUE}Vite dev server not running${NC}"
fi

# Stop Firebase Emulators
if lsof -Pi :9099 -sTCP:LISTEN -t >/dev/null 2>&1 || \
   lsof -Pi :9000 -sTCP:LISTEN -t >/dev/null 2>&1 || \
   lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${BLUE}Stopping Firebase Emulators...${NC}"
    lsof -ti:9099 | xargs kill -9 2>/dev/null
    lsof -ti:9000 | xargs kill -9 2>/dev/null
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    lsof -ti:4000 | xargs kill -9 2>/dev/null
    lsof -ti:4400 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Emulators stopped${NC}"
else
    echo -e "${BLUE}Firebase Emulators not running${NC}"
fi

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"

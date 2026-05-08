#!/bin/bash

# VietBank Development Startup Script
# Khởi động hệ thống development với emulators và seed data tự động

set -e

echo "🚀 Starting VietBank Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if emulators are already running
echo -e "${BLUE}📋 Checking existing processes...${NC}"
if lsof -Pi :9099 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Auth Emulator already running on port 9099${NC}"
fi

if lsof -Pi :9000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Database Emulator already running on port 9000${NC}"
fi

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Firestore Emulator already running on port 8080${NC}"
fi

if lsof -Pi :5175 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Vite dev server already running on port 5175${NC}"
fi

echo ""

# Step 2: Start Firebase Emulators in background
echo -e "${BLUE}🔥 Starting Firebase Emulators...${NC}"
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final > /dev/null 2>&1 &
EMULATOR_PID=$!

# Wait for emulators to be ready
echo -e "${BLUE}⏳ Waiting for emulators to start...${NC}"
sleep 8

# Check if emulators started successfully
if ! lsof -Pi :9099 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}❌ Failed to start emulators${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Emulators started successfully${NC}"
echo ""

# Step 3: Seed test data
echo -e "${BLUE}🌱 Seeding test data...${NC}"

# Create Auth account
echo -e "${BLUE}   Creating Auth account...${NC}"
AUTH_RESPONSE=$(curl -s -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}')

UID=$(echo $AUTH_RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('localId', ''))" 2>/dev/null)

if [ -z "$UID" ]; then
    echo -e "${YELLOW}⚠️  Could not create auth account (may already exist)${NC}"
    UID="kkLrofQ7rxFEvVLu8qWv7JK3jTR6"
else
    echo -e "${GREEN}   ✅ Auth account created (UID: $UID)${NC}"
fi

# Create user profile
echo -e "${BLUE}   Creating user profile...${NC}"
curl -s -X PUT "http://127.0.0.1:9000/users/${UID}.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d "{
    \"uid\": \"${UID}\",
    \"username\": \"Hoang Test\",
    \"email\": \"thehoang.acc@gmail.com\",
    \"role\": \"CUSTOMER\",
    \"status\": \"ACTIVE\",
    \"ekycStatus\": \"VERIFIED\",
    \"canTransact\": true,
    \"createdAt\": 1778231000000,
    \"phone\": \"0901234567\",
    \"gender\": \"MALE\",
    \"dob\": \"1990-01-01\",
    \"nationalId\": \"079090001234\",
    \"idIssueDate\": \"2020-01-01\",
    \"placeOfIssue\": \"Cục Cảnh sát QLHC về TTXH\",
    \"permanentAddress\": \"123 Test Street, District 1, HCMC\",
    \"contactAddress\": \"123 Test Street, District 1, HCMC\",
    \"cif\": \"CIF0001\",
    \"security\": {\"loginFailCount\": 0}
  }" > /dev/null

echo -e "${GREEN}   ✅ User profile created${NC}"

# Create bank account
echo -e "${BLUE}   Creating bank account...${NC}"
curl -s -X PUT "http://127.0.0.1:9000/accounts/100000000001.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d "{
    \"uid\": \"${UID}\",
    \"accountNumber\": \"100000000001\",
    \"balance\": 10000000,
    \"status\": \"ACTIVE\",
    \"pin\": \"1234\",
    \"createdAt\": 1778231000000
  }" > /dev/null

echo -e "${GREEN}   ✅ Bank account created (Balance: 10,000,000 VND)${NC}"

# Create CIF counter
curl -s -X PUT "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{"cifCounter": 1}' > /dev/null

echo -e "${GREEN}   ✅ CIF counter initialized${NC}"
echo ""

# Step 4: Start Vite dev server
echo -e "${BLUE}⚡ Starting Vite dev server...${NC}"
npm run dev > /dev/null 2>&1 &
VITE_PID=$!

sleep 3

if ! lsof -Pi :5175 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}❌ Failed to start Vite dev server${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vite dev server started${NC}"
echo ""

# Step 5: Display summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 VietBank Development Environment Ready!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 Application:${NC}       http://localhost:5175/"
echo -e "${BLUE}🔐 Emulator UI:${NC}       http://127.0.0.1:4000/"
echo ""
echo -e "${BLUE}👤 Test Account:${NC}"
echo -e "   Email:    thehoang.acc@gmail.com"
echo -e "   Password: Thedeptrai1"
echo -e "   Balance:  10,000,000 VND"
echo -e "   PIN:      1234"
echo ""
echo -e "${BLUE}🔧 Services Running:${NC}"
echo -e "   ✅ Auth Emulator      (127.0.0.1:9099)"
echo -e "   ✅ Firestore Emulator (127.0.0.1:8080)"
echo -e "   ✅ Database Emulator  (127.0.0.1:9000)"
echo -e "   ✅ Vite Dev Server    (localhost:5175)"
echo ""
echo -e "${YELLOW}⚠️  Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for user to stop
wait

# 🔄 HƯỚNG DẪN TẮT VÀ CHẠY LẠI HỆ THỐNG VIETBANK

**Ngày:** 08/05/2026  
**Kiểm tra bởi:** Kiro AI Assistant  
**Trạng thái:** Đã kiểm tra chi tiết và xác nhận hoạt động

---

## 📊 TRẠNG THÁI HỆ THỐNG HIỆN TẠI

Em đã kiểm tra **thật kỹ, cẩn thận và chi tiết** hệ thống của anh:

### ✅ Services Đang Chạy

| Service                | Port | PID   | Status     | Command            |
| ---------------------- | ---- | ----- | ---------- | ------------------ |
| **Vite Dev Server**    | 5175 | 28939 | ✅ Running | `npm run dev`      |
| **Auth Emulator**      | 9099 | 39625 | ✅ Running | Firebase Emulators |
| **Database Emulator**  | 9000 | 39696 | ✅ Running | Firebase Emulators |
| **Firestore Emulator** | 8080 | 39683 | ✅ Running | Firebase Emulators |
| **Emulator UI**        | 4000 | 39625 | ✅ Running | Firebase Emulators |

### 🔗 Mối Quan Hệ Processes

```
Parent Process (PID 39605): npm exec firebase
    └─> Child Process (PID 39625): node firebase emulators
        ├─> Child Process (PID 39683): java (Firestore Emulator)
        └─> Child Process (PID 39696): java (Database Emulator)

Parent Process (PID 28920): npm run dev
    └─> Child Process (PID 28939): node vite
```

**Quan trọng:** Khi kill parent process, các child processes cũng sẽ bị dừng.

---

## 🛑 PHẦN 1: CÁCH TẮT HỆ THỐNG

### **CÁCH 1: DÙNG SCRIPT (KHUYẾN NGHỊ) ⭐**

#### Bước 1: Mở Terminal mới

```bash
cd ~/green-bank-app-main
```

#### Bước 2: Chạy script dừng

```bash
./stop-dev.sh
```

#### Kết quả mong đợi:

```
🛑 Stopping VietBank Development Environment...

Stopping Vite dev server...
✅ Vite stopped

Stopping Firebase Emulators...
✅ Emulators stopped

✅ All services stopped
```

#### Bước 3: Xác nhận đã dừng

```bash
lsof -i :5175  # Không có output = đã dừng
lsof -i :9099  # Không có output = đã dừng
lsof -i :9000  # Không có output = đã dừng
lsof -i :8080  # Không có output = đã dừng
```

**✅ HOÀN TẤT!**

---

### **CÁCH 2: DÙNG CTRL+C (Nếu chạy bằng start-dev.sh)**

#### Điều kiện:

- Anh đã chạy `./start-dev.sh` trong một terminal
- Terminal đó vẫn đang mở

#### Bước 1: Quay lại terminal đang chạy start-dev.sh

#### Bước 2: Nhấn `Ctrl+C`

```
^C
# Script sẽ tự động dừng tất cả services
```

#### Bước 3: Đợi vài giây để processes dừng hoàn toàn

**✅ HOÀN TẤT!**

---

### **CÁCH 3: TẮT THỦ CÔNG TỪNG SERVICE**

#### Bước 1: Dừng Vite Dev Server

```bash
# Tìm PID
lsof -ti:5175

# Kill process
lsof -ti:5175 | xargs kill -9
```

#### Bước 2: Dừng Firebase Emulators

```bash
# Kill Auth Emulator
lsof -ti:9099 | xargs kill -9

# Kill Database Emulator
lsof -ti:9000 | xargs kill -9

# Kill Firestore Emulator
lsof -ti:8080 | xargs kill -9

# Kill Emulator UI
lsof -ti:4000 | xargs kill -9
lsof -ti:4400 | xargs kill -9
```

#### Bước 3: Xác nhận tất cả đã dừng

```bash
ps aux | grep -E "(firebase|vite)" | grep -v grep
```

**Không có output = tất cả đã dừng ✅**

---

### **CÁCH 4: KILL PARENT PROCESSES (Nhanh nhất)**

```bash
# Kill Vite parent process
kill -9 28939

# Kill Firebase parent process
kill -9 39625
```

**Lưu ý:** Thay PID bằng PID thực tế (dùng `lsof -i :5175` và `lsof -i :9099` để tìm)

---

## 🚀 PHẦN 2: CÁCH CHẠY LẠI HỆ THỐNG

### **CÁCH 1: DÙNG SCRIPT TỰ ĐỘNG (KHUYẾN NGHỊ) ⭐**

#### Bước 1: Đảm bảo hệ thống đã tắt hoàn toàn

```bash
./stop-dev.sh
```

#### Bước 2: Đợi 2-3 giây

```bash
sleep 3
```

#### Bước 3: Chạy script khởi động

```bash
./start-dev.sh
```

#### Bước 4: Đợi ~10-15 giây

Anh sẽ thấy:

```
🚀 Starting VietBank Development Environment...

📋 Checking existing processes...

🔥 Starting Firebase Emulators...
⏳ Waiting for emulators to start...
✅ Emulators started successfully

🌱 Seeding test data...
   Creating Auth account...
   ✅ Auth account created (UID: abc123xyz)
   Creating user profile...
   ✅ User profile created
   Creating bank account...
   ✅ Bank account created (Balance: 10,000,000 VND)
   ✅ CIF counter initialized

⚡ Starting Vite dev server...
✅ Vite dev server started

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 VietBank Development Environment Ready!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Application:       http://localhost:5175/
🔐 Emulator UI:       http://127.0.0.1:4000/

👤 Test Account:
   Email:    thehoang.acc@gmail.com
   Password: Thedeptrai1
   Balance:  10,000,000 VND
   PIN:      1234

🔧 Services Running:
   ✅ Auth Emulator      (127.0.0.1:9099)
   ✅ Firestore Emulator (127.0.0.1:8080)
   ✅ Database Emulator  (127.0.0.1:9000)
   ✅ Vite Dev Server    (localhost:5175)

⚠️  Press Ctrl+C to stop all services
```

#### Bước 5: Mở browser và đăng nhập

```
URL: http://localhost:5175/
Email: thehoang.acc@gmail.com
Password: Thedeptrai1
```

**✅ HOÀN TẤT!**

---

### **CÁCH 2: CHẠY THỦ CÔNG TỪNG BƯỚC**

#### Bước 1: Khởi động Firebase Emulators

Mở Terminal thứ nhất:

```bash
cd ~/green-bank-app-main
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

Đợi đến khi thấy:

```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000/               │
└─────────────────────────────────────────────────────────────┘

┌────────────┬────────────────┬─────────────────────────────────┐
│ Emulator   │ Host:Port      │ View in Emulator UI             │
├────────────┼────────────────┼─────────────────────────────────┤
│ Auth       │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
├────────────┼────────────────┼─────────────────────────────────┤
│ Firestore  │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
├────────────┼────────────────┼─────────────────────────────────┤
│ Database   │ 127.0.0.1:9000 │ http://127.0.0.1:4000/database  │
└────────────┴────────────────┴─────────────────────────────────┘
```

**✅ Emulators đã sẵn sàng!**

#### Bước 2: Tạo tài khoản test

Mở Terminal thứ hai:

```bash
cd ~/green-bank-app-main
```

**2.1. Tạo Auth account:**

```bash
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}'
```

**Response sẽ có dạng:**

```json
{
  "kind": "identitytoolkit#SignupNewUserResponse",
  "localId": "abc123xyz456789",
  "email": "thehoang.acc@gmail.com",
  "displayName": "",
  "idToken": "...",
  "refreshToken": "...",
  "expiresIn": "3600"
}
```

**📝 QUAN TRỌNG: Copy giá trị `localId` (đây là UID)**

Ví dụ: `abc123xyz456789`

#### Bước 3: Seed dữ liệu user profile

**⚠️ THAY `YOUR_UID` BẰNG UID VỪA COPY!**

```bash
curl -X PUT "http://127.0.0.1:9000/users/YOUR_UID.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "YOUR_UID",
    "username": "Hoang Test",
    "email": "thehoang.acc@gmail.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "ekycStatus": "VERIFIED",
    "canTransact": true,
    "createdAt": 1778231000000,
    "phone": "0901234567",
    "gender": "MALE",
    "dob": "1990-01-01",
    "nationalId": "079090001234",
    "idIssueDate": "2020-01-01",
    "placeOfIssue": "Cục Cảnh sát QLHC về TTXH",
    "permanentAddress": "123 Test Street, District 1, HCMC",
    "contactAddress": "123 Test Street, District 1, HCMC",
    "cif": "CIF0001",
    "security": {"loginFailCount": 0}
  }'
```

**Response:** `{"uid":"YOUR_UID","username":"Hoang Test",...}`

#### Bước 4: Seed dữ liệu bank account

**⚠️ THAY `YOUR_UID` BẰNG UID VỪA COPY!**

```bash
curl -X PUT "http://127.0.0.1:9000/accounts/100000000001.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "YOUR_UID",
    "accountNumber": "100000000001",
    "balance": 10000000,
    "status": "ACTIVE",
    "pin": "1234",
    "createdAt": 1778231000000
  }'
```

**Response:** `{"uid":"YOUR_UID","accountNumber":"100000000001",...}`

#### Bước 5: Tạo CIF counter

```bash
curl -X PUT "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{"cifCounter": 1}'
```

**Response:** `{"cifCounter":1}`

#### Bước 6: Xác nhận dữ liệu đã được tạo

```bash
# Kiểm tra users
curl -s "http://127.0.0.1:9000/users.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Kiểm tra accounts
curl -s "http://127.0.0.1:9000/accounts.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Kiểm tra counters
curl -s "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool
```

**✅ Dữ liệu đã sẵn sàng!**

#### Bước 7: Khởi động Vite Dev Server

Mở Terminal thứ ba:

```bash
cd ~/green-bank-app-main
npm run dev
```

Đợi đến khi thấy:

```
  VITE v5.4.19  ready in 1234 ms

  ➜  Local:   http://localhost:5175/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**✅ Vite đã sẵn sàng!**

#### Bước 8: Mở browser và đăng nhập

```
URL: http://localhost:5175/
Email: thehoang.acc@gmail.com
Password: Thedeptrai1
```

**✅ HOÀN TẤT!**

---

## 🔍 PHẦN 3: KIỂM TRA HỆ THỐNG

### Kiểm tra services đang chạy

```bash
# Kiểm tra tất cả ports
lsof -i :5175 -i :9099 -i :9000 -i :8080 -i :4000
```

**Có output = services đang chạy ✅**

### Kiểm tra từng service riêng lẻ

```bash
# Vite Dev Server
lsof -i :5175

# Auth Emulator
lsof -i :9099

# Database Emulator
lsof -i :9000

# Firestore Emulator
lsof -i :8080

# Emulator UI
lsof -i :4000
```

### Kiểm tra dữ liệu

```bash
# Xem tất cả users
curl -s "http://127.0.0.1:9000/users.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Xem tất cả accounts
curl -s "http://127.0.0.1:9000/accounts.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Xem counters
curl -s "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool
```

### Kiểm tra browser console

Mở browser (F12), vào tab Console, anh sẽ thấy:

```
[firebase] 🔧 Initializing with emulator mode...
[firebase] Connecting Firestore to emulator: 127.0.0.1:8080
[firebase] ✅ Firestore connected to emulator
[firebase] Connecting Realtime Database to emulator: 127.0.0.1:9000
[firebase] ✅ Realtime Database connected to emulator
[firebase] Connecting Functions to emulator: 127.0.0.1:5001
[firebase] ✅ Functions connected to emulator
[firebase] Auth emulator enabled
```

**✅ Tất cả kết nối emulator thành công!**

---

## ⚠️ PHẦN 4: XỬ LÝ LỖI

### Lỗi 1: "Port already in use"

**Triệu chứng:**

```
Error: listen EADDRINUSE: address already in use :::5175
```

**Nguyên nhân:** Services đã chạy từ trước

**Giải pháp:**

```bash
# Dừng tất cả
./stop-dev.sh

# Đợi 3 giây
sleep 3

# Chạy lại
./start-dev.sh
```

### Lỗi 2: Script không chạy được

**Triệu chứng:**

```
bash: ./start-dev.sh: Permission denied
```

**Nguyên nhân:** Script chưa có quyền execute

**Giải pháp:**

```bash
chmod +x start-dev.sh
chmod +x stop-dev.sh
```

### Lỗi 3: Emulators không khởi động

**Triệu chứng:**

```
❌ Failed to start emulators
```

**Nguyên nhân:** Port đang bị chiếm hoặc Firebase CLI chưa cài

**Giải pháp:**

```bash
# Kiểm tra ports
lsof -i :9099 -i :9000 -i :8080

# Nếu có process đang chạy, kill nó
lsof -ti:9099 | xargs kill -9
lsof -ti:9000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Kiểm tra Firebase CLI
npx firebase --version

# Nếu chưa có, cài đặt
npm install -g firebase-tools
```

### Lỗi 4: Vite không khởi động

**Triệu chứng:**

```
❌ Failed to start Vite dev server
```

**Nguyên nhân:** Port 5175 đang bị chiếm hoặc dependencies chưa cài

**Giải pháp:**

```bash
# Kill process đang chiếm port
lsof -ti:5175 | xargs kill -9

# Cài lại dependencies
npm install

# Chạy lại
npm run dev
```

### Lỗi 5: Không tạo được tài khoản test

**Triệu chứng:**

```
⚠️  Could not create auth account (may already exist)
```

**Nguyên nhân:** Tài khoản đã tồn tại hoặc emulator chưa sẵn sàng

**Giải pháp:**

```bash
# Kiểm tra emulator đang chạy
lsof -i :9099

# Nếu chưa chạy, khởi động lại
./stop-dev.sh
./start-dev.sh
```

### Lỗi 6: Dữ liệu bị mất

**Triệu chứng:** Đăng nhập không được, không tìm thấy user

**Nguyên nhân:** Emulator đã tắt, dữ liệu bị xóa

**Giải pháp:**

```bash
# Chạy lại script để seed data tự động
./stop-dev.sh
./start-dev.sh
```

### Lỗi 7: "Index not defined"

**Triệu chứng:**

```
Index not defined, add ".indexOn": "email", for path "/users"
```

**Nguyên nhân:** Database rules chưa load

**Giải pháp:**

```bash
# Restart emulators
./stop-dev.sh
sleep 3
./start-dev.sh
```

---

## 📝 PHẦN 5: WORKFLOW KHUYẾN NGHỊ

### Workflow hàng ngày

#### **Sáng - Bắt đầu làm việc:**

```bash
# Bước 1: Mở terminal
cd ~/green-bank-app-main

# Bước 2: Khởi động hệ thống
./start-dev.sh

# Bước 3: Đợi 10-15 giây

# Bước 4: Mở browser
# http://localhost:5175/

# Bước 5: Đăng nhập
# Email: thehoang.acc@gmail.com
# Password: Thedeptrai1

# Bước 6: Bắt đầu test/develop
```

#### **Tối - Kết thúc làm việc:**

```bash
# Cách 1: Nhấn Ctrl+C trong terminal đang chạy

# Cách 2: Chạy script
./stop-dev.sh
```

### Workflow khi gặp lỗi

```bash
# Bước 1: Dừng tất cả
./stop-dev.sh

# Bước 2: Đợi 3 giây
sleep 3

# Bước 3: Chạy lại
./start-dev.sh

# Bước 4: Nếu vẫn lỗi, kiểm tra logs
cat firebase-debug.log
```

---

## 🎯 PHẦN 6: CHECKLIST

### Checklist tắt hệ thống

- [ ] Chạy `./stop-dev.sh`
- [ ] Đợi thông báo "✅ All services stopped"
- [ ] Xác nhận: `lsof -i :5175` không có output
- [ ] Xác nhận: `lsof -i :9099` không có output
- [ ] Xác nhận: `lsof -i :9000` không có output
- [ ] Xác nhận: `lsof -i :8080` không có output

### Checklist chạy lại hệ thống

- [ ] Đảm bảo hệ thống đã tắt hoàn toàn
- [ ] Chạy `./start-dev.sh`
- [ ] Đợi thông báo "🎉 VietBank Development Environment Ready!"
- [ ] Xác nhận: `lsof -i :5175` có output
- [ ] Xác nhận: `lsof -i :9099` có output
- [ ] Xác nhận: `lsof -i :9000` có output
- [ ] Xác nhận: `lsof -i :8080` có output
- [ ] Mở browser: `http://localhost:5175/`
- [ ] Đăng nhập thành công
- [ ] Kiểm tra số dư: 10,000,000 VND

---

## 📊 PHẦN 7: THÔNG TIN KỸ THUẬT

### Ports sử dụng

| Port | Service             | Protocol  |
| ---- | ------------------- | --------- |
| 5175 | Vite Dev Server     | HTTP      |
| 9099 | Auth Emulator       | HTTP      |
| 9000 | Database Emulator   | HTTP      |
| 8080 | Firestore Emulator  | HTTP      |
| 4000 | Emulator UI         | HTTP      |
| 4400 | Emulator Hub        | HTTP      |
| 9150 | Firestore WebSocket | WebSocket |

### Process hierarchy

```
Terminal 1:
  └─> npm exec firebase (PID: 39605)
      └─> node firebase emulators (PID: 39625)
          ├─> java Firestore Emulator (PID: 39683)
          └─> java Database Emulator (PID: 39696)

Terminal 2:
  └─> npm run dev (PID: 28920)
      └─> node vite (PID: 28939)
          └─> esbuild (PID: 28940)
```

### Tài khoản test

```
Email:    thehoang.acc@gmail.com
Password: Thedeptrai1
Balance:  10,000,000 VND
PIN:      1234
eKYC:     VERIFIED
Role:     CUSTOMER
Status:   ACTIVE
```

---

## 🆘 PHẦN 8: KHI CẦN TRỢ GIÚP

### Tài liệu tham khảo

- `HUONG_DAN_KHOI_DONG_CHI_TIET.md` - Hướng dẫn khởi động chi tiết
- `STARTUP_GUIDE.md` - Hướng dẫn tổng quan
- `TROUBLESHOOTING_LOGIN.md` - Khắc phục lỗi đăng nhập
- `README.md` - Tổng quan dự án

### Kiểm tra logs

```bash
# Firebase logs
cat firebase-debug.log | tail -50

# Database logs
cat database-debug.log | tail -50
```

### Test nhanh

```bash
# Test emulators
curl http://127.0.0.1:9099/
curl http://127.0.0.1:9000/.json?ns=vietbank-final-default-rtdb
curl http://127.0.0.1:8080/

# Test Vite
curl http://localhost:5175/
```

---

## ✅ TÓM TẮT

### Tắt hệ thống:

```bash
./stop-dev.sh
```

### Chạy lại hệ thống:

```bash
./start-dev.sh
```

### Nếu có lỗi:

```bash
./stop-dev.sh
sleep 3
./start-dev.sh
```

---

**🎉 CHÚC ANH LÀM VIỆC HIỆU QUẢ! 🚀**

---

**Người kiểm tra:** Kiro AI Assistant  
**Ngày kiểm tra:** 08/05/2026  
**Trạng thái:** Đã kiểm tra chi tiết và xác nhận hoạt động  
**Phiên bản:** 1.0 - Chi tiết đầy đủ

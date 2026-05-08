# 📖 HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG VIETBANK - CHI TIẾT TỪNG BƯỚC

**Ngày:** 08/05/2026  
**Người hướng dẫn:** Kiro AI Assistant  
**Dành cho:** Anh Minh Quân

---

## 🎯 MỤC TIÊU

Hướng dẫn anh khởi động hệ thống VietBank một cách **chính xác, đầy đủ và không bị lỗi**.

---

## ✅ KIỂM TRA TRẠNG THÁI HIỆN TẠI

### Bước 0: Kiểm tra hệ thống đang chạy

Em đã kiểm tra và thấy:

**✅ Services đang chạy:**

- Auth Emulator: Port 9099 ✅ (PID: 39625)
- Database Emulator: Port 9000 ✅ (PID: 39696)
- Firestore Emulator: Port 8080 ✅ (PID: 39683)
- Vite Dev Server: Port 5175 ✅ (PID: 28939)

**✅ Dữ liệu đã có:**

- User: `thehoang.acc@gmail.com` (UID: kkLrofQ7rxFEvVLu8qWv7JK3jTR6)
- Account: `100000000001` (Balance: 10,000,000 VND)

**✅ Cấu hình đúng:**

- `.env` có cấu hình emulator
- `database.rules.emulator.json` có indexes
- Scripts `start-dev.sh` và `stop-dev.sh` sẵn sàng

**🎉 KẾT LUẬN: Hệ thống đang chạy hoàn hảo!**

---

## 🚀 HƯỚNG DẪN KHỞI ĐỘNG TỪ ĐẦU

### Trường hợp 1: Hệ thống đang chạy (như hiện tại)

**Anh chỉ cần:**

1. Mở trình duyệt: `http://localhost:5175/`
2. Đăng nhập với:
   - Email: `thehoang.acc@gmail.com`
   - Password: `Thedeptrai1`
3. Bắt đầu test! 🎉

**Không cần làm gì thêm!**

---

### Trường hợp 2: Hệ thống chưa chạy (sau khi tắt máy/restart)

#### **CÁCH 1: TỰ ĐỘNG (KHUYẾN NGHỊ) ⭐**

**Bước 1:** Mở Terminal

**Bước 2:** Di chuyển đến thư mục project

```bash
cd ~/green-bank-app-main
```

**Bước 3:** Chạy script tự động

```bash
./start-dev.sh
```

**Bước 4:** Đợi ~10-15 giây

Anh sẽ thấy màn hình như này:

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

**Bước 5:** Mở trình duyệt và đăng nhập

- URL: `http://localhost:5175/`
- Email: `thehoang.acc@gmail.com`
- Password: `Thedeptrai1`

**XONG! 🎉**

---

#### **CÁCH 2: THỦ CÔNG (Nếu script không chạy được)**

**Bước 1:** Mở Terminal thứ nhất - Khởi động Emulators

```bash
cd ~/green-bank-app-main
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

Đợi đến khi thấy:

```
✔  All emulators ready! It is now safe to connect your app.
```

**Bước 2:** Mở Terminal thứ hai - Tạo tài khoản test

```bash
# 2.1. Tạo Auth account
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}'
```

Anh sẽ nhận được response có dạng:

```json
{
  "localId": "abc123xyz456",
  "email": "thehoang.acc@gmail.com",
  ...
}
```

**LƯU Ý:** Copy giá trị `localId` (đây là UID)

**Bước 3:** Seed dữ liệu user profile

**QUAN TRỌNG:** Thay `YOUR_UID` bằng UID vừa copy ở bước 2

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

**Bước 4:** Seed dữ liệu bank account

**QUAN TRỌNG:** Thay `YOUR_UID` bằng UID vừa copy

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

**Bước 5:** Tạo CIF counter

```bash
curl -X PUT "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{"cifCounter": 1}'
```

**Bước 6:** Mở Terminal thứ ba - Khởi động Vite

```bash
cd ~/green-bank-app-main
npm run dev
```

Đợi đến khi thấy:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5175/
  ➜  Network: use --host to expose
```

**Bước 7:** Mở trình duyệt và đăng nhập

- URL: `http://localhost:5175/`
- Email: `thehoang.acc@gmail.com`
- Password: `Thedeptrai1`

**XONG! 🎉**

---

## 🛑 CÁCH DỪNG HỆ THỐNG

### Cách 1: Dùng script (Khuyến nghị)

```bash
./stop-dev.sh
```

### Cách 2: Thủ công

**Nếu dùng script tự động:**

- Nhấn `Ctrl+C` trong terminal đang chạy `start-dev.sh`

**Nếu dùng cách thủ công:**

- Nhấn `Ctrl+C` trong terminal chạy Vite
- Nhấn `Ctrl+C` trong terminal chạy Emulators

### Cách 3: Kill processes

```bash
# Kill Vite
lsof -ti:5175 | xargs kill -9

# Kill Emulators
lsof -ti:9099 | xargs kill -9
lsof -ti:9000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

---

## 🔍 KIỂM TRA HỆ THỐNG

### Kiểm tra services đang chạy

```bash
# Auth Emulator
lsof -i :9099

# Database Emulator
lsof -i :9000

# Firestore Emulator
lsof -i :8080

# Vite Dev Server
lsof -i :5175
```

**Nếu có output → Service đang chạy ✅**  
**Nếu không có output → Service chưa chạy ❌**

### Kiểm tra dữ liệu

```bash
# Xem users
curl -s "http://127.0.0.1:9000/users.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Xem accounts
curl -s "http://127.0.0.1:9000/accounts.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Xem counters
curl -s "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool
```

### Kiểm tra browser console

Mở browser console (F12), anh sẽ thấy:

```
[firebase] 🔧 Initializing with emulator mode...
[firebase] Connecting Firestore to emulator: 127.0.0.1:8080
[firebase] ✅ Firestore connected to emulator
[firebase] Connecting Realtime Database to emulator: 127.0.0.1:9000
[firebase] ✅ Realtime Database connected to emulator
[firebase] Auth emulator enabled
```

---

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Port already in use"

**Nguyên nhân:** Services đã chạy từ trước

**Giải pháp:**

```bash
./stop-dev.sh
./start-dev.sh
```

### Lỗi 2: "Permission denied" khi chạy script

**Nguyên nhân:** Script chưa có quyền execute

**Giải pháp:**

```bash
chmod +x start-dev.sh
chmod +x stop-dev.sh
```

### Lỗi 3: "Cannot find module"

**Nguyên nhân:** Chưa cài dependencies

**Giải pháp:**

```bash
npm install
```

### Lỗi 4: "Đăng nhập không đúng"

**Nguyên nhân:** Dữ liệu emulator bị mất

**Giải pháp:**

```bash
./stop-dev.sh
./start-dev.sh
```

### Lỗi 5: "Index not defined"

**Nguyên nhân:** Database rules chưa load

**Giải pháp:**

```bash
# Restart emulators
./stop-dev.sh
./start-dev.sh
```

### Lỗi 6: "Permission denied" trong console

**Nguyên nhân:** Kết nối đến Production thay vì Emulator

**Giải pháp:**

1. Kiểm tra `.env` có đúng cấu hình:

```
VITE_USE_FUNCTIONS_EMULATOR=true
VITE_USE_AUTH_EMULATOR=true
```

2. Restart Vite:

```bash
# Nhấn Ctrl+C trong terminal Vite
npm run dev
```

---

## 📊 WORKFLOW HÀNG NGÀY

### Sáng - Bắt đầu làm việc

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

### Tối - Kết thúc làm việc

```bash
# Cách 1: Nhấn Ctrl+C trong terminal

# Cách 2: Chạy script
./stop-dev.sh
```

---

## 🎯 CHECKLIST KHỞI ĐỘNG

Anh làm theo thứ tự này:

- [ ] **Bước 1:** Mở Terminal
- [ ] **Bước 2:** `cd ~/green-bank-app-main`
- [ ] **Bước 3:** `./start-dev.sh`
- [ ] **Bước 4:** Đợi thông báo "VietBank Development Environment Ready!"
- [ ] **Bước 5:** Mở browser: `http://localhost:5175/`
- [ ] **Bước 6:** Đăng nhập với `thehoang.acc@gmail.com` / `Thedeptrai1`
- [ ] **Bước 7:** Kiểm tra số dư: 10,000,000 VND
- [ ] **Bước 8:** Bắt đầu test các tính năng

---

## 📝 GHI CHÚ QUAN TRỌNG

### 1. Dữ liệu Emulator không lưu trữ

**Khi nào mất:**

- ❌ Tắt emulator (Ctrl+C)
- ❌ Restart máy tính
- ❌ Chạy lại emulator

**Giải pháp:**

- Chạy `./start-dev.sh` mỗi lần khởi động
- Script tự động tạo lại data

### 2. Tài khoản test cố định

```
Email:    thehoang.acc@gmail.com
Password: Thedeptrai1
Balance:  10,000,000 VND
PIN:      1234
eKYC:     VERIFIED
```

### 3. Ports sử dụng

```
9099  - Auth Emulator
9000  - Database Emulator
8080  - Firestore Emulator
4000  - Emulator UI
5175  - Vite Dev Server
```

### 4. Scripts có sẵn

```bash
npm run dev        # Chỉ Vite (cần emulators chạy trước)
npm run dev:full   # Tự động khởi động tất cả
npm run stop       # Dừng tất cả services
```

---

## 🆘 KHI CẦN TRỢ GIÚP

### Tài liệu tham khảo

- `STARTUP_GUIDE.md` - Hướng dẫn tổng quan
- `TROUBLESHOOTING_LOGIN.md` - Khắc phục lỗi đăng nhập
- `README.md` - Tổng quan dự án

### Kiểm tra logs

```bash
# Xem logs emulator
cat firebase-debug.log

# Xem logs database
cat database-debug.log
```

### Test nhanh

Nếu không chắc hệ thống hoạt động, chạy:

```bash
# Kiểm tra emulators
curl http://127.0.0.1:9099/

# Kiểm tra database
curl http://127.0.0.1:9000/.json?ns=vietbank-final-default-rtdb

# Kiểm tra Vite
curl http://localhost:5175/
```

---

## ✅ TÓM TẮT

**Cách nhanh nhất:**

```bash
./start-dev.sh
# Đợi 10 giây
# Mở http://localhost:5175/
# Đăng nhập: thehoang.acc@gmail.com / Thedeptrai1
```

**Cách dừng:**

```bash
./stop-dev.sh
# Hoặc Ctrl+C
```

**Nếu có lỗi:**

```bash
./stop-dev.sh
./start-dev.sh
```

---

**🎉 CHÚC ANH LÀM VIỆC HIỆU QUẢ! 🚀**

---

**Người tạo:** Kiro AI Assistant  
**Ngày tạo:** 08/05/2026  
**Phiên bản:** 1.0 - Chi tiết đầy đủ

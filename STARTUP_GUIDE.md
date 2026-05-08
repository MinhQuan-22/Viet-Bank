# 🚀 Hướng Dẫn Khởi Động Hệ Thống VietBank

**Cập nhật:** 2026-05-08  
**Phiên bản:** 2.0 - Tự động hoàn toàn

---

## ⚡ Cách Nhanh Nhất (Khuyến Nghị)

### Khởi Động Hệ Thống

Chỉ cần chạy **1 lệnh duy nhất**:

```bash
./start-dev.sh
```

Hoặc:

```bash
npm run dev:full
```

**Script sẽ tự động:**

1. ✅ Khởi động Firebase Emulators (Auth, Firestore, Database)
2. ✅ Tạo tài khoản test
3. ✅ Seed dữ liệu (user profile, bank account, counter)
4. ✅ Khởi động Vite dev server
5. ✅ Hiển thị thông tin đăng nhập

**Thời gian:** ~10-15 giây

---

### Dừng Hệ Thống

```bash
./stop-dev.sh
```

Hoặc:

```bash
npm run stop
```

**Script sẽ tự động:**

1. ✅ Dừng Vite dev server
2. ✅ Dừng tất cả Firebase Emulators
3. ✅ Giải phóng tất cả ports

---

## 📋 Sau Khi Khởi Động

### Thông Tin Hiển Thị

```
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

### Đăng Nhập Ngay

1. Mở trình duyệt: `http://localhost:5175/`
2. Nhập:
   - Email: `thehoang.acc@gmail.com`
   - Password: `Thedeptrai1`
3. Nhấn "Đăng nhập"
4. Thành công! 🎉

---

## 🔧 Cách Thủ Công (Nếu Cần)

### Bước 1: Khởi Động Emulators

```bash
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

Đợi đến khi thấy:

```
✔  All emulators ready! It is now safe to connect your app.
```

### Bước 2: Tạo Tài Khoản Test

Mở terminal mới và chạy:

```bash
# 1. Tạo Auth account
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}'

# Lấy UID từ response (ví dụ: abc123xyz)

# 2. Tạo user profile (thay YOUR_UID bằng UID vừa lấy)
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

# 3. Tạo bank account
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

# 4. Tạo counter
curl -X PUT "http://127.0.0.1:9000/counters.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{"cifCounter": 1}'
```

### Bước 3: Khởi Động Vite

Mở terminal mới:

```bash
npm run dev
```

### Bước 4: Truy Cập

Mở trình duyệt: `http://localhost:5175/`

---

## 🔍 Kiểm Tra Trạng Thái

### Kiểm Tra Services Đang Chạy

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

### Kiểm Tra Dữ Liệu

```bash
# Xem users
curl -s "http://127.0.0.1:9000/users.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Xem accounts
curl -s "http://127.0.0.1:9000/accounts.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool
```

---

## ⚠️ Xử Lý Lỗi

### Lỗi: Port Already in Use

**Nguyên nhân:** Services đã chạy từ trước

**Giải pháp:**

```bash
# Dừng tất cả
./stop-dev.sh

# Hoặc kill thủ công
lsof -ti:9099 | xargs kill -9
lsof -ti:9000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:5175 | xargs kill -9

# Sau đó khởi động lại
./start-dev.sh
```

### Lỗi: Permission Denied khi chạy script

**Giải pháp:**

```bash
chmod +x start-dev.sh
chmod +x stop-dev.sh
```

### Lỗi: Cannot find module

**Giải pháp:**

```bash
npm install
```

---

## 📝 Lưu Ý Quan Trọng

### 1. Dữ Liệu Emulator Không Lưu Trữ

**Khi nào mất:**

- ❌ Tắt emulator (Ctrl+C hoặc `./stop-dev.sh`)
- ❌ Restart máy tính
- ❌ Chạy lại emulator

**Giải pháp:**

- Chạy `./start-dev.sh` mỗi lần khởi động → Tự động seed data
- Hoặc dùng export/import (xem phần dưới)

### 2. Export/Import Data (Tùy chọn)

**Export data trước khi tắt:**

```bash
firebase emulators:export ./emulator-data
```

**Import data khi khởi động:**

```bash
firebase emulators:start --import=./emulator-data --only firestore,auth,database
```

### 3. Development vs Production

| Aspect       | Development          | Production          |
| ------------ | -------------------- | ------------------- |
| **Auth**     | Emulator (9099)      | Firebase Cloud      |
| **Database** | Emulator (9000)      | Firebase Cloud      |
| **Data**     | Temporary            | Permanent           |
| **Rules**    | Open (emulator.json) | Strict (rules.json) |

---

## 🎯 Workflow Hàng Ngày

### Bắt Đầu Làm Việc

```bash
# 1. Khởi động hệ thống
./start-dev.sh

# 2. Đợi ~10 giây

# 3. Mở browser: http://localhost:5175/

# 4. Đăng nhập và bắt đầu test
```

### Kết Thúc Làm Việc

```bash
# 1. Nhấn Ctrl+C trong terminal đang chạy start-dev.sh

# Hoặc

# 2. Chạy script dừng
./stop-dev.sh
```

---

## 📚 Scripts Có Sẵn

| Script               | Lệnh                                     | Mô tả                                         |
| -------------------- | ---------------------------------------- | --------------------------------------------- |
| **Khởi động đầy đủ** | `./start-dev.sh` hoặc `npm run dev:full` | Khởi động emulators + seed data + vite        |
| **Dừng hệ thống**    | `./stop-dev.sh` hoặc `npm run stop`      | Dừng tất cả services                          |
| **Chỉ Vite**         | `npm run dev`                            | Chỉ khởi động Vite (cần emulators chạy trước) |
| **Chỉ Emulators**    | `npm run emulator:only`                  | Chỉ khởi động emulators                       |

---

## ✅ Checklist Khởi Động

- [ ] Chạy `./start-dev.sh`
- [ ] Đợi thông báo "VietBank Development Environment Ready!"
- [ ] Mở browser: `http://localhost:5175/`
- [ ] Đăng nhập với `thehoang.acc@gmail.com` / `Thedeptrai1`
- [ ] Kiểm tra số dư: 10,000,000 VND
- [ ] Bắt đầu test các tính năng

---

## 🆘 Cần Trợ Giúp?

### Tài Liệu Tham Khảo

- `LOGIN_SUCCESS.md` - Hướng dẫn đăng nhập chi tiết
- `TROUBLESHOOTING_LOGIN.md` - Khắc phục lỗi đăng nhập
- `AUTH_EMULATOR_SETUP.md` - Setup emulator chi tiết
- `CURRENT_LOGIN_STATUS.md` - Trạng thái hệ thống

### Test Page

Nếu gặp vấn đề đăng nhập, test trước với:

```
http://localhost:5175/test-auth.html
```

---

**Chúc anh làm việc hiệu quả! 🚀**

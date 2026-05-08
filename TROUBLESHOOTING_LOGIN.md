# 🔧 Khắc Phục Lỗi Đăng Nhập VietBank

**Cập nhật:** 2026-05-08  
**Trạng thái:** ✅ Đã giải quyết hoàn toàn

---

## 📋 Tóm Tắt Các Lỗi Đã Khắc Phục

### 1. ❌ Lỗi: "Đăng nhập không đúng" (Đã fix)

**Nguyên nhân:**

- Hệ thống kết nối đến Firebase Auth Production thay vì Emulator
- Tài khoản test không tồn tại trên Production

**Giải pháp:**

- Cấu hình `.env` để sử dụng Auth Emulator
- Thêm `VITE_USE_AUTH_EMULATOR=true`
- Thêm `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`

**Commit:** `678bad6`

---

### 2. ❌ Lỗi: "Permission denied" (Đã fix)

**Nguyên nhân:**

- Realtime Database không kết nối đến Emulator
- Kết nối đến Production Database với rules nghiêm ngặt

**Giải pháp:**

- Thêm `connectDatabaseEmulator()` vào `src/lib/firebase.ts`
- Kết nối đến `127.0.0.1:9000`

**Commit:** `7a6a08f`

---

### 3. ❌ Lỗi: "Index not defined" cho email (Đã fix)

**Lỗi đầy đủ:**

```
Index not defined, add ".indexOn": "email", for path "/users", to the rules
```

**Nguyên nhân:**

- Database rules thiếu index cho trường `email` trong `/users`

**Giải pháp:**

- Thêm `.indexOn: ["email"]` vào `database.rules.emulator.json`

```json
{
  "rules": {
    "users": {
      ".indexOn": ["email"]
    }
  }
}
```

**Commit:** `5b60eda`

---

### 4. ❌ Lỗi: "Index not defined" cho uid (Đã fix)

**Lỗi đầy đủ:**

```
Index not defined, add ".indexOn": "uid", for path "/accounts", to the rules
```

**Nguyên nhân:**

- Database rules thiếu index cho trường `uid` trong `/accounts`

**Giải pháp:**

- Thêm `.indexOn: ["uid"]` vào `database.rules.emulator.json`

```json
{
  "rules": {
    "accounts": {
      ".indexOn": ["uid"]
    }
  }
}
```

**Commit:** `5b60eda`

---

## ✅ Trạng Thái Hiện Tại

### Hệ Thống Hoạt Động Hoàn Toàn

- ✅ Auth Emulator kết nối thành công (127.0.0.1:9099)
- ✅ Database Emulator kết nối thành công (127.0.0.1:9000)
- ✅ Firestore Emulator kết nối thành công (127.0.0.1:8080)
- ✅ Database indexes đã được cấu hình đúng
- ✅ Đăng nhập thành công với tài khoản test
- ✅ Load dữ liệu user và account thành công

### Tài Khoản Test

```
Email:    thehoang.acc@gmail.com
Password: Thedeptrai1
Balance:  10,000,000 VND
PIN:      1234
eKYC:     VERIFIED
```

---

## 🚀 Cách Khởi Động Hệ Thống

### Cách Tự Động (Khuyến nghị)

```bash
./start-dev.sh
```

Hoặc:

```bash
npm run dev:full
```

**Script sẽ tự động:**

1. Khởi động Firebase Emulators
2. Tạo tài khoản test
3. Seed dữ liệu
4. Khởi động Vite dev server

### Cách Thủ Công

**Bước 1:** Khởi động Emulators

```bash
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

**Bước 2:** Tạo tài khoản test (terminal mới)

```bash
# Tạo Auth account
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}'

# Lấy UID từ response, sau đó seed data (xem STARTUP_GUIDE.md)
```

**Bước 3:** Khởi động Vite

```bash
npm run dev
```

---

## 🔍 Kiểm Tra Lỗi

### Kiểm Tra Emulator Đang Chạy

```bash
# Auth Emulator
lsof -i :9099

# Database Emulator
lsof -i :9000

# Firestore Emulator
lsof -i :8080
```

### Kiểm Tra Kết Nối Emulator

Mở browser console khi load trang, bạn sẽ thấy:

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

### Kiểm Tra Dữ Liệu

```bash
# Xem users
curl -s "http://127.0.0.1:9000/users.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Xem accounts
curl -s "http://127.0.0.1:9000/accounts.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool
```

---

## ⚠️ Các Lỗi Thường Gặp

### Lỗi: "Port already in use"

**Nguyên nhân:** Services đã chạy từ trước

**Giải pháp:**

```bash
./stop-dev.sh
# Sau đó
./start-dev.sh
```

### Lỗi: "Cannot find user"

**Nguyên nhân:** Dữ liệu emulator bị mất (đã tắt emulator)

**Giải pháp:**

```bash
# Khởi động lại và seed data tự động
./start-dev.sh
```

### Lỗi: "Index not defined"

**Nguyên nhân:** Database rules chưa có index

**Giải pháp:**

- Kiểm tra `database.rules.emulator.json` có indexes:

```json
{
  "rules": {
    "users": {
      ".indexOn": ["email"]
    },
    "accounts": {
      ".indexOn": ["uid"]
    }
  }
}
```

- Restart emulators

### Lỗi: "Permission denied"

**Nguyên nhân:** Kết nối đến Production thay vì Emulator

**Giải pháp:**

- Kiểm tra `.env` có:

```
VITE_USE_FUNCTIONS_EMULATOR=true
VITE_USE_AUTH_EMULATOR=true
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
```

- Restart Vite dev server

---

## 📚 Tài Liệu Liên Quan

- `STARTUP_GUIDE.md` - Hướng dẫn khởi động chi tiết
- `README.md` - Tổng quan dự án
- `docs/PROJECT_OVERVIEW.md` - Kiến trúc hệ thống

---

## 🎯 Checklist Khắc Phục Lỗi

Nếu gặp lỗi đăng nhập, kiểm tra theo thứ tự:

- [ ] Emulators đang chạy? (`lsof -i :9099`, `lsof -i :9000`)
- [ ] `.env` có cấu hình emulator đúng?
- [ ] Browser console có log kết nối emulator?
- [ ] Dữ liệu test đã được seed? (check bằng curl)
- [ ] Database rules có indexes đúng?
- [ ] Vite dev server đã restart sau khi thay đổi `.env`?

---

**Nếu vẫn gặp lỗi, chạy lại từ đầu:**

```bash
./stop-dev.sh
./start-dev.sh
```

**Hệ thống sẽ tự động setup lại mọi thứ! 🚀**

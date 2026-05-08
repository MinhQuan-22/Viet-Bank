# Auth Emulator Setup - Hoàn Thành ✅

**Ngày:** 2026-05-08  
**Trạng thái:** Đã cấu hình và khởi động thành công

---

## 🎯 Vấn Đề Ban Đầu

Anh không thể đăng nhập bằng tài khoản `thehoang.acc@gmail.com` / `Thedeptrai1` vì:

1. **Hệ thống đang kết nối Firebase Auth Production** (không phải emulator)
2. **Tài khoản chưa tồn tại** trong Firebase Auth Production
3. **Auth Emulator chưa được cấu hình** trong `.env` và `firebase.json`

---

## ✅ Giải Pháp Đã Thực Hiện

### 1. Cấu Hình Auth Emulator

#### `.env`

```env
VITE_USE_FUNCTIONS_EMULATOR=true
VITE_USE_AUTH_EMULATOR=true                    # ✅ THÊM MỚI
SMTP_EMAIL=your-email@gmail.com
SMTP_PASS=your-app-password
GOOGLE_CLOUD_PROJECT="vietbank-final"
FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"   # ✅ THÊM MỚI
VITE_FUNCTIONS_BASE_URL=http://127.0.0.1:5001/vietbank-final/asia-southeast1
```

#### `firebase.json`

```json
{
  "emulators": {
    "auth": {
      "port": 9099 // ✅ THÊM MỚI
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "database": {
      "port": 9000
    },
    "ui": {
      "enabled": true
    }
  }
}
```

#### `database.rules.emulator.json` (Tạm thời cho development)

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ LƯU Ý:** File này chỉ dùng cho emulator. Production vẫn dùng `database.rules.json` với security rules đầy đủ.

---

### 2. Tạo Tài Khoản Test Trong Emulator

#### Tài Khoản Firebase Auth

- **Email:** `thehoang.acc@gmail.com`
- **Password:** `Thedeptrai1`
- **UID:** `R1giwMEGybsqaE4qGPzxZNX4uorG`

#### Profile Trong Realtime Database (`users/R1giwMEGybsqaE4qGPzxZNX4uorG`)

```json
{
  "uid": "R1giwMEGybsqaE4qGPzxZNX4uorG",
  "username": "Hoang Test",
  "email": "thehoang.acc@gmail.com",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "ekycStatus": "VERIFIED",
  "canTransact": true,
  "createdAt": 1778226271000,
  "phone": "0901234567",
  "gender": "MALE",
  "dob": "1990-01-01",
  "nationalId": "079090001234",
  "idIssueDate": "2020-01-01",
  "placeOfIssue": "Cục Cảnh sát QLHC về TTXH",
  "permanentAddress": "123 Test Street, District 1, HCMC",
  "contactAddress": "123 Test Street, District 1, HCMC",
  "cif": "CIF0001",
  "security": {
    "loginFailCount": 0
  }
}
```

#### Tài Khoản Ngân Hàng (`accounts/100000000001`)

```json
{
  "uid": "R1giwMEGybsqaE4qGPzxZNX4uorG",
  "accountNumber": "100000000001",
  "balance": 10000000,
  "status": "ACTIVE",
  "pin": "1234",
  "createdAt": 1778226271000
}
```

**💰 Số dư:** 10,000,000 VND  
**🔐 PIN giao dịch:** 1234

---

### 3. Khởi Động Hệ Thống

#### Emulators Đang Chạy

```bash
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

**Trạng thái:**

- ✅ **Authentication Emulator:** `127.0.0.1:9099`
- ✅ **Firestore Emulator:** `127.0.0.1:8080`
- ✅ **Realtime Database Emulator:** `127.0.0.1:9000`
- ✅ **Emulator UI:** `http://127.0.0.1:4000/`

#### Vite Dev Server

```bash
npm run dev
```

**URL:** `http://localhost:5175/`

---

## 🎉 Kết Quả

### Bây Giờ Anh Có Thể:

1. **Đăng nhập thành công** với:
   - Email: `thehoang.acc@gmail.com`
   - Password: `Thedeptrai1`

2. **Truy cập tài khoản** với:
   - Số tài khoản: `100000000001`
   - Số dư: 10,000,000 VND
   - PIN: `1234`
   - eKYC: ✅ Đã xác thực (VERIFIED)
   - Quyền giao dịch: ✅ Được phép (canTransact: true)

3. **Xem dữ liệu trong Emulator UI:**
   - Auth: `http://127.0.0.1:4000/auth`
   - Database: `http://127.0.0.1:4000/database`
   - Firestore: `http://127.0.0.1:4000/firestore`

---

## 📝 Lưu Ý Quan Trọng

### Development vs Production

| Môi trường                 | Auth           | Database       | Dữ liệu              |
| -------------------------- | -------------- | -------------- | -------------------- |
| **Development (Emulator)** | Local          | Local          | Mất khi tắt emulator |
| **Production**             | Firebase Cloud | Firebase Cloud | Lưu trữ vĩnh viễn    |

### Khi Nào Dữ Liệu Emulator Bị Mất?

- ❌ Khi tắt emulator (Ctrl+C)
- ❌ Khi restart máy tính
- ❌ Khi chạy lại `firebase emulators:start`

### Cách Giữ Dữ Liệu Emulator (Tùy chọn)

Thêm vào `firebase.json`:

```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "database": {
      "port": 9000
    },
    "ui": {
      "enabled": true,
      "host": "127.0.0.1",
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

Sau đó export/import data:

```bash
# Export
firebase emulators:export ./emulator-data

# Import
firebase emulators:start --import=./emulator-data
```

---

## 🔄 Cách Khởi Động Lại Hệ Thống

### Bước 1: Khởi động Emulators

```bash
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

### Bước 2: Tạo lại tài khoản test (nếu cần)

```bash
# Tạo Auth account
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}'

# Lấy UID từ response, sau đó seed data vào Database
# (Xem chi tiết trong phần "Tạo Tài Khoản Test" ở trên)
```

### Bước 3: Khởi động Vite

```bash
npm run dev
```

### Bước 4: Truy cập ứng dụng

Mở trình duyệt: `http://localhost:5175/`

---

## 🚀 Các Tài Khoản Test Khác (Tùy chọn)

Anh có thể tạo thêm tài khoản test khác:

### Tài Khoản Nhân Viên (OFFICER)

```bash
# 1. Tạo Auth account
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "officer@vietbank.com", "password": "Officer123", "returnSecureToken": true}'

# 2. Lấy UID từ response, giả sử là: ABC123XYZ

# 3. Tạo profile với role="OFFICER"
curl -X PUT "http://127.0.0.1:9000/users/ABC123XYZ.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "ABC123XYZ",
    "username": "Nhân Viên Test",
    "email": "officer@vietbank.com",
    "role": "OFFICER",
    "status": "ACTIVE",
    "createdAt": 1778226271000
  }'
```

---

## 📊 Kiểm Tra Trạng Thái Hệ Thống

### Kiểm tra Emulators đang chạy

```bash
lsof -i :9099  # Auth Emulator
lsof -i :8080  # Firestore Emulator
lsof -i :9000  # Database Emulator
lsof -i :4000  # Emulator UI
```

### Kiểm tra Vite dev server

```bash
lsof -i :5175
```

### Xem logs

- **Emulator logs:** Terminal đang chạy `firebase emulators:start`
- **Vite logs:** Terminal đang chạy `npm run dev`
- **Browser console:** F12 → Console tab

---

## ✅ Checklist Đăng Nhập Thành Công

- [x] Auth Emulator đang chạy trên port 9099
- [x] Database Emulator đang chạy trên port 9000
- [x] Vite dev server đang chạy trên port 5175
- [x] Biến `VITE_USE_AUTH_EMULATOR=true` trong `.env`
- [x] Tài khoản `thehoang.acc@gmail.com` đã tạo trong Auth Emulator
- [x] Profile user đã tạo trong Database Emulator
- [x] Account ngân hàng đã tạo trong Database Emulator
- [x] Browser đã refresh để load biến môi trường mới

---

## 🎯 Bước Tiếp Theo

Anh có thể:

1. **Đăng nhập ngay** tại `http://localhost:5175/`
2. **Xem dữ liệu** trong Emulator UI: `http://127.0.0.1:4000/`
3. **Test các tính năng** như chuyển tiền, nạp tiền điện thoại, v.v.
4. **Tạo thêm tài khoản test** nếu cần

---

**Chúc anh test thành công! 🎉**

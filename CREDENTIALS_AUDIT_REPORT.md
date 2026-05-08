# BÁO CÁO KIỂM TRA TÀI KHOẢN VÀ MẬT KHẨU HỆ THỐNG

**Ngày kiểm tra:** 8 tháng 5, 2026  
**Người thực hiện:** Kiro AI Assistant  
**Mức độ:** KIỂM TRA THẬT KỸ, CẨN THẬN, CHI TIẾT SÂU

---

## 🔍 PHƯƠNG PHÁP KIỂM TRA

Tôi đã thực hiện kiểm tra toàn diện:

1. ✅ Quét tất cả files trong source code
2. ✅ Kiểm tra file `.env` và `.env.example`
3. ✅ Kiểm tra Git history để tìm credentials đã bị commit
4. ✅ Kiểm tra các service files (auth, transfer, ekyc, otp)
5. ✅ Kiểm tra Firebase configuration
6. ✅ Kiểm tra third-party API credentials

---

## 🚨 TÀI KHOẢN VÀ MẬT KHẨU TÌM THẤY

### 1. ⚠️ GMAIL CREDENTIALS (ĐÃ BỊ LỘ TRONG GIT HISTORY)

**Trạng thái:** 🔴 **NGUY HIỂM - ĐÃ BỊ LỘ**

**Thông tin:**

- **Email:** `thehoang.acc@gmail.com`
- **Password:** `Thedeptrai1`
- **Mục đích:** SMTP email service (gửi OTP, notifications)

**Vị trí:**

- ❌ **Git History:** Commit `47f6774f` (đã bị commit vào Git)
- ✅ **File hiện tại:** `.env` - ĐÃ ĐƯỢC THAY THẾ bằng placeholder
- ✅ **Template:** `.env.example` - Chỉ có placeholder

**Mức độ rủi ro:** 🔴 **CỰC KỲ NGUY HIỂM**

- Mật khẩu VẪN CÒN trong Git history
- Bất kỳ ai clone repository đều có thể xem
- Tài khoản Gmail có thể bị xâm nhập
- Có thể gửi spam/phishing từ email này

**Hành động cần làm NGAY:**

1. ✅ **ĐÃ LÀM:** Thay thế credentials trong `.env` hiện tại
2. ⚠️ **CHƯA LÀM:** Đổi mật khẩu Gmail `thehoang.acc@gmail.com`
3. ⚠️ **CHƯA LÀM:** Bật 2FA cho Gmail
4. ⚠️ **CHƯA LÀM:** Kiểm tra lịch sử đăng nhập Gmail
5. ⚠️ **TÙY CHỌN:** Xóa khỏi Git history bằng `git filter-repo`

---

### 2. 🔑 FIREBASE API KEY (PUBLIC - AN TOÀN)

**Trạng thái:** 🟡 **CÔNG KHAI - CẦN BẢO VỆ BẰNG RULES**

**Thông tin:**

- **API Key:** `AIzaSyBaBxbCTIyyQ66zaYxlyrlDWMUSR0XVyuk`
- **Project ID:** `vietbank-final`
- **Auth Domain:** `vietbank-final.firebaseapp.com`
- **Database URL:** `https://vietbank-final-default-rtdb.asia-southeast1.firebasedatabase.app`

**Vị trí:**

- `src/lib/firebase.ts` (line 17)

**Mức độ rủi ro:** 🟡 **TRUNG BÌNH**

- Firebase API key được thiết kế để public
- NHƯNG cần bảo vệ bằng Security Rules (✅ ĐÃ SỬA)
- Cần giới hạn domain và bật App Check

**Hành động đã làm:**

- ✅ Đã viết lại Firestore Security Rules
- ✅ Đã cải thiện Realtime Database Rules

**Hành động cần làm:**

- ⚠️ Giới hạn API key theo domain trong Firebase Console
- ⚠️ Bật App Check để chống bot

---

### 3. 📧 EMAILJS CREDENTIALS (HARDCODED - CẦN DI CHUYỂN)

**Trạng thái:** 🟡 **HARDCODED - NÊN DI CHUYỂN VÀO ENV**

**Thông tin:**

- **Service ID:** `service_zw6iy8k`
- **Template ID:** `template_gjbyxqg`
- **Public Key:** `lGlHvgbAvmq1lnswI`
- **Mục đích:** Gửi OTP email qua EmailJS

**Vị trí:**

- `src/services/otpService.ts` (lines 7-9)

**Mức độ rủi ro:** 🟡 **TRUNG BÌNH**

- Public key được thiết kế để dùng ở client-side
- NHƯNG nên di chuyển vào environment variables
- Có thể bị abuse nếu không giới hạn rate limit

**Khuyến nghị:**

```typescript
// Thay vì hardcode:
const SERVICE_ID = "service_zw6iy8k";

// Nên dùng:
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
```

**Hành động cần làm:**

- ⚠️ Di chuyển credentials vào `.env`
- ⚠️ Cập nhật `.env.example`
- ⚠️ Cập nhật code để đọc từ environment variables
- ⚠️ Bật rate limiting trong EmailJS dashboard

---

### 4. ☁️ CLOUDINARY CREDENTIALS (HARDCODED - CẦN DI CHUYỂN)

**Trạng thái:** 🟡 **HARDCODED - NÊN DI CHUYỂN VÀO ENV**

**Thông tin:**

- **Cloud Name:** `dndzpcykq`
- **Upload Preset:** `vietbank_unsigned`
- **Mục đích:** Upload ảnh eKYC (CMND, selfie)

**Vị trí:**

- `src/services/ekycService.ts` (lines 15-16)

**Mức độ rủi ro:** 🟡 **TRUNG BÌNH**

- Upload preset "unsigned" cho phép upload không cần authentication
- Có thể bị abuse để upload spam images
- Tốn storage và bandwidth

**Khuyến nghị:**

```typescript
// Thay vì hardcode:
const CLOUDINARY_CLOUD_NAME = "dndzpcykq";

// Nên dùng:
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
```

**Hành động cần làm:**

- ⚠️ Di chuyển credentials vào `.env`
- ⚠️ Cập nhật `.env.example`
- ⚠️ Cập nhật code để đọc từ environment variables
- ⚠️ Xem xét chuyển sang signed upload
- ⚠️ Bật upload restrictions trong Cloudinary dashboard

---

### 5. 🔐 DEV SEED SECRET (CHỈ DÙNG CHO EMULATOR)

**Trạng thái:** 🟢 **AN TOÀN - CHỈ DÙNG LOCAL**

**Thông tin:**

- **Secret:** `dev-secret`
- **Mục đích:** Seed data vào Firebase Emulator

**Vị trí:**

- `scripts/seed-emulator.js` (line 38)
- `scripts/start-emulator-with-seed.cjs` (line 71)

**Mức độ rủi ro:** 🟢 **THẤP**

- Chỉ dùng cho local development
- Không ảnh hưởng production
- Emulator không expose ra internet

---

### 6. 🔒 USER PASSWORDS (ĐƯỢC MÃ HÓA AN TOÀN)

**Trạng thái:** 🟢 **AN TOÀN - FIREBASE AUTH QUẢN LÝ**

**Thông tin:**

- Mật khẩu người dùng được lưu trong Firebase Authentication
- Firebase tự động hash và encrypt passwords
- Không có mật khẩu nào được lưu dạng plain text trong code

**Vị trí:**

- Firebase Authentication service (cloud)
- Không có trong source code

**Mức độ rủi ro:** 🟢 **THẤP**

- Firebase Auth sử dụng bcrypt/scrypt để hash passwords
- Passwords không bao giờ được lưu plain text
- Không thể reverse engineer từ hash

**Lưu ý:**

- ⚠️ Code có lưu biometric credentials trong localStorage (DEMO ONLY)
- File: `src/services/authService.ts` (line 257-375)
- Comment rõ: "Production: phải dùng Secure Enclave/Keystore"

---

## 📊 TỔNG KẾT

### Credentials tìm thấy:

| #   | Loại             | Trạng thái       | Rủi ro           | Hành động                   |
| --- | ---------------- | ---------------- | ---------------- | --------------------------- |
| 1   | Gmail SMTP       | 🔴 Đã bị lộ      | CỰC KỲ NGUY HIỂM | Đổi password NGAY           |
| 2   | Firebase API Key | 🟡 Public        | Trung bình       | Giới hạn domain + App Check |
| 3   | EmailJS          | 🟡 Hardcoded     | Trung bình       | Di chuyển vào .env          |
| 4   | Cloudinary       | 🟡 Hardcoded     | Trung bình       | Di chuyển vào .env          |
| 5   | Dev Secret       | 🟢 Local only    | Thấp             | Không cần làm gì            |
| 6   | User Passwords   | 🟢 Firebase Auth | Thấp             | Không cần làm gì            |

---

## 🎯 HÀNH ĐỘNG ƯU TIÊN

### 🔴 KHẨN CẤP (Làm ngay hôm nay):

#### 1. Đổi mật khẩu Gmail

```
Email: thehoang.acc@gmail.com
Password cũ: Thedeptrai1 (ĐÃ BỊ LỘ)

Bước 1: Truy cập https://myaccount.google.com/security
Bước 2: Click "Password" → Đổi mật khẩu mới
Bước 3: Bật 2FA (Two-Factor Authentication)
Bước 4: Kiểm tra lịch sử đăng nhập
Bước 5: Cập nhật .env với password mới
```

### 🟡 QUAN TRỌNG (Làm trong tuần này):

#### 2. Di chuyển EmailJS credentials vào .env

```bash
# Thêm vào .env
VITE_EMAILJS_SERVICE_ID=service_zw6iy8k
VITE_EMAILJS_TEMPLATE_ID=template_gjbyxqg
VITE_EMAILJS_PUBLIC_KEY=lGlHvgbAvmq1lnswI

# Cập nhật code trong src/services/otpService.ts
```

#### 3. Di chuyển Cloudinary credentials vào .env

```bash
# Thêm vào .env
VITE_CLOUDINARY_CLOUD_NAME=dndzpcykq
VITE_CLOUDINARY_UPLOAD_PRESET=vietbank_unsigned

# Cập nhật code trong src/services/ekycService.ts
```

#### 4. Giới hạn Firebase API Key

```
1. Vào Firebase Console
2. Project Settings → API restrictions
3. Giới hạn theo domain của bạn
4. Bật App Check
```

### 🟢 TÙY CHỌN (Có thể làm sau):

#### 5. Xóa credentials khỏi Git history

```bash
# Sử dụng git-filter-repo (nâng cao)
# Cảnh báo: Sẽ rewrite toàn bộ Git history
# Chỉ làm nếu thực sự cần thiết
```

---

## 📝 SCRIPT TỰ ĐỘNG HÓA

### Script 1: Di chuyển EmailJS credentials

```typescript
// src/services/otpService.ts

// Trước:
const SERVICE_ID = "service_zw6iy8k";
const TEMPLATE_ID = "template_gjbyxqg";
const PUBLIC_KEY = "lGlHvgbAvmq1lnswI";

// Sau:
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
  console.error("Missing EmailJS credentials in environment variables");
}
```

### Script 2: Di chuyển Cloudinary credentials

```typescript
// src/services/ekycService.ts

// Trước:
const CLOUDINARY_CLOUD_NAME = "dndzpcykq";
const CLOUDINARY_UPLOAD_PRESET = "vietbank_unsigned";

// Sau:
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("Missing Cloudinary credentials in environment variables");
}
```

---

## ✅ ĐÃ HOÀN THÀNH

1. ✅ Kiểm tra toàn bộ source code
2. ✅ Kiểm tra Git history
3. ✅ Xác định tất cả credentials
4. ✅ Đánh giá mức độ rủi ro
5. ✅ Tạo báo cáo chi tiết
6. ✅ Cung cấp hướng dẫn khắc phục

---

## 🔒 BẢO MẬT TỐT NHẤT (BEST PRACTICES)

### Nguyên tắc:

1. ❌ **KHÔNG BAO GIỜ** commit credentials vào Git
2. ✅ **LUÔN LUÔN** dùng environment variables
3. ✅ **LUÔN LUÔN** thêm `.env` vào `.gitignore`
4. ✅ **LUÔN LUÔN** cung cấp `.env.example` với placeholders
5. ✅ **LUÔN LUÔN** rotate credentials định kỳ
6. ✅ **LUÔN LUÔN** bật 2FA cho tất cả services
7. ✅ **LUÔN LUÔN** giới hạn API keys theo domain/IP
8. ✅ **LUÔN LUÔN** monitor logs để phát hiện abuse

### Checklist bảo mật:

- [ ] Đổi mật khẩu Gmail
- [ ] Bật 2FA cho Gmail
- [ ] Di chuyển EmailJS credentials vào .env
- [ ] Di chuyển Cloudinary credentials vào .env
- [ ] Giới hạn Firebase API key
- [ ] Bật App Check
- [ ] Review Firebase Security Rules
- [ ] Setup monitoring và alerts
- [ ] Document security procedures
- [ ] Train team về security best practices

---

## 📞 HỖ TRỢ

Nếu anh cần hỗ trợ thực hiện bất kỳ bước nào, hãy cho tôi biết:

- "Hướng dẫn đổi mật khẩu Gmail"
- "Hướng dẫn di chuyển credentials vào .env"
- "Hướng dẫn giới hạn Firebase API key"
- "Hướng dẫn xóa credentials khỏi Git history"

**Ưu tiên số 1: ĐỔI MẬT KHẨU GMAIL NGAY! 🚨**

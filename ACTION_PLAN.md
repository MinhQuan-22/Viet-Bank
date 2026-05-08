# KẾ HOẠCH CẢI THIỆN HỆ THỐNG VIETBANK

**Ngày tạo:** 8 tháng 5, 2026  
**Trạng thái:** Cần thực hiện ngay

---

## 🚨 MỨC ĐỘ ƯU TIÊN CAO - BẮT BUỘC THỰC HIỆN NGAY

### 1. BẢO MẬT NGHIÊM TRỌNG (CRITICAL SECURITY)

#### 1.1 ⚠️ Thông tin đăng nhập Gmail bị lộ trong Git History

- **Vấn đề:** Mật khẩu Gmail `thehoang.acc@gmail.com` / `Thedeptrai1` đã bị commit vào Git history
- **Rủi ro:** Tài khoản email có thể bị xâm nhập, dữ liệu người dùng bị đánh cắp
- **Hành động:**
  - [ ] **NGAY LẬP TỨC:** Đổi mật khẩu Gmail `thehoang.acc@gmail.com`
  - [ ] Bật xác thực 2 yếu tố (2FA) cho tài khoản Gmail
  - [ ] Kiểm tra lịch sử đăng nhập Gmail để phát hiện truy cập bất thường
  - [ ] Xem xét sử dụng `git filter-repo` để xóa credentials khỏi Git history (nâng cao)
  - [ ] Cập nhật `.env` với credentials mới
- **Tài liệu:** Xem `SECURITY_ALERT.md` để biết chi tiết

#### 1.2 🔓 Firestore Security Rules cho phép truy cập công khai

- **Vấn đề:** `firestore.rules` hiện tại: `allow read, write: if true` - BẤT KỲ AI cũng có thể đọc/ghi dữ liệu
- **Rủi ro:**
  - Dữ liệu người dùng có thể bị đọc bởi bất kỳ ai
  - Kẻ tấn công có thể xóa/sửa dữ liệu
  - Không có kiểm soát quyền truy cập
- **Hành động:**
  - [ ] Viết lại Firestore rules với xác thực người dùng
  - [ ] Áp dụng quy tắc: chỉ chủ sở hữu mới được đọc/ghi dữ liệu của mình
  - [ ] Thêm rules cho collections: `cinemas`, `movies`, `showtimes`, `hotels`, `flights`
  - [ ] Test rules với Firebase Emulator trước khi deploy
  - [ ] Deploy rules lên production
- **Ví dụ rules cần thiết:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chỉ cho phép đọc dữ liệu công khai
    match /cinemas/{cinema} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }

    match /movies/{movie} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }

    // Dữ liệu cá nhân - chỉ chủ sở hữu
    match /bookings/{booking} {
      allow read, write: if request.auth != null &&
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

#### 1.3 🔑 Firebase API Key công khai trong source code

- **Vấn đề:** API key `AIzaSyBaBxbCTIyyQ66zaYxlyrlDWMUSR0XVyuk` trong `src/lib/firebase.ts`
- **Rủi ro:** Mức độ TRUNG BÌNH - API key được thiết kế để public nhưng cần bảo vệ bằng security rules
- **Hành động:**
  - [ ] Kiểm tra Firebase Console > Project Settings > API restrictions
  - [ ] Giới hạn API key chỉ cho phép từ domain của bạn
  - [ ] Bật App Check để chống bot và abuse
  - [ ] Đảm bảo Firestore rules và Database rules đã được cấu hình đúng

#### 1.4 🔐 Realtime Database Rules cần cải thiện

- **Vấn đề:** `database.rules.json` có một số vấn đề:
  - `accounts` collection cho phép đọc tất cả nếu authenticated
  - `utilityTransactions` cho phép đọc/ghi tất cả nếu authenticated
- **Rủi ro:** Người dùng có thể xem tài khoản của người khác
- **Hành động:**
  - [ ] Sửa rules để chỉ cho phép đọc tài khoản của chính mình
  - [ ] Thêm validation cho số dư tài khoản (không cho phép số âm)
  - [ ] Thêm rules cho `transactions`, `transactionOtps`, `savedRecipients`
- **Ví dụ rules cần sửa:**

```json
{
  "rules": {
    "accounts": {
      "$accountId": {
        ".read": "auth != null && data.child('uid').val() === auth.uid",
        ".write": "auth != null && data.child('uid').val() === auth.uid",
        ".validate": "newData.child('balance').isNumber() && newData.child('balance').val() >= 0"
      }
    },
    "utilityTransactions": {
      "$transactionId": {
        ".read": "auth != null && data.child('userId').val() === auth.uid",
        ".write": "auth != null && newData.child('userId').val() === auth.uid"
      }
    }
  }
}
```

---

## 🔧 MỨC ĐỘ ƯU TIÊN TRUNG BÌNH - NÊN THỰC HIỆN SỚM

### 2. CHẤT LƯỢNG CODE (CODE QUALITY)

#### 2.1 TypeScript Strict Mode bị tắt

- **Vấn đề:** `tsconfig.json` có các cài đặt:
  - `noImplicitAny: false` - cho phép `any` type
  - `strictNullChecks: false` - không kiểm tra null/undefined
  - `noUnusedParameters: false` - không cảnh báo tham số không dùng
  - `noUnusedLocals: false` - không cảnh báo biến không dùng
- **Rủi ro:**
  - Dễ gây lỗi runtime do null/undefined
  - Code khó maintain
  - Không tận dụng được sức mạnh của TypeScript
- **Hành động:**
  - [ ] Bật `strictNullChecks: true`
  - [ ] Bật `noImplicitAny: true`
  - [ ] Bật `noUnusedParameters: true`
  - [ ] Bật `noUnusedLocals: true`
  - [ ] Fix tất cả lỗi TypeScript phát sinh (có thể nhiều)
  - [ ] Thêm type annotations cho các function chưa có

#### 2.2 ESLint Rules quá lỏng lẻo

- **Vấn đề:** `eslint.config.js` tắt rule `@typescript-eslint/no-unused-vars`
- **Hành động:**
  - [ ] Bật lại rule `@typescript-eslint/no-unused-vars`
  - [ ] Thêm rules cho code quality:
    - `no-console: warn` (cảnh báo console.log)
    - `prefer-const` (ưu tiên const thay vì let)
    - `no-var` (không dùng var)
  - [ ] Fix tất cả warnings

#### 2.3 Tối ưu hóa Performance

- **Vấn đề:** Có 2 TODO/FIXME trong code:
  1. `cinemaService.ts:85` - "TODO: optimize with batch get instead of loop"
  2. `cinemaService.ts:178` - "FIXME: this loads all showtimes, should add index on movieId"
- **Hành động:**
  - [ ] Sửa `getMoviesByCinema()` để dùng batch get thay vì loop
  - [ ] Thêm Firestore index cho `showtimes` collection với field `movieId`
  - [ ] Sửa `searchCinemasByMovie()` để query hiệu quả hơn
  - [ ] Test performance trước và sau khi tối ưu

---

### 3. TESTING & QUALITY ASSURANCE

#### 3.1 Test Coverage thấp

- **Vấn đề:** Chỉ có 11 property-based tests, không có unit tests cho services
- **Hành động:**
  - [ ] Viết unit tests cho các services quan trọng:
    - `transferService.ts` (quan trọng nhất - xử lý tiền)
    - `authService.ts`
    - `accountService.ts`
    - `ekycService.ts`
  - [ ] Viết integration tests cho các flows chính:
    - Đăng ký tài khoản
    - Chuyển tiền nội bộ
    - Chuyển tiền liên ngân hàng
    - Đặt vé xem phim
    - Đặt phòng khách sạn
  - [ ] Đặt mục tiêu: ít nhất 70% code coverage
  - [ ] Thêm test coverage report vào CI/CD

#### 3.2 Thiếu E2E Tests

- **Hành động:**
  - [ ] Cài đặt Playwright hoặc Cypress
  - [ ] Viết E2E tests cho user flows quan trọng
  - [ ] Chạy E2E tests trên CI/CD

---

### 4. DEPENDENCIES & PACKAGES

#### 4.1 Nhiều packages đã lỗi thời

- **Vấn đề:** Có 40+ packages cần update, bao gồm:
  - `@capacitor/*` packages: 8.0.0 → 8.3.2
  - `@hookform/resolvers`: 3.10.0 → 5.2.2 (major update)
  - `@tanstack/react-query`: 5.90.12 → 5.100.9
  - `@types/react`: 18.3.27 → 19.2.14 (major update)
  - `@tailwindcss/typography`: 0.4.1 → 0.5.19
- **Hành động:**
  - [ ] Update minor/patch versions trước (ít rủi ro):
    ```bash
    npm update
    ```
  - [ ] Test kỹ sau khi update
  - [ ] Update major versions từng package một:
    ```bash
    npm install @hookform/resolvers@latest
    npm install @types/react@latest @types/react-dom@latest
    ```
  - [ ] Fix breaking changes nếu có
  - [ ] Chạy full test suite sau mỗi major update

#### 4.2 Thiếu Security Audit

- **Hành động:**
  - [ ] Chạy `npm audit` để kiểm tra vulnerabilities
  - [ ] Fix tất cả high/critical vulnerabilities
  - [ ] Cài đặt `npm audit` vào CI/CD pipeline

---

### 5. DOCUMENTATION & MAINTAINABILITY

#### 5.1 Thiếu Documentation

- **Vấn đề:** Không có docs cho:
  - API endpoints
  - Database schema details
  - Deployment process
  - Development setup
- **Hành động:**
  - [ ] Viết API documentation (có thể dùng Swagger/OpenAPI)
  - [ ] Cập nhật `README.md` với:
    - Prerequisites
    - Installation steps
    - Development workflow
    - Testing instructions
    - Deployment guide
  - [ ] Viết CONTRIBUTING.md cho contributors
  - [ ] Thêm JSDoc comments cho các functions quan trọng

#### 5.2 Thiếu Error Handling & Logging

- **Vấn đề:**
  - Nhiều try-catch chỉ throw generic error messages
  - Không có centralized error logging
  - Không có error monitoring (Sentry, etc.)
- **Hành động:**
  - [ ] Tạo custom error classes với error codes
  - [ ] Thêm structured logging (Winston, Pino)
  - [ ] Cài đặt error monitoring service (Sentry)
  - [ ] Log errors với context (user ID, transaction ID, etc.)
  - [ ] Tạo error boundary components cho React

---

## 📊 MỨC ĐỘ ƯU TIÊN THẤP - CÓ THỂ LÀM SAU

### 6. INFRASTRUCTURE & DEVOPS

#### 6.1 Thiếu CI/CD Pipeline

- **Hành động:**
  - [ ] Setup GitHub Actions hoặc GitLab CI
  - [ ] Tự động chạy tests khi push code
  - [ ] Tự động deploy lên staging/production
  - [ ] Thêm code quality checks (ESLint, TypeScript)

#### 6.2 Thiếu Environment Management

- **Hành động:**
  - [ ] Tạo separate Firebase projects cho dev/staging/prod
  - [ ] Setup environment-specific configs
  - [ ] Document environment setup process

---

### 7. USER EXPERIENCE & ACCESSIBILITY

#### 7.1 Accessibility Compliance

- **Hành động:**
  - [ ] Audit với Lighthouse/axe DevTools
  - [ ] Thêm ARIA labels cho interactive elements
  - [ ] Đảm bảo keyboard navigation hoạt động
  - [ ] Test với screen readers
  - [ ] Đảm bảo color contrast đạt WCAG AA

#### 7.2 Performance Optimization

- **Hành động:**
  - [ ] Audit với Lighthouse
  - [ ] Optimize images (lazy loading, WebP format)
  - [ ] Code splitting cho routes
  - [ ] Implement service worker cho offline support
  - [ ] Optimize bundle size

---

## 📋 CHECKLIST TỔNG HỢP - THỰC HIỆN THEO THỨ TỰ

### Tuần 1: Bảo mật khẩn cấp

- [ ] Đổi mật khẩu Gmail ngay lập tức
- [ ] Bật 2FA cho Gmail
- [ ] Viết lại Firestore security rules
- [ ] Cải thiện Realtime Database rules
- [ ] Deploy rules lên production
- [ ] Test kỹ các rules mới

### Tuần 2: Code Quality cơ bản

- [ ] Bật TypeScript strict mode
- [ ] Fix tất cả TypeScript errors
- [ ] Cải thiện ESLint rules
- [ ] Fix tất cả ESLint warnings
- [ ] Tối ưu performance issues (TODO/FIXME)

### Tuần 3: Testing

- [ ] Viết unit tests cho transferService
- [ ] Viết unit tests cho authService
- [ ] Viết integration tests cho main flows
- [ ] Đạt 70% code coverage

### Tuần 4: Dependencies & Documentation

- [ ] Update tất cả minor/patch versions
- [ ] Update major versions (cẩn thận)
- [ ] Chạy npm audit và fix vulnerabilities
- [ ] Viết documentation đầy đủ
- [ ] Setup error monitoring

### Tuần 5+: Infrastructure & UX

- [ ] Setup CI/CD pipeline
- [ ] Accessibility audit và fixes
- [ ] Performance optimization
- [ ] E2E testing setup

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành action plan này:

✅ **Bảo mật:** Hệ thống được bảo vệ khỏi các lỗ hổng nghiêm trọng  
✅ **Chất lượng:** Code dễ đọc, dễ maintain, ít bug  
✅ **Tin cậy:** Test coverage cao, ít regression bugs  
✅ **Hiệu suất:** Ứng dụng chạy nhanh, mượt mà  
✅ **Chuyên nghiệp:** Documentation đầy đủ, quy trình rõ ràng

---

## 📞 HỖ TRỢ

Nếu cần hỗ trợ thực hiện bất kỳ mục nào, hãy hỏi tôi:

- "Hướng dẫn viết Firestore security rules"
- "Hướng dẫn bật TypeScript strict mode"
- "Hướng dẫn viết unit tests cho transferService"
- "Hướng dẫn setup CI/CD với GitHub Actions"

**Chúc bạn thành công! 🚀**

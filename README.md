# 🏦 VietBank - Digital Banking Application

Ứng dụng ngân hàng số hiện đại được xây dựng với React, TypeScript và Firebase, hỗ trợ đa nền tảng (Web, iOS, Android).

---

## 📖 Giới Thiệu

**VietBank** là một ứng dụng ngân hàng số (Digital Banking) đầy đủ tính năng, được thiết kế để cung cấp trải nghiệm ngân hàng trực tuyến an toàn, tiện lợi và hiện đại. Hệ thống được xây dựng với các công nghệ web tiên tiến và có thể triển khai trên nhiều nền tảng khác nhau.

---

## ✨ Tính Năng Chính

### 💰 Quản Lý Tài Khoản

- Xem số dư tài khoản real-time
- Lịch sử giao dịch chi tiết
- Quản lý nhiều tài khoản (Thanh toán, Tiết kiệm, Vay)
- Thông báo thay đổi số dư tức thì

### 💸 Chuyển Tiền

- **Chuyển tiền nội bộ**: VietBank → VietBank (miễn phí, tức thì)
- **Chuyển tiền liên ngân hàng**: VietBank → Ngân hàng khác
- Xác thực đa lớp: PIN + OTP + Sinh trắc học
- Lưu người nhận thường xuyên
- Biên lai giao dịch điện tử

### 🔐 Bảo Mật

- **eKYC (Electronic Know Your Customer)**: Định danh điện tử với xác minh giấy tờ
- **Xác thực PIN**: 6 chữ số cho mọi giao dịch
- **OTP qua Email**: Mã xác thực hết hạn sau 2 phút
- **Sinh trắc học**: Bắt buộc cho giao dịch >= 10 triệu VND
- **Khóa tài khoản tự động**: Sau 5 lần đăng nhập/nhập PIN sai

### 💵 Nạp & Rút Tiền

- **Nạp tiền mặt**: Nạp tiền với xác thực PIN
- **Rút tiền đơn giản**: Chỉ cần PIN
- **Rút tiền có OTP**: PIN + OTP qua email (bảo mật cao)
- **Nạp tiền quốc tế**: Qua thẻ tín dụng (Stripe)

### 🎬 Đặt Vé Phim

- Tìm kiếm rạp chiếu phim theo vị trí
- Xem thông tin phim, trailer
- Chọn suất chiếu và ghế ngồi (sơ đồ tương tác)
- Kiểm tra ghế trống real-time
- Thanh toán và nhận vé điện tử với mã QR

### 🏨 Đặt Phòng Khách Sạn

- Tìm kiếm khách sạn theo thành phố và ngày
- Lọc phòng trống tự động (kiểm tra trùng lặp ngày)
- Chọn loại phòng (Standard, Deluxe, Suite...)
- Thanh toán và nhận phiếu đặt phòng
- Check-in: 14:00, Check-out: 12:00

### 📱 Tiện Ích (Sắp ra mắt)

- Nạp tiền điện thoại
- Thanh toán hóa đơn (Điện, nước, internet)
- Mua vé máy bay, xe khách
- Thanh toán QR Code

### 👔 Cổng Nhân Viên

- Dashboard tổng quan
- Duyệt eKYC khách hàng
- Quản lý tài khoản
- Giám sát giao dịch
- Quản lý lãi suất

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- **React 18**: Thư viện UI hiện đại
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool nhanh chóng
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library đẹp và accessible

### Backend & Database

- **Firebase Authentication**: Xác thực người dùng
- **Firebase Realtime Database**: Dữ liệu real-time (user profiles, accounts, transactions)
- **Firebase Firestore**: Document database (cinemas, hotels, bookings)
- **Firebase Cloud Functions**: Serverless functions (sắp ra mắt)

### Mobile

- **Capacitor**: Cross-platform native runtime
- **iOS & Android**: Build native apps từ codebase web

### Testing

- **Vitest**: Unit testing framework
- **fast-check**: Property-based testing
- **Testing Library**: Component testing

### Third-party Services

- **Cloudinary**: Lưu trữ hình ảnh (eKYC documents)
- **EmailJS**: Gửi OTP qua email
- **Stripe**: Thanh toán quốc tế (sắp ra mắt)

---

## 🗄️ Cơ Sở Dữ Liệu

### Firebase Realtime Database (RTDB)

Lưu trữ dữ liệu cần cập nhật real-time:

```
/users/{uid}                    - Thông tin người dùng
/accounts/{accountNumber}       - Tài khoản ngân hàng
/transactions/{transactionId}   - Giao dịch
/transactionOtps/{txnId}        - OTP xác thực
/ekycSessions/{emailKey}        - Phiên eKYC
/notifications/{uid}/{id}       - Thông báo
/savedRecipients/{uid}/{key}    - Người nhận đã lưu
/counters                       - Bộ đếm tự động
```

### Firebase Firestore

Lưu trữ dữ liệu cần query phức tạp:

```
/cinemas                        - Rạp chiếu phim
/movies                         - Phim
/showtimes                      - Suất chiếu
/movie_bookings                 - Đặt vé phim
/hotels                         - Khách sạn
/hotel_rooms                    - Phòng khách sạn
/hotel_bookings                 - Đặt phòng khách sạn
```

**Tài liệu chi tiết**: Xem `docs/DATABASE_SCHEMA.md`

---

## 🏗️ Kiến Trúc Hệ Thống

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         UI Layer (React)                │
│  - Pages, Components, Hooks             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Business Logic Layer               │
│  - Services (Auth, Transfer, Booking)   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Infrastructure Layer               │
│  - Firebase, Cloudinary, EmailJS        │
└─────────────────────────────────────────┘
```

### Key Design Patterns

- **Service Layer Pattern**: Tách biệt business logic khỏi UI
- **Repository Pattern**: Trừu tượng hóa data access
- **Atomic Transactions**: Đảm bảo tính nhất quán dữ liệu
- **Real-time Listeners**: Cập nhật UI tự động khi data thay đổi

**Tài liệu chi tiết**: Xem `docs/PROJECT_OVERVIEW.md`

---

## 🔒 Bảo Mật

### Authentication & Authorization

- Email/Password login với Firebase Auth
- Biometric login (Fingerprint/FaceID) - demo mode
- Role-based access control (CUSTOMER vs OFFICER)
- Account lockout sau 5 lần đăng nhập sai

### Transaction Security

- **PIN Verification**: 6-digit transaction PIN
- **OTP Verification**: Email OTP (2-minute expiry, 5 attempts)
- **Biometric Auth**: Required for transactions >= 10M VND
- **Atomic Operations**: Prevent race conditions

### Data Security

- Firebase Security Rules cho RTDB và Firestore
- Sensitive data không lưu trong localStorage
- HTTPS only
- Input validation và sanitization

---

## 📱 Đa Nền Tảng

### Web

- Responsive design (Mobile-first)
- Progressive Web App (PWA) ready
- Hỗ trợ tất cả trình duyệt hiện đại

### Mobile (iOS & Android)

- Native features qua Capacitor:
  - Camera (eKYC photo capture)
  - Geolocation (tìm rạp/khách sạn gần)
  - Biometric (Fingerprint/FaceID)
  - Push Notifications (sắp ra mắt)

---

## 📊 Tính Năng Kỹ Thuật Nổi Bật

### 1. Real-time Seat Booking

Cập nhật ghế đã đặt atomically để tránh double-booking:

```typescript
await updateDoc(showtimeRef, {
  occupiedSeats: arrayUnion(...selectedSeats),
});
```

### 2. Room Availability Check

Kiểm tra trùng lặp ngày đặt phòng:

```typescript
// Overlap detection: checkIn < existingCheckOut AND checkOut > existingCheckIn
const overlap =
  requestCheckIn < existingCheckOut && requestCheckOut > existingCheckIn;
```

### 3. Atomic Balance Deduction

Đảm bảo số dư không âm:

```typescript
await runTransaction(accountRef, (current) => {
  if (current.balance < amount) {
    throw new Error("Insufficient balance");
  }
  return { ...current, balance: current.balance - amount };
});
```

### 4. Seeded Random Data

Dữ liệu demo nhất quán trên mọi máy:

```typescript
// Linear Congruential Generator (LCG)
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
```

### 5. Property-Based Testing

Test với hàng nghìn test cases tự động:

```typescript
fc.assert(
  fc.property(fc.nat(), fc.nat(), (balance, amount) => {
    if (balance < amount) {
      expect(() => deduct(balance, amount)).toThrow();
    } else {
      expect(deduct(balance, amount)).toBe(balance - amount);
    }
  }),
);
```

---

## 📚 Tài Liệu

### Hướng Dẫn Sử Dụng

- **README.txt**: Hướng dẫn chi tiết khởi tạo, khởi chạy và sử dụng hệ thống
- **STARTUP_GUIDE.md**: Hướng dẫn khởi động nhanh
- **HUONG_DAN_KHOI_DONG_CHI_TIET.md**: Hướng dẫn từng bước chi tiết
- **HUONG_DAN_TAT_VA_CHAY_LAI.md**: Hướng dẫn tắt và chạy lại hệ thống
- **TROUBLESHOOTING_LOGIN.md**: Khắc phục lỗi đăng nhập

### Tài Liệu Kỹ Thuật

- **docs/PROJECT_OVERVIEW.md**: Tổng quan kiến trúc và tính năng
- **docs/DATABASE_SCHEMA.md**: Cấu trúc database chi tiết
- **docs/vietbank-class-diagram.puml**: Class diagram
- **docs/vietbank-erd.puml**: Entity Relationship Diagram
- **docs/vietbank-usecase-diagram.puml**: Use Case Diagram

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống

- Node.js 18.x hoặc cao hơn
- npm 9.x hoặc cao hơn
- Git
- Python 3 (để chạy scripts)

### Khởi Động Hệ Thống

```bash
# Clone repository
git clone https://github.com/MinhQuan-22/Viet-Bank.git
cd Viet-Bank

# Cài đặt dependencies (chỉ lần đầu)
npm install

# Khởi động hệ thống (tự động khởi động emulators + seed data + dev server)
./start-dev.sh

# Hoặc dùng npm
npm run dev:full
```

Đợi ~10-15 giây, sau đó:

- Mở browser: `http://localhost:5175/`
- Đăng nhập với tài khoản test:
  - Email: `thehoang.acc@gmail.com`
  - Password: `Thedeptrai1`

### Tắt Hệ Thống

```bash
# Dùng script
./stop-dev.sh

# Hoặc dùng npm
npm run stop

# Hoặc nhấn Ctrl+C trong terminal đang chạy
```

**Chi tiết đầy đủ**: Xem file `README.txt`

---

## 📦 Scripts Có Sẵn

```bash
npm run dev              # Chỉ khởi động Vite dev server
npm run dev:full         # Khởi động đầy đủ (emulators + seed + vite)
npm run stop             # Dừng tất cả services

npm run build            # Build production
npm run preview          # Preview production build
npm run lint             # Chạy ESLint
npm run test             # Chạy tests
npm run test:ui          # Chạy tests với UI

npm run emulator:only    # Chỉ khởi động emulators
```

---

## 🧪 Testing

### Test Categories

- **Property-Based Tests**: Test với hàng nghìn test cases tự động
- **Unit Tests**: Test từng function riêng lẻ
- **Integration Tests**: Test tương tác giữa các services
- **Component Tests**: Test React components

### Chạy Tests

```bash
# Chạy tất cả tests
npm run test

# Chạy tests với UI
npm run test:ui

# Chạy tests với coverage
npm run test -- --coverage
```

---

## 🌍 Ngôn Ngữ

- **Tiếng Việt**: Ngôn ngữ chính của ứng dụng
- **English**: Tài liệu kỹ thuật và code comments

---

## 📄 License

Dự án này chỉ dành cho mục đích giáo dục. Không sử dụng cho mục đích thương mại.

---

## 👥 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📞 Liên Hệ

- **GitHub**: [MinhQuan-22](https://github.com/MinhQuan-22)
- **Email**: chudinhminhquan1002@gmail.com
- **Repository**: [Viet-Bank](https://github.com/MinhQuan-22/Viet-Bank)

---

## 🙏 Cảm Ơn

Cảm ơn đã quan tâm đến dự án VietBank! Nếu bạn thấy dự án hữu ích, hãy cho một ⭐ trên GitHub.

---

**VietBank** - Digital Banking Made Simple 🏦

_Được xây dựng với ❤️ bằng React, TypeScript và Firebase_

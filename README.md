# VietBank - Digital Banking Application

Ứng dụng ngân hàng số hiện đại được xây dựng với React, TypeScript và Firebase.

## 🚀 Tính năng chính

- **Quản lý tài khoản**: Xem số dư, lịch sử giao dịch
- **Chuyển tiền**: Chuyển tiền nội bộ và liên ngân hàng với xác thực OTP
- **eKYC**: Định danh điện tử với xác minh giấy tờ
- **Đặt vé phim**: Tìm rạp, chọn ghế, thanh toán
- **Đặt phòng khách sạn**: Tìm khách sạn, kiểm tra phòng trống
- **Nạp/rút tiền**: Nạp rút tiền với xác thực PIN và OTP

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Realtime Database, Firestore)
- **Mobile**: Capacitor (iOS/Android)
- **Testing**: Vitest + fast-check

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/MinhQuan-22/Viet-Bank.git
cd Viet-Bank

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Chạy Firebase emulators
npm run emulator
```

## 🔧 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
npm run emulator     # Start Firebase emulators with seed data
```

## 🏗️ Cấu trúc project

```
src/
├── components/      # React components
├── pages/          # Page components
├── services/       # Business logic services
├── hooks/          # Custom React hooks
├── lib/            # Utilities & Firebase config
└── test/           # Test files
```

## 🔐 Bảo mật

- Xác thực PIN cho mọi giao dịch
- OTP qua email (hết hạn sau 2 phút)
- Xác thực sinh trắc cho giao dịch >= 10M VND
- eKYC bắt buộc trước khi giao dịch
- Khóa tài khoản sau 5 lần đăng nhập sai

## 📱 Mobile

Build cho Android/iOS:

```bash
# Sync với Capacitor
npx cap sync

# Mở Android Studio
npx cap open android

# Mở Xcode
npx cap open ios
```

## 📝 License

Educational purposes only.

## 👥 Contact

For questions, please open an issue on GitHub.

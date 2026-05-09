================================================================================
                    VIETBANK - DIGITAL BANKING APPLICATION
                    HƯỚNG DẪN KHỞI TẠO VÀ SỬ DỤNG HỆ THỐNG
================================================================================

Ngày cập nhật: 08/05/2026
Phiên bản: 1.0
Người kiểm tra: Kiro AI Assistant

================================================================================
                            MỤC LỤC
================================================================================

1. GIỚI THIỆU HỆ THỐNG
2. YÊU CẦU HỆ THỐNG
3. KHỞI TẠO HỆ THỐNG LẦN ĐẦU
4. KHỞI CHẠY HỆ THỐNG
5. TÀI KHOẢN MẪU ĐỂ ĐĂNG NHẬP
6. CÁCH SỬ DỤNG HỆ THỐNG
7. TẮT HỆ THỐNG
8. XỬ LÝ LỖI THƯỜNG GẶP
9. CẤU TRÚC DỰ ÁN
10. THÔNG TIN LIÊN HỆ

================================================================================
                        1. GIỚI THIỆU HỆ THỐNG
================================================================================

VietBank là ứng dụng ngân hàng số (Digital Banking) hiện đại được xây dựng 
với React, TypeScript và Firebase. Hệ thống hỗ trợ đa nền tảng (Web, iOS, 
Android) và cung cấp đầy đủ các tính năng ngân hàng số.

CÔNG NGHỆ SỬ DỤNG:
- Frontend: React 18 + TypeScript + Vite
- UI Framework: Tailwind CSS + shadcn/ui
- Backend: Firebase (Authentication, Realtime Database, Firestore)
- Mobile: Capacitor (iOS/Android)
- Testing: Vitest + fast-check (Property-Based Testing)

CƠ SỞ DỮ LIỆU:
- Firebase Realtime Database: User profiles, accounts, transactions
- Firebase Firestore: Cinemas, hotels, bookings

================================================================================
                        2. YÊU CẦU HỆ THỐNG
================================================================================

PHẦN MỀM CẦN CÀI ĐẶT:
- Node.js: Phiên bản 18.x hoặc cao hơn
- npm: Phiên bản 9.x hoặc cao hơn
- Git: Để clone repository
- Firebase CLI: Tự động cài đặt qua npm
- Python 3: Để chạy các scripts (đã có sẵn trên macOS)

HỆ ĐIỀU HÀNH:
- macOS (đã kiểm tra và xác nhận hoạt động)
- Linux (tương thích)
- Windows (tương thích với một số điều chỉnh)

TRÌNH DUYỆT:
- Google Chrome (khuyến nghị)
- Firefox
- Safari
- Edge

PORTS SỬ DỤNG:
- 5175: Vite Dev Server
- 9099: Firebase Auth Emulator
- 9000: Firebase Realtime Database Emulator
- 8080: Firebase Firestore Emulator
- 4000: Firebase Emulator UI

================================================================================
                    3. KHỞI TẠO HỆ THỐNG LẦN ĐẦU
================================================================================

CHỈ THỰC HIỆN 1 LẦN DUY NHẤT KHI MỚI CLONE PROJECT

BƯỚC 1: Clone repository
--------
cd ~
git clone https://github.com/MinhQuan-22/Viet-Bank.git
cd Viet-Bank

BƯỚC 2: Cài đặt dependencies
--------
npm install

⏱️ Thời gian: ~2-3 phút (tùy tốc độ mạng)

BƯỚC 3: Kiểm tra scripts
--------
ls -la *.sh

Kết quả mong đợi:
-rwxr-xr-x  start-dev.sh
-rwxr-xr-x  stop-dev.sh

Nếu không có quyền execute, chạy:
chmod +x start-dev.sh
chmod +x stop-dev.sh

BƯỚC 4: Kiểm tra file cấu hình
--------
cat .env

Kết quả mong đợi:
VITE_USE_FUNCTIONS_EMULATOR=true
VITE_USE_AUTH_EMULATOR=true
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
...

✅ HOÀN TẤT KHỞI TẠO!

================================================================================
                        4. KHỞI CHẠY HỆ THỐNG
================================================================================

CÁCH 1: DÙNG SCRIPT TỰ ĐỘNG (KHUYẾN NGHỊ) ⭐
--------

Bước 1: Mở Terminal
cd ~/Viet-Bank

Bước 2: Chạy script khởi động
./start-dev.sh

Bước 3: Đợi ~10-15 giây

Anh sẽ thấy màn hình:

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

Bước 4: Mở trình duyệt
Truy cập: http://localhost:5175/

✅ HỆ THỐNG ĐÃ SẴN SÀNG!

--------

CÁCH 2: DÙNG NPM SCRIPT
--------

npm run dev:full

(Giống với ./start-dev.sh)

--------

SCRIPT TỰ ĐỘNG LÀM GÌ?
--------

✅ Kiểm tra ports đang sử dụng
✅ Khởi động Firebase Emulators (Auth, Database, Firestore)
✅ Đợi emulators sẵn sàng
✅ Tạo tài khoản Auth với email/password
✅ Lấy UID tự động
✅ Tạo user profile với đầy đủ thông tin
✅ Tạo bank account với số dư 10,000,000 VND
✅ Tạo CIF counter
✅ Khởi động Vite dev server
✅ Hiển thị thông tin đăng nhập

================================================================================
                    5. TÀI KHOẢN MẪU ĐỂ ĐĂNG NHẬP
================================================================================

THÔNG TIN TÀI KHOẢN TEST
--------

Email:              thehoang.acc@gmail.com
Password:           Thedeptrai1
Số tài khoản:       100000000001
Số dư:              10,000,000 VND
PIN giao dịch:      1234
Trạng thái eKYC:    VERIFIED (Đã xác minh)
Quyền giao dịch:    Có (canTransact: true)
Vai trò:            CUSTOMER (Khách hàng)

THÔNG TIN CHI TIẾT
--------

Họ tên:             Hoang Test
Số điện thoại:      0901234567
Giới tính:          Nam
Ngày sinh:          01/01/1990
CMND/CCCD:          079090001234
Ngày cấp:           01/01/2020
Nơi cấp:            Cục Cảnh sát QLHC về TTXH
Địa chỉ thường trú: 123 Test Street, District 1, HCMC
Địa chỉ liên hệ:    123 Test Street, District 1, HCMC
Mã CIF:             CIF0001

LƯU Ý QUAN TRỌNG
--------

⚠️  Dữ liệu emulator KHÔNG LƯU TRỮ vĩnh viễn!
    - Khi tắt emulator → Dữ liệu bị xóa
    - Khi restart máy → Dữ liệu bị xóa
    - Giải pháp: Chạy ./start-dev.sh → Tự động tạo lại data

✅  Tài khoản test luôn giống nhau mỗi lần chạy script
    - Email: thehoang.acc@gmail.com
    - Password: Thedeptrai1
    - Balance: 10,000,000 VND
    - PIN: 1234

================================================================================
                        6. CÁCH SỬ DỤNG HỆ THỐNG
================================================================================

BƯỚC 1: ĐĂNG NHẬP
--------

1. Mở trình duyệt: http://localhost:5175/
2. Trang đăng nhập sẽ hiện ra
3. Nhập thông tin:
   - Email: thehoang.acc@gmail.com
   - Password: Thedeptrai1
4. Nhấn nút "Đăng nhập"
5. Chờ vài giây → Đăng nhập thành công!

--------

BƯỚC 2: TRANG CHỦ (HOME)
--------

Sau khi đăng nhập, anh sẽ thấy:

- Số dư tài khoản: 10,000,000 VND
- Số tài khoản: 100000000001
- Lịch sử giao dịch gần đây
- Menu điều hướng ở dưới cùng

--------

BƯỚC 3: CÁC CHỨC NĂNG CHÍNH
--------

A. CHUYỂN TIỀN (TRANSFER)
   
   1. Nhấn vào "Chuyển tiền" trên menu
   2. Chọn loại chuyển tiền:
      - Chuyển nội bộ VietBank
      - Chuyển liên ngân hàng
   3. Nhập thông tin người nhận:
      - Số tài khoản
      - Tên người nhận
      - Số tiền
      - Nội dung chuyển tiền
   4. Nhấn "Tiếp tục"
   5. Nhập PIN giao dịch: 1234
   6. Nếu >= 10,000,000 VND → Xác thực sinh trắc (demo mode)
   7. Nhập OTP nhận qua email
   8. Xác nhận → Chuyển tiền thành công!
   9. Xem biên lai giao dịch

B. NẠP TIỀN (DEPOSIT)
   
   1. Nhấn vào "Nạp tiền"
   2. Nhập số tiền muốn nạp
   3. Nhập PIN: 1234
   4. Xác nhận → Nạp tiền thành công!
   5. Số dư được cập nhật ngay lập tức

C. RÚT TIỀN (WITHDRAW)
   
   1. Nhấn vào "Rút tiền"
   2. Chọn loại rút tiền:
      - Rút tiền đơn giản (chỉ cần PIN)
      - Rút tiền có OTP (PIN + OTP qua email)
   3. Nhập số tiền muốn rút
   4. Nhập PIN: 1234
   5. Nếu chọn rút có OTP → Nhập OTP
   6. Xác nhận → Rút tiền thành công!

D. ĐẶT VÉ PHIM (MOVIE BOOKING)
   
   1. Nhấn vào "Đặt vé phim"
   2. Chọn thành phố (TP.HCM, Hà Nội, Đà Nẵng...)
   3. Chọn rạp chiếu phim
   4. Chọn phim muốn xem
   5. Chọn suất chiếu (ngày, giờ)
   6. Chọn ghế ngồi (sơ đồ 8 hàng × 12 ghế)
      - Ghế trống: màu xanh
      - Ghế đã đặt: màu đỏ
   7. Xác nhận thông tin
   8. Nhập PIN: 1234
   9. Nếu >= 10,000,000 VND → Xác thực sinh trắc
   10. Thanh toán → Đặt vé thành công!
   11. Xem vé điện tử với mã QR

E. ĐẶT PHÒNG KHÁCH SẠN (HOTEL BOOKING)
   
   1. Nhấn vào "Đặt phòng"
   2. Chọn thành phố
   3. Chọn ngày nhận phòng (Check-in: 14:00)
   4. Chọn ngày trả phòng (Check-out: 12:00)
   5. Chọn khách sạn
   6. Chọn loại phòng (Standard, Deluxe, Suite...)
   7. Xác nhận thông tin
   8. Nhập PIN: 1234
   9. Nếu >= 10,000,000 VND → Xác thực sinh trắc
   10. Thanh toán → Đặt phòng thành công!
   11. Xem phiếu đặt phòng

F. LỊCH SỬ GIAO DỊCH (HISTORY)
   
   1. Nhấn vào "Lịch sử"
   2. Xem danh sách tất cả giao dịch
   3. Lọc theo:
      - Loại giao dịch (Chuyển tiền, Nạp tiền, Rút tiền...)
      - Thời gian (Hôm nay, Tuần này, Tháng này...)
   4. Nhấn vào giao dịch để xem chi tiết
   5. Tải biên lai (nếu có)

G. THÔNG BÁO (NOTIFICATIONS)
   
   1. Nhấn vào biểu tượng chuông
   2. Xem danh sách thông báo
   3. Các loại thông báo:
      - Thay đổi số dư (tiền vào/ra)
      - Thông báo hệ thống
      - Khuyến mãi
   4. Nhấn vào thông báo để xem chi tiết

H. NGƯỜI NHẬN ĐÃ LƯU (SAVED RECIPIENTS)
   
   1. Khi chuyển tiền, chọn "Lưu người nhận"
   2. Đặt biệt danh (nickname) cho người nhận
   3. Lần sau chuyển tiền → Chọn từ danh sách đã lưu
   4. Không cần nhập lại số tài khoản

I. THAY ĐỔI MẬT KHẨU (CHANGE PASSWORD)
   
   1. Vào "Cài đặt" → "Đổi mật khẩu"
   2. Nhập mật khẩu hiện tại
   3. Nhập mật khẩu mới (8+ ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt)
   4. Xác nhận mật khẩu mới
   5. Lưu → Đổi mật khẩu thành công!

J. THAY ĐỔI PIN (CHANGE PIN)
   
   1. Vào "Cài đặt" → "Đổi PIN"
   2. Nhập PIN hiện tại: 1234
   3. Nhập PIN mới (6 chữ số)
   4. Xác nhận PIN mới
   5. Lưu → Đổi PIN thành công!

--------

BƯỚC 4: ĐĂNG XUẤT
--------

1. Nhấn vào biểu tượng người dùng
2. Chọn "Đăng xuất"
3. Xác nhận → Đăng xuất thành công!

================================================================================
                            7. TẮT HỆ THỐNG
================================================================================

CÁCH 1: DÙNG SCRIPT (KHUYẾN NGHỊ) ⭐
--------

./stop-dev.sh

Kết quả:
🛑 Stopping VietBank Development Environment...

Stopping Vite dev server...
✅ Vite stopped

Stopping Firebase Emulators...
✅ Emulators stopped

✅ All services stopped

--------

CÁCH 2: DÙNG NPM SCRIPT
--------

npm run stop

--------

CÁCH 3: NHẤN CTRL+C
--------

Nếu anh đang chạy ./start-dev.sh trong terminal:
1. Quay lại terminal đó
2. Nhấn Ctrl+C
3. Đợi vài giây → Tất cả services dừng

--------

CÁCH 4: KILL THỦ CÔNG (Nếu cần)
--------

# Kill Vite
lsof -ti:5175 | xargs kill -9

# Kill Firebase Emulators
lsof -ti:9099 | xargs kill -9
lsof -ti:9000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:4000 | xargs kill -9

================================================================================
                        8. XỬ LÝ LỖI THƯỜNG GẶP
================================================================================

LỖI 1: "Port already in use"
--------

Triệu chứng:
Error: listen EADDRINUSE: address already in use :::5175

Nguyên nhân:
Services đã chạy từ trước

Giải pháp:
./stop-dev.sh
sleep 3
./start-dev.sh

--------

LỖI 2: "Permission denied" khi chạy script
--------

Triệu chứng:
bash: ./start-dev.sh: Permission denied

Nguyên nhân:
Script chưa có quyền execute

Giải pháp:
chmod +x start-dev.sh
chmod +x stop-dev.sh

--------

LỖI 3: "Cannot find module"
--------

Triệu chứng:
Error: Cannot find module 'vite'

Nguyên nhân:
Dependencies chưa được cài đặt

Giải pháp:
npm install

--------

LỖI 4: "Đăng nhập không đúng"
--------

Triệu chứng:
Nhập email/password nhưng báo sai

Nguyên nhân:
Dữ liệu emulator bị mất

Giải pháp:
./stop-dev.sh
sleep 3
./start-dev.sh

--------

LỖI 5: "Index not defined"
--------

Triệu chứng:
Index not defined, add ".indexOn": "email"

Nguyên nhân:
Database rules chưa load

Giải pháp:
./stop-dev.sh
sleep 3
./start-dev.sh

--------

LỖI 6: "Permission denied" trong console
--------

Triệu chứng:
Firebase login error: Error: Permission denied

Nguyên nhân:
Kết nối đến Production thay vì Emulator

Giải pháp:
1. Kiểm tra file .env có:
   VITE_USE_FUNCTIONS_EMULATOR=true
   VITE_USE_AUTH_EMULATOR=true

2. Restart Vite:
   Nhấn Ctrl+C trong terminal Vite
   npm run dev

--------

LỖI 7: Emulators không khởi động
--------

Triệu chứng:
❌ Failed to start emulators

Nguyên nhân:
Port đang bị chiếm hoặc Firebase CLI lỗi

Giải pháp:
# Kill tất cả processes
lsof -ti:9099 | xargs kill -9
lsof -ti:9000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Chạy lại
./start-dev.sh

================================================================================
                        9. CẤU TRÚC DỰ ÁN
================================================================================

Viet-Bank/
├── .env                        # Biến môi trường
├── .env.example                # Mẫu biến môi trường
├── .firebaserc                 # Cấu hình Firebase project
├── .gitignore                  # Git ignore rules
├── firebase.json               # Cấu hình Firebase
├── package.json                # Dependencies và scripts
├── vite.config.ts              # Cấu hình Vite
├── tsconfig.json               # Cấu hình TypeScript
├── tailwind.config.js          # Cấu hình Tailwind CSS
│
├── start-dev.sh                # Script khởi động tự động ⭐
├── stop-dev.sh                 # Script dừng hệ thống ⭐
│
├── README.md                   # Giới thiệu tổng quan
├── README.txt                  # Hướng dẫn chi tiết (file này)
│
├── docs/                       # Tài liệu
│   ├── PROJECT_OVERVIEW.md     # Tổng quan dự án
│   ├── DATABASE_SCHEMA.md      # Cấu trúc database
│   └── ...
│
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── ...
│   ├── pages/                  # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Transfer.tsx
│   │   └── ...
│   ├── services/               # Business logic
│   │   ├── authService.ts
│   │   ├── transferService.ts
│   │   ├── movieBookingService.ts
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities
│   │   ├── firebase.ts         # Firebase config
│   │   └── utils.ts
│   └── test/                   # Test files
│
├── public/                     # Static assets
├── android/                    # Android app (Capacitor)
├── ios/                        # iOS app (Capacitor)
│
├── database.rules.json         # Database rules (Production)
├── database.rules.emulator.json # Database rules (Emulator)
├── firestore.rules             # Firestore rules
│
└── node_modules/               # Dependencies (không commit)

================================================================================
                        10. THÔNG TIN LIÊN HỆ
================================================================================

REPOSITORY:
GitHub: https://github.com/MinhQuan-22/Viet-Bank.git

TÁC GIẢ:
Tên: Minh Quan
Email: chudinhminhquan1002@gmail.com

HỖ TRỢ:
- Đọc file README.md để hiểu tổng quan
- Đọc docs/PROJECT_OVERVIEW.md để hiểu kiến trúc
- Đọc docs/DATABASE_SCHEMA.md để hiểu cấu trúc database
- Mở issue trên GitHub nếu gặp vấn đề

TÀI LIỆU THAM KHẢO:
- STARTUP_GUIDE.md - Hướng dẫn khởi động tổng quan
- TROUBLESHOOTING_LOGIN.md - Khắc phục lỗi đăng nhập
- HUONG_DAN_KHOI_DONG_CHI_TIET.md - Hướng dẫn chi tiết từng bước
- HUONG_DAN_TAT_VA_CHAY_LAI.md - Hướng dẫn tắt và chạy lại

================================================================================
                            KẾT LUẬN
================================================================================

HỆ THỐNG VIETBANK ĐÃ SẴN SÀNG!

Để khởi động hệ thống, anh chỉ cần:

1. Mở Terminal
2. cd ~/Viet-Bank
3. ./start-dev.sh
4. Đợi 10-15 giây
5. Mở browser: http://localhost:5175/
6. Đăng nhập: thehoang.acc@gmail.com / Thedeptrai1
7. Bắt đầu sử dụng!

Để tắt hệ thống:

./stop-dev.sh

HOẶC nhấn Ctrl+C

================================================================================

Chúc anh sử dụng hệ thống hiệu quả! 🚀

Nếu có bất kỳ thắc mắc nào, vui lòng tham khảo các file tài liệu hoặc 
mở issue trên GitHub.

================================================================================
                        HẾT HƯỚNG DẪN
================================================================================

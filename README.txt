================================================================================
                    VIETBANK - DIGITAL BANKING APPLICATION
                    HƯỚNG DẪN KHỞI TẠO VÀ SỬ DỤNG HỆ THỐNG
================================================================================

Ngày cập nhật: 10/05/2026
Phiên bản: 1.0

================================================================================
                            1. KHỞI TẠO HỆ THỐNG
================================================================================

Để chuẩn bị môi trường chạy dự án lần đầu tiên, hãy thực hiện các bước sau:

1. Cài đặt các thư viện phụ thuộc (dependencies):
   Lệnh: npm install

2. Cấp quyền thực thi cho các script điều khiển (nếu dùng macOS/Linux):
   Lệnh: chmod +x start-dev.sh stop-dev.sh

================================================================================
                            2. KHỞI CHẠY HỆ THỐNG
================================================================================

Dự án sử dụng Firebase Emulator để giả lập môi trường Backend. Để chạy toàn bộ
hệ thống (Emulators + Seed Data + Frontend), chỉ cần dùng một lệnh duy nhất:

Lệnh: ./start-dev.sh

Hoặc dùng npm script:
Lệnh: npm run dev:full

Hệ thống sẽ tự động thực hiện:
- Khởi động Firebase Emulators (Auth, Firestore, Database, Functions).
- Nạp dữ liệu mẫu (Seed Data) cho người dùng, tài khoản ngân hàng, rạp phim, khách sạn.
- Khởi động Vite Dev Server cho giao diện người dùng.

================================================================================
                            3. THÔNG TIN ĐĂNG NHẬP
================================================================================

Sau khi hệ thống khởi động thành công, bạn có thể đăng nhập bằng tài khoản sau:

TÀI KHOẢN KHÁCH HÀNG TEST:
--------------------------
- Email:    thehoang.acc@gmail.com
- Password: Thedeptrai1
- Số dư:    10.000.000 VND
- Mã PIN:   1234

THÔNG TIN TRUY CẬP:
-------------------
- 📱 Ứng dụng (Web):   http://localhost:5175/
- 🔐 Firebase Console: http://127.0.0.1:4000/ (Quản lý dữ liệu giả lập)

================================================================================
                            4. CÁC LỆNH HỮU ÍCH
================================================================================

- Tắt toàn bộ hệ thống:    ./stop-dev.sh
- Chỉ chạy giao diện:      npm run dev
- Chỉ chạy Emulators:      npm run emulator:only
- Nạp lại dữ liệu mẫu:     npm run emulator:seed

================================================================================
                            5. LƯU Ý QUAN TRỌNG
================================================================================

- Dữ liệu trên Emulator là tạm thời, sẽ bị xóa sạch sau khi tắt hệ thống.
- Luôn sử dụng ./start-dev.sh để đảm bảo dữ liệu mẫu được nạp đầy đủ.
- Nếu gặp lỗi cổng (Port) đã bị chiếm, hãy chạy ./stop-dev.sh trước khi khởi động lại.

================================================================================

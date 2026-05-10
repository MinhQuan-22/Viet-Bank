# 🏦 VietBank - Digital Banking Application

Ứng dụng ngân hàng số hiện đại, đa nền tảng, tích hợp hệ sinh thái dịch vụ đa dạng.

---

## 📖 Giới Thiệu Tổng Quan

**VietBank** là một nền tảng ngân hàng số (Digital Banking) toàn diện, được thiết kế để cung cấp trải nghiệm tài chính an toàn, tiện lợi và hiện đại cho cả khách hàng cá nhân và nhân viên ngân hàng. Hệ thống không chỉ dừng lại ở các giao dịch tài chính cơ bản mà còn tích hợp các dịch vụ lối sống như đặt phòng khách sạn và đặt vé xem phim, tạo nên một hệ sinh thái dịch vụ số khép kín.

---

## ✨ Tính Năng & Chức Năng Chính

### 👤 Dành Cho Khách Hàng (Customer)
*   **Quản Lý Tài Khoản:** Theo dõi số dư, chi tiết tài khoản (Thanh toán, Tiết kiệm, Vay) và lịch sử giao dịch thời gian thực.
*   **Chuyển Tiền:** Chuyển khoản nội bộ và liên ngân hàng với quy trình xác thực OTP/Sinh trắc học an toàn.
*   **Thanh Toán QR:** Tích hợp trình quét mã QR và tạo mã QR cá nhân để nhận tiền nhanh chóng.
*   **Định Danh Điện Tử (E-KYC):** Quy trình đăng ký và xác thực danh tính trực tuyến, cập nhật hồ sơ giấy tờ dễ dàng.
*   **Tiện Ích Lối Sống:** 
    *   **Đặt Phòng Khách Sạn:** Tìm kiếm và đặt phòng trực tiếp trên bản đồ tích hợp.
    *   **Đặt Vé Xem Phim:** Chọn phim, rạp và chỗ ngồi thuận tiện.
*   **Thông Báo:** Hệ thống thông báo biến động số dư và tin tức tức thì.

### 👨‍💼 Dành Cho Nhân Viên (Bank Officer)
*   **Quản Lý Khách Hàng:** Quản lý danh sách khách hàng, tạo tài khoản mới và duyệt hồ sơ E-KYC.
*   **Giám Sát Giao Dịch:** Theo dõi các hoạt động giao dịch trong hệ thống.
*   **Quản Lý Lãi Suất:** Cập nhật bảng lãi suất tiết kiệm và cho vay linh hoạt.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### 💻 Frontend
*   **Ngôn ngữ:** TypeScript, JavaScript (ES6+)
*   **Framework:** React 18
*   **Công cụ build:** Vite (Siêu nhanh)
*   **UI/UX:** 
    *   Tailwind CSS (Styling)
    *   Shadcn UI (Component Library)
    *   Lucide React (Icons)
    *   Framer Motion (Animations)
    *   Recharts (Biểu đồ tài chính)

### ⚙️ Backend & Infrastructure
*   **Nền tảng:** Firebase (BaaS)
*   **Serverless Functions:** Firebase Functions (Node.js) để xử lý logic backend phức tạp và bảo mật.
*   **Xác thực:** Firebase Authentication (Hỗ trợ OTP, Email/Password).

### 🗄️ Cơ Sở Dữ Liệu (Database)
Hệ thống sử dụng kết hợp hai loại cơ sở dữ liệu của Google Firebase để tối ưu hiệu suất:
*   **Cloud Firestore:** Lưu trữ dữ liệu có cấu trúc như thông tin khách sạn, rạp phim, lịch sử giao dịch và dữ liệu E-KYC.
*   **Realtime Database:** Lưu trữ các dữ liệu cần đồng bộ tức thì như số dư tài khoản, trạng thái người dùng và cấu hình hệ thống.

### 📱 Mobile (Hybrid)
*   **Capacitor:** Hỗ trợ đóng gói ứng dụng lên các nền tảng Android và iOS với hiệu suất cao.

---

## 🚀 Bắt Đầu Ngay

Vui lòng tham khảo tệp [README.txt](file:///Users/chudinhminhquan/green-bank-app-main/README.txt) để biết hướng dẫn chi tiết về cách cài đặt, khởi chạy hệ thống và thông tin tài khoản đăng nhập thử nghiệm.

---

**VietBank** - *Vươn tầm trải nghiệm số.*

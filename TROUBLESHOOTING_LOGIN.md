# 🔧 Hướng Dẫn Khắc Phục Lỗi Đăng Nhập

**Vấn đề:** Đăng nhập bằng `thehoang.acc@gmail.com` / `Thedeptrai1` nhưng hệ thống báo sai

**Nguyên nhân có thể:**

1. Browser chưa load biến môi trường mới
2. Browser cache chưa được xóa
3. Frontend chưa kết nối đến Auth Emulator
4. Auth Emulator chưa chạy hoặc bị lỗi

---

## ✅ Giải Pháp - Làm Theo Từng Bước

### Bước 1: Kiểm Tra Emulators Đang Chạy

Mở Terminal và chạy:

```bash
lsof -i :9099  # Auth Emulator
lsof -i :9000  # Database Emulator
lsof -i :8080  # Firestore Emulator
```

**Kết quả mong đợi:** Cả 3 ports đều có process đang chạy

**Nếu không có:** Khởi động lại emulators:

```bash
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final
```

---

### Bước 2: Test Auth Emulator Trực Tiếp

Mở trình duyệt và truy cập:

```
http://localhost:5175/test-auth.html
```

**Nhấn nút "Test Login"**

**Kết quả mong đợi:**

- ✅ Hiển thị "Login Successful!"
- ✅ Hiển thị UID: R1giwMEGybsqaE4qGPzxZNX4uorG
- ✅ Hiển thị Email: thehoang.acc@gmail.com

**Nếu thất bại:**

- Mở Console (F12) và xem lỗi chi tiết
- Kiểm tra xem có message "Connected to Auth Emulator" không

---

### Bước 3: Hard Refresh Browser

**Trên Chrome/Edge:**

- Windows/Linux: `Ctrl + Shift + R`
- macOS: `Cmd + Shift + R`

**Trên Firefox:**

- Windows/Linux: `Ctrl + F5`
- macOS: `Cmd + Shift + R`

**Trên Safari:**

- `Cmd + Option + R`

Sau đó thử đăng nhập lại.

---

### Bước 4: Xóa Cache và Cookies

**Chrome/Edge:**

1. Nhấn `F12` để mở DevTools
2. Click chuột phải vào nút Refresh
3. Chọn "Empty Cache and Hard Reload"

**Hoặc:**

1. Vào Settings → Privacy and Security
2. Clear browsing data
3. Chọn "Cached images and files" và "Cookies"
4. Chọn "All time"
5. Click "Clear data"

---

### Bước 5: Kiểm Tra Console Logs

1. Mở trang đăng nhập: `http://localhost:5175/`
2. Nhấn `F12` để mở DevTools
3. Chuyển sang tab **Console**
4. Tìm các dòng log:

**Mong đợi thấy:**

```
[firebase] 🔧 Initializing with emulator mode...
[firebase] Connecting Firestore to emulator: 127.0.0.1:8080
[firebase] ✅ Firestore connected to emulator
[firebase] Connecting Functions to emulator: 127.0.0.1:5001
[firebase] ✅ Functions connected to emulator
[firebase] Auth emulator enabled
```

**Nếu KHÔNG thấy "Auth emulator enabled":**

- Frontend chưa kết nối Auth Emulator
- Cần restart Vite dev server

---

### Bước 6: Restart Vite Dev Server

Trong Terminal:

```bash
# Tìm process Vite
lsof -i :5175

# Hoặc dừng bằng Ctrl+C trong terminal đang chạy npm run dev

# Sau đó khởi động lại
npm run dev
```

Đợi Vite khởi động xong, sau đó:

1. Mở trình duyệt mới (hoặc Incognito/Private mode)
2. Truy cập `http://localhost:5175/`
3. Thử đăng nhập lại

---

### Bước 7: Kiểm Tra Biến Môi Trường

Kiểm tra file `.env`:

```bash
cat .env | grep VITE_USE_AUTH_EMULATOR
```

**Kết quả mong đợi:**

```
VITE_USE_AUTH_EMULATOR=true
```

**Nếu không có hoặc = false:**

```bash
# Thêm vào .env
echo "VITE_USE_AUTH_EMULATOR=true" >> .env

# Restart Vite
npm run dev
```

---

### Bước 8: Test Bằng Incognito/Private Mode

1. Mở trình duyệt ở chế độ Incognito/Private
2. Truy cập `http://localhost:5175/`
3. Mở Console (F12)
4. Kiểm tra xem có log "Auth emulator enabled" không
5. Thử đăng nhập

**Lý do:** Incognito mode không có cache, cookies cũ

---

### Bước 9: Kiểm Tra Network Tab

1. Mở trang đăng nhập
2. Nhấn `F12` → Tab **Network**
3. Nhập credentials và nhấn "Đăng nhập"
4. Xem request đi đến đâu:

**Mong đợi:**

- Request đến: `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`

**Nếu request đến production:**

- `https://identitytoolkit.googleapis.com/...`
- → Frontend chưa kết nối emulator

---

### Bước 10: Tạo Lại Tài Khoản (Nếu Cần)

Có thể tài khoản bị mất khi restart emulator:

```bash
# 1. Tạo Auth account
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "thehoang.acc@gmail.com", "password": "Thedeptrai1", "returnSecureToken": true}'

# 2. Lấy UID từ response (ví dụ: R1giwMEGybsqaE4qGPzxZNX4uorG)

# 3. Tạo profile
curl -X PUT "http://127.0.0.1:9000/users/R1giwMEGybsqaE4qGPzxZNX4uorG.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'

# 4. Tạo account
curl -X PUT "http://127.0.0.1:9000/accounts/100000000001.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "R1giwMEGybsqaE4qGPzxZNX4uorG",
    "accountNumber": "100000000001",
    "balance": 10000000,
    "status": "ACTIVE",
    "pin": "1234",
    "createdAt": 1778226271000
  }'
```

---

## 🎯 Checklist Nhanh

Kiểm tra từng mục:

- [ ] Auth Emulator đang chạy (port 9099)
- [ ] Database Emulator đang chạy (port 9000)
- [ ] Vite dev server đang chạy (port 5175)
- [ ] File `.env` có `VITE_USE_AUTH_EMULATOR=true`
- [ ] Đã restart Vite sau khi thay đổi `.env`
- [ ] Đã hard refresh browser (Ctrl+Shift+R)
- [ ] Đã xóa cache và cookies
- [ ] Console có log "Auth emulator enabled"
- [ ] Test page `test-auth.html` hoạt động
- [ ] Tài khoản tồn tại trong emulator

---

## 🔍 Debug Chi Tiết

### Kiểm Tra Tài Khoản Tồn Tại

```bash
# Kiểm tra user trong Database
curl -s "http://127.0.0.1:9000/users.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool

# Kiểm tra account
curl -s "http://127.0.0.1:9000/accounts.json?ns=vietbank-final-default-rtdb" | python3 -m json.tool
```

### Test Login Qua API

```bash
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "thehoang.acc@gmail.com",
    "password": "Thedeptrai1",
    "returnSecureToken": true
  }'
```

**Nếu thành công:** Auth Emulator hoạt động, vấn đề ở frontend
**Nếu thất bại:** Tài khoản chưa được tạo hoặc sai credentials

---

## 📞 Các Lỗi Thường Gặp

### Lỗi: "auth/invalid-credential"

**Nguyên nhân:**

- Sai email hoặc password
- Tài khoản chưa tồn tại trong emulator

**Giải pháp:**

- Kiểm tra lại credentials
- Tạo lại tài khoản (Bước 10)

### Lỗi: "auth/network-request-failed"

**Nguyên nhân:**

- Auth Emulator không chạy
- Frontend không kết nối đến emulator

**Giải pháp:**

- Khởi động lại emulator
- Restart Vite
- Hard refresh browser

### Lỗi: "Tài khoản đã bị tạm khóa"

**Nguyên nhân:**

- Đăng nhập sai quá 5 lần
- `status: "LOCKED"` trong database

**Giải pháp:**

```bash
# Reset loginFailCount
curl -X PATCH "http://127.0.0.1:9000/users/R1giwMEGybsqaE4qGPzxZNX4uorG/security.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{"loginFailCount": 0}'

# Đổi status về ACTIVE
curl -X PATCH "http://127.0.0.1:9000/users/R1giwMEGybsqaE4qGPzxZNX4uorG.json?ns=vietbank-final-default-rtdb" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'
```

---

## ✅ Giải Pháp Nhanh Nhất

**Nếu anh muốn giải quyết nhanh:**

1. **Restart tất cả:**

```bash
# Dừng Vite (Ctrl+C trong terminal)
# Dừng Emulators (Ctrl+C trong terminal)

# Khởi động lại Emulators
npx firebase emulators:start --only firestore,auth,database --project=vietbank-final

# Trong terminal khác, khởi động Vite
npm run dev
```

2. **Tạo lại tài khoản:**

```bash
# Chạy script tạo tài khoản (xem Bước 10)
```

3. **Mở browser mới (Incognito):**

```
http://localhost:5175/
```

4. **Test trước với test page:**

```
http://localhost:5175/test-auth.html
```

5. **Nếu test page OK, thử đăng nhập chính:**

```
http://localhost:5175/
Email: thehoang.acc@gmail.com
Password: Thedeptrai1
```

---

## 📚 Tài Liệu Tham Khảo

- `CURRENT_LOGIN_STATUS.md` - Trạng thái hệ thống hiện tại
- `AUTH_EMULATOR_SETUP.md` - Hướng dẫn setup emulator
- `LOGIN_ISSUE_RESOLVED.md` - Lịch sử giải quyết vấn đề

---

**Nếu vẫn không được, hãy cho em biết:**

1. Kết quả của test page (`test-auth.html`)
2. Console logs khi đăng nhập
3. Network tab - request đi đến đâu
4. Error message cụ thể

Em sẽ hỗ trợ thêm! 🚀

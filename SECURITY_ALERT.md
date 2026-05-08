# 🚨 CẢNH BÁO BẢO MẬT

## ⚠️ THÔNG TIN QUAN TRỌNG

File `.env` trong repository này **ĐÃ TỪNG** chứa thông tin nhạy cảm (email và mật khẩu thật) trong Git history.

### 📋 Thông tin đã bị lộ:

- **Email**: `thehoang.acc@gmail.com`
- **Password**: `Thedeptrai1`
- **Commit**: Các commit trước `33fc472`

### ✅ Đã khắc phục:

1. ✅ Xóa credentials khỏi file `.env` hiện tại
2. ✅ Thay bằng placeholders
3. ⚠️ **CHƯA XÓA** khỏi Git history (cần force push)

### 🔒 HÀNH ĐỘNG CẦN THỰC HIỆN NGAY:

#### 1. **ĐỔI MẬT KHẨU EMAIL NGAY LẬP TỨC!**

```
1. Truy cập: https://myaccount.google.com/security
2. Đổi mật khẩu Gmail: thehoang.acc@gmail.com
3. Kiểm tra "Recent security activity"
4. Xóa các sessions đáng ngờ
```

#### 2. **Xóa credentials khỏi Git history** (Tùy chọn - sẽ làm mất history)

```bash
# WARNING: This will rewrite Git history!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (DANGEROUS - will break other clones)
git push origin --force --all
```

#### 3. **Tạo App Password mới cho SMTP**

```
1. Truy cập: https://myaccount.google.com/apppasswords
2. Tạo App Password mới cho "Mail"
3. Copy password vào .env local (KHÔNG commit)
```

#### 4. **Kiểm tra Firebase Security Rules**

```
1. Truy cập: https://console.firebase.google.com/project/vietbank-final
2. Kiểm tra Firestore Rules
3. Kiểm tra Realtime Database Rules
4. Đảm bảo chỉ authenticated users mới được truy cập
```

### 📚 Best Practices:

1. ✅ **KHÔNG BAO GIỜ** commit file `.env` vào Git
2. ✅ Luôn dùng `.env.example` làm template
3. ✅ Add `.env` vào `.gitignore`
4. ✅ Dùng environment variables cho production
5. ✅ Rotate credentials định kỳ

### 🔗 Tài liệu tham khảo:

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Google: App Passwords](https://support.google.com/accounts/answer/185833)
- [Firebase: Security Rules](https://firebase.google.com/docs/rules)

---

**Ngày phát hiện**: 2026-05-08
**Trạng thái**: ⚠️ Credentials đã bị xóa khỏi code hiện tại, nhưng vẫn còn trong Git history

# 🔑 Tài Khoản Mặc Định - Default Accounts Guide

## ❌ Hiện Tại: Không Có Tài Khoản Mặc Định

**Vấn đề:**
- Sample data chỉ có employee (nhân viên)
- KHÔNG có tài khoản user để login
- Bạn phải tự tạo tài khoản trước khi sử dụng

---

## ✅ Giải Pháp: Tạo Tài Khoản Admin Mặc Định

### **Cách 1: Dùng Signup Form (Đơn giản)**

1. Vào http://localhost:3000
2. Click "Sign Up"
3. Điền thông tin:
   - Email: `admin@hrm.com`
   - Password: `Admin@123456`
4. Click "Sign Up"
5. Confirm email (nếu cần)
6. Vào Supabase → SQL Editor, chạy:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@hrm.com';
```

✅ Done! Bây giờ bạn có tài khoản admin

---

### **Cách 2: Tạo SQL Để Thêm Tài Khoản (Tự động hơn)**

Tôi sẽ tạo một file SQL mới để:
1. Tạo user auth trực tiếp
2. Gán role admin
3. Link với employee (optional)

---

## 📝 Các Tài Khoản Được Khuyến Nghị

### **1. Admin Account (Full Access)**
```
Email: admin@hrm.com
Password: Admin@123456
Role: admin
Access: All features
```

### **2. HR Account (HR Manager)**
```
Email: hr@hrm.com
Password: HR@123456
Role: hr
Access: Manage employees, leaves, payroll
```

### **3. Employee Accounts (Nhân viên)**
```
Tương ứng với 10 employees trong sample data:

EMP001 (Nguyễn Văn A) - Sales Manager
├─ Email: nguyena@hrm.com
└─ Password: Employee@123

EMP003 (Lê Minh C) - Senior Developer
├─ Email: minhlc@hrm.com
└─ Password: Employee@123

... (các employees khác tương tự)
```

---

## 🎯 Bước Tạo Tài Khoản Chi Tiết

### **Step 1: Signup Admin**
```
1. Vào http://localhost:3000
2. Click "Sign Up"
3. Email: admin@hrm.com
4. Password: Admin@123456
5. Click "Sign Up"
6. Confirm email (nếu cần)
```

### **Step 2: Gán Role Admin**
```sql
-- Vào Supabase → SQL Editor
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@hrm.com';
```

### **Step 3: Logout & Login Lại**
```
1. Logout (Settings → Sign Out)
2. Login lại với admin account
3. Refresh page - sẽ thấy admin dashboard
```

### **Step 4: Tạo HR Account (Optional)**
```
1. Logout
2. Signup: hr@hrm.com / HR@123456
3. Vào SQL Editor:

UPDATE public.users 
SET role = 'hr' 
WHERE email = 'hr@hrm.com';
```

---

## 🔐 User Roles & Permissions

### **Admin (Quản trị viên)**
```
✅ View all employees
✅ Create/Edit/Delete employees
✅ View all departments
✅ Create/Edit/Delete departments
✅ View all positions
✅ Create/Edit/Delete positions
✅ View all attendance
✅ Approve/Reject leaves
✅ Calculate payroll
✅ Create payroll
✅ View all users
```

### **HR (Nhân sự)**
```
✅ View all employees
✅ Create/Edit employees (không delete)
✅ View all departments (read-only)
✅ View all positions (read-only)
✅ View all attendance
✅ Approve/Reject leaves
✅ Create/Edit payroll
```

### **Employee (Nhân viên)**
```
✅ View own profile
✅ View own attendance
✅ Submit leave request
✅ View own leave requests
✅ View own payroll
❌ Cannot edit other employees
❌ Cannot delete records
```

---

## 📊 Sample Accounts to Create

Nếu muốn test đầy đủ, tạo những account này:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@hrm.com | Admin@123456 | admin | Admin testing |
| hr@hrm.com | HR@123456 | hr | HR operations |
| nguyena@hrm.com | Emp@123456 | employee | Sales Manager |
| minhlc@hrm.com | Emp@123456 | employee | Senior Dev |
| quocf@hrm.com | Emp@123456 | employee | HR Manager |

---

## ⚡ Quick Setup (Nhanh nhất)

### **Just 3 Steps:**

1. **Signup Admin**
```
Go to: http://localhost:3000/auth/sign-up
Email: admin@hrm.com
Password: Admin@123456
```

2. **Set Role**
```sql
-- Paste vào Supabase SQL Editor
UPDATE public.users SET role = 'admin' WHERE email = 'admin@hrm.com';
```

3. **Login & Enjoy**
```
Logout & Login lại
Vào Dashboard
Test CRUD operations
```

---

## 🚀 Next Steps

1. ✅ Create admin account (3 minutes)
2. ✅ Test login (1 minute)
3. ✅ Test CRUD operations (10 minutes)
4. ✅ Create more accounts if needed (5 minutes)

**Total time: ~20 minutes to have a fully working HRM system!**

---

## 🔍 Verify Accounts Created

Vào Supabase → **Authentication → Users**, bạn sẽ thấy:

```
Email: admin@hrm.com
├─ Confirmed: ✓
├─ Last Sign In: (timestamp)
└─ User ID: (UUID)

Email: hr@hrm.com (if created)
├─ Confirmed: ✓
└─ ...
```

Vào Supabase → **SQL Editor**, chạy:

```sql
SELECT id, email, role FROM public.users;
```

Sẽ thấy danh sách users:
```
id                                   | email          | role
─────────────────────────────────────────────────────────────
550e8400-e29b-41d4-a716-446655440000 | admin@hrm.com  | admin
550e8400-e29b-41d4-a716-446655440001 | hr@hrm.com     | hr
```

---

## ⚠️ Troubleshooting

### **Cannot login after signup**
```
Solution:
1. Vào Supabase → Authentication → Users
2. Tìm user
3. Check "Confirmed At" - nếu NULL, click email address to confirm
```

### **Still cannot see admin features**
```
Solution:
1. Verify role là 'admin' (không phải 'employee')
   SELECT * FROM public.users WHERE email = 'admin@hrm.com';
2. Role phải chính xác: admin / hr / employee
3. Logout completely & Login lại
4. Refresh page (F5)
```

### **Forget password**
```
Solution:
1. Vào Supabase → Authentication → Users
2. Tìm user
3. Click "Reset Password"
4. Email sẽ được gửi (check spam folder)
```

---

**Các tài khoản đã được sử dụng: Không có - tất cả phải tạo**
**Tài khoản được khuyến nghị: admin@hrm.com / Admin@123456**
**Setup time: ~5 phút**
**Status: Ready to test! 🚀**

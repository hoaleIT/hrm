# 🚀 HRM System - Project Setup Guide

## Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Clone Project](#clone-project)
3. [Setup Supabase](#setup-supabase)
4. [Cài Đặt Dependencies](#cài-đặt-dependencies)
5. [Cấu Hình Environment](#cấu-hình-environment)
6. [Chạy Dev Server](#chạy-dev-server)
7. [Tạo Tài Khoản Admin](#tạo-tài-khoản-admin)
8. [Kiểm Tra Ứng Dụng](#kiểm-tra-ứng-dụng)
9. [Troubleshooting](#troubleshooting)

---

## Yêu Cầu Hệ Thống

Đảm bảo bạn đã cài đặt:
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** hoặc **pnpm** (đi kèm Node.js)
- **Git** ([download](https://git-scm.com/))
- **Supabase Account** ([đăng ký miễn phí](https://supabase.com))

Kiểm tra versions:
```bash
node --version  # Phải >= 18.0.0
npm --version   # Phải >= 9.0.0
git --version   # Phải >= 2.0.0
```

---

## Clone Project

### Từ GitHub
```bash
# Clone repository
git clone https://github.com/your-username/hrm-system.git
cd hrm-system

# Hoặc: Download ZIP từ v0
# 1. Click "..." → "Download ZIP"
# 2. Giải nén vào folder
# 3. cd vào folder
```

### Hoặc: Local Folder
Nếu bạn có file từ v0, copy vào folder:
```bash
cd /path/to/your/project
```

---

## Setup Supabase

Bạn đã có database 8 bảng, bây giờ cần lấy credentials từ Supabase.

### Bước 1: Login Supabase Dashboard
1. Vào https://app.supabase.com
2. Login bằng email/password hoặc GitHub
3. Chọn project của bạn

### Bước 2: Lấy Supabase URL & Key
1. Click **"Settings"** (gear icon) → **"API"**
2. Tìm section **"Project API keys"**
3. Copy 2 thông tin này:
   - **Supabase URL** (dòng "Project URL")
   - **Supabase Anon Key** (dòng "anon public")

**Ví dụ:**
```
Supabase URL: https://xyzzzzz.supabase.co
Supabase Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Bước 3: Lưu Credentials
Giữ 2 cái này, bạn sẽ dùng ở bước tiếp theo.

---

## Cài Đặt Dependencies

### Bước 1: Mở Terminal
```bash
cd /path/to/hrm-system
```

### Bước 2: Cài Dependencies
```bash
# Nếu dùng npm
npm install

# Hoặc nếu dùng pnpm (nhanh hơn)
pnpm install

# Hoặc nếu dùng yarn
yarn install
```

**Cái này mất 2-3 phút. Chờ cho đến khi xong.**

Kiểm tra kết quả:
```bash
# Nên thấy folder "node_modules" được tạo
ls -la

# Nên thấy tất cả dependencies được cài
npm list --depth=0
```

---

## Cấu Hình Environment

### Bước 1: Tạo File .env.local
```bash
# Trong root folder của project, tạo file
touch .env.local
```

### Bước 2: Thêm Supabase Credentials
Mở file `.env.local` (trống), thêm:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Thay thế:**
- `your-project-id` → ID từ Supabase URL
- `your-anon-key-here` → Key mà bạn copy ở Bước 2 phần Setup Supabase

**Ví dụ đầy đủ:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzzzzz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5enppoIiwiYXVkIjoicG9zdGdyZXMifQ.example-key-here
```

### Bước 3: Lưu File
- Nhấn Ctrl+S (hoặc Cmd+S trên Mac)
- File sẽ được lưu tự động

**❗ QUAN TRỌNG:**
- Không bao giờ commit file `.env.local` lên GitHub
- File `.gitignore` đã được setup để ignore nó
- Mỗi lần deploy cần thêm env vars vào hosting (Vercel/Netlify)

---

## Chạy Dev Server

### Bước 1: Start Server
```bash
npm run dev
```

Bạn sẽ thấy:
```
> my-project@0.1.0 dev
> next dev

  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000

Ready in 2.1s
```

### Bước 2: Mở Browser
Vào: **http://localhost:3000**

Bạn sẽ thấy trang login với màu xanh dương.

### Bước 3: Giữ Terminal Mở
Terminal phải luôn mở khi phát triển. Để dừng:
```bash
# Nhấn Ctrl+C (hoặc Cmd+C trên Mac)
```

---

## Tạo Tài Khoản Admin

### Cách 1: Signup Trên Ứng Dụng
1. Vào http://localhost:3000
2. Click **"Create an account"**
3. Điền:
   - Email: `admin@company.com`
   - Password: `Admin@123456` (8+ chars, uppercase, lowercase, numbers)
   - Confirm: `Admin@123456`
4. Click **"Sign Up"**
5. Verify email (check spam folder)

### Cách 2: Tạo Trực Tiếp trong Supabase
1. Vào Supabase Dashboard
2. Click **"Authentication"** → **"Users"**
3. Click **"Invite"** → Email cấp mời
4. User sẽ nhận email, click link để setup password

### Bước Cuối: Gán Role Admin
1. Vào Supabase Dashboard
2. Click **"SQL Editor"**
3. Chạy query:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@company.com';
```

4. Click **"RUN"**

**Kiểm tra:**
```sql
SELECT id, email, role FROM public.users;
```

---

## Kiểm Tra Ứng Dụng

### Bước 1: Login
- Email: `admin@company.com`
- Password: `Admin@123456`
- Click **"Sign In"**

### Bước 2: Verify Trang Dashboard
Bạn sẽ thấy:
- ✅ Sidebar với menu (Employees, Departments, etc.)
- ✅ Màu xanh dương (primary color)
- ✅ Dashboard statistics
- ✅ List employees từ database

### Bước 3: Test CRUD Operations
- ✅ **Create**: Click "Add Employee" → điền form → Save
- ✅ **Read**: View danh sách employees
- ✅ **Update**: Click employee → Edit → Save
- ✅ **Delete**: Click employee → Delete button

### Bước 4: Check Dark Mode
- Click icon moon (nếu có) → toggle dark/light mode
- Verify màu xanh dương vẫn đẹp

---

## Troubleshooting

### ❌ Error: "Cannot find module '@supabase/supabase-js'"
**Giải pháp:**
```bash
# Xóa node_modules
rm -rf node_modules

# Cài lại
npm install

# Restart dev server
npm run dev
```

### ❌ Error: "NEXT_PUBLIC_SUPABASE_URL is not set"
**Giải pháp:**
- Check file `.env.local` có tồn tại?
- Check credentials đúng chưa?
- Restart dev server sau khi thêm env vars

```bash
# Dừng server
Ctrl+C

# Restart
npm run dev
```

### ❌ Login không hoạt động
**Giải pháp:**
1. Check Supabase project có hoạt động?
   - Vào https://app.supabase.com
   - Xem status (xanh = ok)

2. Check email credentials đúng không?
   - Verify password đủ 8 ký tự
   - Verify không có space

3. Check database có 8 bảng?
   - Vào Supabase → SQL Editor
   - Run: `SELECT tablename FROM pg_tables WHERE schemaname='public';`
   - Nên thấy: users, departments, positions, employees, attendance, leave_requests, payrolls, notifications

### ❌ Database bảng không có data
**Giải pháp:**
- Bạn nói đã có database 8 bảng rồi
- Kiểm tra dữ liệu:

```sql
-- Kiểm tra users
SELECT COUNT(*) FROM public.users;

-- Kiểm tra employees
SELECT COUNT(*) FROM public.employees;

-- Kiểm tra departments
SELECT COUNT(*) FROM public.departments;
```

Nếu COUNT=0, cần thêm sample data:
```sql
-- Run script sample data từ file sql/02_sample_data.sql
```

### ❌ Tailwind CSS không load đúng
**Giải pháp:**
```bash
# Xóa cache Next.js
rm -rf .next

# Restart dev server
npm run dev
```

### ❌ Port 3000 đã được dùng
**Giải pháp:**
```bash
# Dùng port khác
npm run dev -- -p 3001

# Hoặc kill process dùng port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Production Deployment

### Deploy lên Vercel (Recommended)
1. Push code lên GitHub:
```bash
git add .
git commit -m "Initial HRM setup"
git push origin main
```

2. Vào https://vercel.com
3. Click "Import Project"
4. Chọn GitHub repo
5. Thêm Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Deploy lên Netlify
1. Connect GitHub
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Thêm env vars
5. Deploy

---

## File Structure
```
hrm-system/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/
│   ├── employees/
│   ├── departments/
│   ├── attendance/
│   ├── payroll/
│   ├── leave/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── employee-dialog.tsx
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── public/
├── .env.local ← Tạo file này
├── .gitignore
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Xong! ✅

Nếu tất cả mọi thứ hoạt động:
1. ✅ npm install thành công
2. ✅ .env.local có credentials
3. ✅ Dev server chạy trên port 3000
4. ✅ Có thể login với admin account
5. ✅ Thấy dashboard với dữ liệu từ database
6. ✅ CRUD operations hoạt động

**Bạn đã sẵn sàng phát triển!** 🎉

---

## Cần Giúp?

Nếu có lỗi:
1. Check lại từng bước trong guide này
2. Xem phần Troubleshooting
3. Check console browser (F12) có error gì
4. Check terminal có warning/error gì

---

**Last Updated**: June 2024
**Node Version**: 18+
**Next.js**: 16.2.6
**Supabase**: Latest

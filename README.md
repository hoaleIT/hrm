# Hệ Thống HRM - Quản Lý Nguồn Nhân Lực (Human Resource Management)

Hệ thống Quản lý Nguồn nhân lực (HRM) hiện đại, sẵn sàng triển khai thực tế, được xây dựng bằng Next.js 16, TypeScript, Tailwind CSS và Supabase. Hệ thống bao gồm đầy đủ chức năng xác thực người dùng, quản lý nhân viên và các thao tác CRUD hoàn chỉnh.

## Khởi động nhanh (30 phút)

**Xem:** `QUICK_SETUP_CHECKLIST.txt` để làm theo hướng dẫn từng bước.

Hoặc thực hiện nhanh theo các bước sau:

```bash
# 1. Lấy thông tin Supabase từ https://app.supabase.com
# 2. Tạo file .env.local với thông tin xác thực
# 3. Cài đặt và chạy dự án
npm install
npm run dev

# 4. Truy cập http://localhost:3000
# 5. Đăng ký hoặc đăng nhập
```

## Tính năng

### Hệ thống xác thực

* Đăng ký tài khoản với kiểm tra email và mật khẩu
* Đăng nhập với xác thực thông tin
* Quên mật khẩu và gửi email đặt lại mật khẩu
* Chức năng đặt lại mật khẩu
* Yêu cầu xác nhận email
* Phân quyền theo vai trò (Admin, HR, Employee)

### Quản lý nhân viên

* CRUD đầy đủ cho nhân viên
* Hồ sơ nhân viên chi tiết
* Phân công phòng ban và vị trí công việc
* Theo dõi trạng thái (Đang làm việc, Nghỉ việc, Nghỉ phép)
* Tìm kiếm và lọc nhân viên

### Dashboard & Thống kê

* Thống kê nhân viên theo thời gian thực
* Biểu đồ trực quan bằng Recharts
* Biểu đồ phân bổ nhân sự theo phòng ban
* Tổng quan yêu cầu nghỉ phép

### Quản lý phòng ban & chức vụ

* Tạo/Sửa/Xóa phòng ban
* Quản lý chức vụ và phụ cấp
* Gán quản lý cho phòng ban
* Theo dõi số lượng nhân viên

### Quản lý chấm công

* Hệ thống Check-in / Check-out
* Lưu trữ lịch sử chấm công và báo cáo
* Quản lý trạng thái (Có mặt, Đi muộn, Vắng mặt, Nghỉ phép)
* Theo dõi thời gian làm việc

### Quản lý nghỉ phép

* Nhân viên gửi yêu cầu nghỉ phép
* Hỗ trợ nhiều loại nghỉ phép (Nghỉ năm, Nghỉ ốm, Nghỉ cá nhân)
* Quy trình phê duyệt hoặc từ chối
* Theo dõi số ngày phép còn lại

### Quản lý lương

* Tính lương hàng tháng
* Quản lý lương cơ bản, phụ cấp, thưởng, khấu trừ
* Quản lý trạng thái bảng lương
* Định dạng tiền tệ

### Thiết kế & Trải nghiệm người dùng

* Giao diện hiện đại với tông màu xanh dương nhạt
* Hỗ trợ Dark Mode
* Responsive trên điện thoại, máy tính bảng và máy tính
* Hiệu ứng chuyển động mượt mà
* Giao diện chuyên nghiệp sử dụng shadcn/ui

## Công nghệ sử dụng

| Danh mục      | Công nghệ                        |
| ------------- | -------------------------------- |
| Frontend      | Next.js 16, React 19, TypeScript |
| Giao diện     | Tailwind CSS 4, shadcn/ui        |
| Cơ sở dữ liệu | Supabase PostgreSQL (8 bảng)     |
| Xác thực      | Supabase Auth (Email/Password)   |
| Form          | React Hook Form, Zod             |
| Biểu đồ       | Recharts                         |
| Icons         | Lucide React                     |

## Hướng dẫn cài đặt

### Bước 1: Chuẩn bị (5 phút)

1. Tải file ZIP dự án từ v0 và giải nén
2. Mở thư mục bằng VS Code: `File → Open Folder`
3. Mở Terminal: `Terminal → New Terminal`

### Bước 2: Lấy thông tin Supabase (5 phút)

1. Truy cập: https://app.supabase.com
2. Đăng nhập và chọn dự án
3. Chọn `Settings → API`
4. Sao chép:

   * **Project URL** (Ví dụ: `https://xyzzzzz.supabase.co`)
   * **anon public key** (Bắt đầu bằng `eyJ...`)

### Bước 3: Thiết lập biến môi trường (5 phút)

Tạo file `.env.local` tại thư mục gốc của dự án:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

Thay bằng thông tin Supabase thực tế của bạn.

### Bước 4: Cài đặt thư viện (3 phút)

```bash
npm install

# hoặc
pnpm install
```

### Bước 5: Khởi động dự án (2 phút)

```bash
npm run dev
```

Sau khi chạy thành công sẽ hiển thị:

```bash
▲ Next.js 16
- Local: http://localhost:3000
```

### Bước 6: Kiểm tra ứng dụng (5 phút)

1. Mở http://localhost:3000
2. Chọn "Tạo tài khoản"
3. Đăng ký bằng email của bạn
4. Xác nhận email (kiểm tra cả thư mục Spam)
5. Đăng nhập và trải nghiệm hệ thống

**Hoàn tất!** Bạn đã có một hệ thống HRM hoạt động đầy đủ.

## Tài liệu chi tiết

* `SETUP_PROJECT.md` - Hướng dẫn cài đặt đầy đủ và xử lý lỗi
* `QUICK_SETUP_CHECKLIST.txt` - Danh sách kiểm tra trong 30 phút
* `IMPLEMENTATION_COMPLETE.md` - Chi tiết các tính năng đã triển khai

## Cấu trúc dự án

```text
hrm-system/
├── app/
│   ├── auth/               # Đăng nhập, đăng ký, đặt lại mật khẩu
│   ├── dashboard/          # Dashboard chính
│   ├── employees/          # CRUD nhân viên
│   ├── departments/        # Quản lý phòng ban
│   ├── positions/          # Quản lý chức vụ
│   ├── attendance/         # Quản lý chấm công
│   ├── leave/              # Quản lý nghỉ phép
│   ├── payroll/            # Quản lý lương
│   ├── globals.css         # Theme màu xanh
│   └── layout.tsx          # Layout gốc
├── components/
│   ├── ui/                 # Thành phần shadcn/ui
│   ├── employee-dialog.tsx # Form nhân viên
│   └── ...
├── lib/
│   ├── supabase/           # Client kết nối CSDL
│   └── utils.ts
├── .env.local              # File cần tạo
├── package.json
└── tsconfig.json
```

## Cơ sở dữ liệu (8 bảng)

| Bảng           | Chức năng           | Các cột chính                                                |
| -------------- | ------------------- | ------------------------------------------------------------ |
| users          | Xác thực người dùng | id, email, role, created_at                                  |
| employees      | Thông tin nhân viên | id, code, name, email, salary, status                        |
| departments    | Phòng ban           | id, name, description, manager_id                            |
| positions      | Chức vụ             | id, name, allowance                                          |
| attendance     | Chấm công           | id, employee_id, date, check_in, check_out, status           |
| leave_requests | Yêu cầu nghỉ phép   | id, employee_id, type, start_date, end_date, status          |
| payrolls       | Bảng lương          | id, employee_id, month, base_salary, allowance, bonus, total |
| notifications  | Thông báo hệ thống  | id, user_id, message, read_at                                |

## Vai trò người dùng

| Vai trò  | Mức quyền  | Chức năng                                                       |
| -------- | ---------- | --------------------------------------------------------------- |
| Admin    | Toàn quyền | Tất cả chức năng và quản lý người dùng                          |
| HR       | Quyền cao  | Quản lý nhân viên, phòng ban, chấm công, lương, duyệt nghỉ phép |
| Employee | Hạn chế    | Xem hồ sơ cá nhân, nghỉ phép, chấm công và lương của bản thân   |

## Giao diện màu sắc

* Chế độ sáng: Sky Blue (#0369a1) làm màu chủ đạo, nền trắng
* Chế độ tối: Cyan (#06b6d4) làm màu chủ đạo, nền xám đậm
* Tương thích trên mọi thiết bị

## Khắc phục sự cố

### Không đăng nhập được?

* Kiểm tra email đã được xác nhận chưa
* Kiểm tra dự án Supabase còn hoạt động không
* Xem mục Troubleshooting trong `SETUP_PROJECT.md`

### Không cài đặt được thư viện?

```bash
rm -rf node_modules package-lock.json
npm install
```

### Cổng 3000 đang được sử dụng?

```bash
npm run dev -- -p 3001
```

## Các bước tiếp theo

1. Hoàn thành `QUICK_SETUP_CHECKLIST.txt`
2. Kiểm tra toàn bộ chức năng CRUD
3. Tạo tài khoản Admin trong Supabase
4. Triển khai hệ thống lên Vercel

## Triển khai lên Vercel

```bash
git push origin main
```

Sau đó:

* Kết nối Repository với Vercel
* Thêm biến môi trường trong phần Settings
* Thực hiện Deploy

## Hỗ trợ & Tài liệu

* `SETUP_PROJECT.md` - Hướng dẫn cài đặt chi tiết ⭐
* `QUICK_SETUP_CHECKLIST.txt` - Checklist 30 phút
* `IMPLEMENTATION_COMPLETE.md` - Tổng quan tính năng
* `BUILD_COMPLETE.txt` - Tóm tắt quá trình build

---

**Ngày tạo:** 2024
**Công nghệ:** Next.js 16, Supabase, Tailwind CSS
**Giấy phép:** Riêng tư (Private License)

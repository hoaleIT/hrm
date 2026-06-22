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
├── .env.local            
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







### Không cài đặt được thư viện?

```bash
rm -rf node_modules package-lock.json
npm install
```

### Cổng 3000 đang được sử dụng?

```bash
npm run dev -- -p 3001
```





# 🗄️ HRM System - Database Setup Guide

## **Database Overview**

Dự án HRM sử dụng **Supabase PostgreSQL** với 8 tables chính để quản lý tất cả dữ liệu hệ thống.

---

## **📊 Complete Database Schema**

### **1. TABLE: users** (Tài khoản người dùng)

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,                    -- ID từ auth.users
  email VARCHAR NOT NULL UNIQUE,          -- Email đăng nhập
  role user_role DEFAULT 'employee',      -- 'admin', 'hr', 'employee'
  employee_id UUID,                       -- Link đến employee
  created_at TIMESTAMP WITH TIME ZONE,    -- Ngày tạo
  updated_at TIMESTAMP WITH TIME ZONE     -- Ngày cập nhật
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Primary key, link từ auth.users |
| `email` | VARCHAR | ✅ | Email unique để login |
| `role` | ENUM | ✅ | 'admin', 'hr', 'employee' |
| `employee_id` | UUID | ❌ | Foreign key đến employees |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

**Giá trị ENUM cho role:**
```
'admin'    - Toàn quyền hệ thống
'hr'       - Quản lý nhân viên, chấm công, lương
'employee' - Nhân viên thường
```

---

### **2. TABLE: departments** (Phòng ban)

```sql
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,      -- Tên phòng ban
  description TEXT,                       -- Mô tả chi tiết
  manager_id UUID,                        -- Trưởng phòng (link users)
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `name` | VARCHAR(255) | ✅ | Tên phòng ban (unique) |
| `description` | TEXT | ❌ | Mô tả công việc phòng ban |
| `manager_id` | UUID | ❌ | Foreign key → users.id |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

**Example Data:**
```
Sales       - Phòng kinh doanh
IT          - Phòng công nghệ thông tin
HR          - Phòng nhân sự
Finance     - Phòng tài chính
```

---

### **3. TABLE: positions** (Chức vụ/Vị trí công việc)

```sql
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,      -- Tên chức vụ
  description TEXT,                       -- Mô tả công việc
  allowance DECIMAL(12, 2) DEFAULT 0,     -- Phụ cấp chức vụ (VND)
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `name` | VARCHAR(255) | ✅ | Tên chức vụ (unique) |
| `description` | TEXT | ❌ | Mô tả chi tiết công việc |
| `allowance` | DECIMAL(12,2) | ❌ | Phụ cấp chức vụ (VND) |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

**Example Data:**
```
Manager     - 5,000,000 VND
Developer   - 3,000,000 VND
Designer    - 2,500,000 VND
HR Staff    - 2,000,000 VND
```

---

### **4. TABLE: employees** (Nhân viên)

```sql
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code VARCHAR(50) NOT NULL UNIQUE,  -- Mã nhân viên (NV001, NV002...)
  full_name VARCHAR(255) NOT NULL,             -- Họ tên đầy đủ
  email VARCHAR(255) NOT NULL UNIQUE,          -- Email công ty
  phone VARCHAR(20),                           -- Số điện thoại
  gender gender_enum,                          -- 'male', 'female', 'other'
  birth_date DATE,                             -- Ngày sinh
  address TEXT,                                -- Địa chỉ
  department_id UUID,                          -- Foreign key → departments.id
  position_id UUID,                            -- Foreign key → positions.id
  salary DECIMAL(12, 2) DEFAULT 0,             -- Lương cơ bản (VND)
  avatar_url VARCHAR(500),                     -- URL ảnh đại diện
  status employee_status DEFAULT 'active',     -- 'active', 'inactive', 'on_leave'
  start_date DATE NOT NULL,                    -- Ngày vào làm
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `employee_code` | VARCHAR(50) | ✅ | Mã NV unique (NV001, NV002...) |
| `full_name` | VARCHAR(255) | ✅ | Họ tên đầy đủ |
| `email` | VARCHAR(255) | ✅ | Email công ty |
| `phone` | VARCHAR(20) | ❌ | Số điện thoại |
| `gender` | ENUM | ❌ | 'male', 'female', 'other' |
| `birth_date` | DATE | ❌ | Ngày sinh |
| `address` | TEXT | ❌ | Địa chỉ nhà |
| `department_id` | UUID | ❌ | Foreign key → departments.id |
| `position_id` | UUID | ❌ | Foreign key → positions.id |
| `salary` | DECIMAL(12,2) | ❌ | Lương cơ bản (VND) |
| `avatar_url` | VARCHAR(500) | ❌ | URL ảnh avatar |
| `status` | ENUM | ✅ | 'active', 'inactive', 'on_leave' |
| `start_date` | DATE | ✅ | Ngày vào làm |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

---

### **5. TABLE: attendance** (Chấm công)

```sql
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL,               -- Foreign key → employees.id
  date DATE NOT NULL,                      -- Ngày chấm công
  check_in TIMESTAMP WITH TIME ZONE,       -- Giờ vào
  check_out TIMESTAMP WITH TIME ZONE,      -- Giờ ra
  status attendance_status DEFAULT 'absent', -- 'present', 'late', 'absent', 'leave'
  notes TEXT,                              -- Ghi chú
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(employee_id, date)                -- 1 record/employee/day
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `employee_id` | UUID | ✅ | Foreign key → employees.id |
| `date` | DATE | ✅ | Ngày chấm công |
| `check_in` | TIMESTAMP | ❌ | Thời gian vào (HH:MM) |
| `check_out` | TIMESTAMP | ❌ | Thời gian ra (HH:MM) |
| `status` | ENUM | ✅ | 'present', 'late', 'absent', 'leave' |
| `notes` | TEXT | ❌ | Ghi chú bổ sung |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

---

### **6. TABLE: leave_requests** (Đơn xin nghỉ)

```sql
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL,               -- Foreign key → employees.id
  leave_type VARCHAR(100) NOT NULL,        -- Loại nghỉ (Annual, Sick, Personal...)
  start_date DATE NOT NULL,                -- Ngày bắt đầu
  end_date DATE NOT NULL,                  -- Ngày kết thúc
  reason TEXT,                             -- Lý do xin nghỉ
  status leave_status DEFAULT 'pending',   -- 'pending', 'approved', 'rejected'
  reviewed_by UUID,                        -- Foreign key → users.id (HR/Admin đã duyệt)
  reviewed_at TIMESTAMP WITH TIME ZONE,    -- Ngày duyệt
  comments TEXT,                           -- Nhận xét
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `employee_id` | UUID | ✅ | Foreign key → employees.id |
| `leave_type` | VARCHAR(100) | ✅ | 'Annual', 'Sick', 'Personal', 'Maternity'... |
| `start_date` | DATE | ✅ | Từ ngày |
| `end_date` | DATE | ✅ | Đến ngày |
| `reason` | TEXT | ❌ | Lý do xin nghỉ |
| `status` | ENUM | ✅ | 'pending', 'approved', 'rejected' |
| `reviewed_by` | UUID | ❌ | Foreign key → users.id |
| `reviewed_at` | TIMESTAMP | ❌ | Thời gian duyệt |
| `comments` | TEXT | ❌ | Nhận xét từ HR/Admin |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

---

### **7. TABLE: payrolls** (Bảng lương)

```sql
CREATE TABLE public.payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL,               -- Foreign key → employees.id
  month DATE NOT NULL,                     -- Tháng tính lương (YYYY-MM-01)
  base_salary DECIMAL(12, 2) DEFAULT 0,    -- Lương cơ bản
  allowance DECIMAL(12, 2) DEFAULT 0,      -- Phụ cấp
  bonus DECIMAL(12, 2) DEFAULT 0,          -- Thưởng
  deduction DECIMAL(12, 2) DEFAULT 0,      -- Khấu trừ
  total_salary DECIMAL(12, 2) DEFAULT 0,   -- Tổng lương (tự tính)
  status payroll_status DEFAULT 'draft',   -- 'draft', 'processed', 'paid'
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(employee_id, month)               -- 1 record/employee/month
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `employee_id` | UUID | ✅ | Foreign key → employees.id |
| `month` | DATE | ✅ | Tháng (format: 2024-01-01) |
| `base_salary` | DECIMAL(12,2) | ❌ | Lương cơ bản (VND) |
| `allowance` | DECIMAL(12,2) | ❌ | Phụ cấp (VND) |
| `bonus` | DECIMAL(12,2) | ❌ | Thưởng (VND) |
| `deduction` | DECIMAL(12,2) | ❌ | Khấu trừ (VND) |
| `total_salary` | DECIMAL(12,2) | ✅ | = base + allowance + bonus - deduction |
| `status` | ENUM | ✅ | 'draft', 'processed', 'paid' |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

---

### **8. TABLE: notifications** (Thông báo)

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,                   -- Foreign key → users.id
  type VARCHAR(100) NOT NULL,              -- Loại thông báo
  title VARCHAR(255) NOT NULL,             -- Tiêu đề
  message TEXT,                            -- Nội dung
  read BOOLEAN DEFAULT FALSE,              -- Đã đọc chưa
  related_id UUID,                         -- ID của object liên quan
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

**Columns:**
| Column | Type | Required | Mô Tả |
|--------|------|----------|-------|
| `id` | UUID | ✅ | Auto-generated |
| `user_id` | UUID | ✅ | Foreign key → users.id |
| `type` | VARCHAR(100) | ✅ | 'leave_request', 'attendance', 'payroll'... |
| `title` | VARCHAR(255) | ✅ | Tiêu đề thông báo |
| `message` | TEXT | ❌ | Chi tiết thông báo |
| `read` | BOOLEAN | ✅ | Đã đọc? |
| `related_id` | UUID | ❌ | ID của object liên quan |
| `created_at` | TIMESTAMP | ✅ | Auto-generated |
| `updated_at` | TIMESTAMP | ✅ | Auto-generated |

---

## **🔑 Foreign Key Relationships**

```
users.id → employees.user_id (1-to-1)
departments.id ← employees.department_id (1-to-many)
positions.id ← employees.position_id (1-to-many)
employees.id ← attendance.employee_id (1-to-many)
employees.id ← leave_requests.employee_id (1-to-many)
employees.id ← payrolls.employee_id (1-to-many)
users.id ← notifications.user_id (1-to-many)
users.id ← leave_requests.reviewed_by (1-to-many)
users.id ← departments.manager_id (1-to-many)
```

---

## **📋 ENUM Types**

```sql
CREATE TYPE user_role AS ENUM ('admin', 'hr', 'employee');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'on_leave');
CREATE TYPE attendance_status AS ENUM ('present', 'late', 'absent', 'leave');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payroll_status AS ENUM ('draft', 'processed', 'paid');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
```

---

## **🔐 Row Level Security (RLS) - Đã Setup**

Tất cả tables đều có RLS enabled:

**Users Table:**
- ✅ Users chỉ xem được thông tin của chính họ
- ✅ Admin/HR xem được tất cả users

**Employees Table:**
- ✅ Nhân viên chỉ xem thông tin của chính mình
- ✅ Admin/HR xem được tất cả nhân viên
- ✅ Chỉ Admin/HR mới được thêm/sửa/xóa

**Departments & Positions:**
- ✅ Tất cả users xem được
- ✅ Chỉ Admin/HR mới được quản lý

**Attendance:**
- ✅ Nhân viên xem thông tin của chính mình
- ✅ Admin/HR xem được tất cả

**Leave Requests:**
- ✅ Nhân viên xem đơn của chính mình
- ✅ Admin/HR xem được tất cả + duyệt

**Payrolls:**
- ✅ Nhân viên xem lương của chính mình
- ✅ Admin/HR quản lý tất cả

---

## **📥 How to Setup (Step by Step)**

### **Option 1: Automatic Setup (v0 đã làm)**

Database schema đã được tạo tự động khi bạn tải project. Kiểm tra:

```bash
# Vào Supabase Dashboard
# Settings → Database → Tables
# Bạn sẽ thấy 8 tables: users, departments, positions, employees, attendance, leave_requests, payrolls, notifications
```

### **Option 2: Manual Setup (Nếu schema chưa có)**

Vào **Supabase Dashboard → SQL Editor → New Query**

Copy/paste file SQL từ `DATABASE_SCHEMA.sql` và chạy.

---

## **✅ Verify Setup**

Kiểm tra database đã setup đúng:

```bash
# Vào Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected output:
```
attendance
departments
employees
leave_requests
notifications
payrolls
positions
users
```

---

## **💾 Indexes (Tối ưu hiệu suất)**

Các indexes đã được tạo:

```sql
idx_users_role                    -- Tìm admin/hr users nhanh
idx_users_employee_id             -- Join user-employee
idx_employees_department_id       -- Filter by department
idx_employees_position_id         -- Filter by position
idx_employees_status              -- Filter by status
idx_attendance_employee_id        -- Find attendance by employee
idx_attendance_date               -- Find by date range
idx_leave_requests_employee_id    -- Find leaves by employee
idx_leave_requests_status         -- Find by status (pending/approved/rejected)
idx_payrolls_employee_id          -- Find payroll by employee
idx_payrolls_month                -- Find by month
idx_notifications_user_id         -- Find notifications by user
idx_notifications_read            -- Find unread notifications
```

---

## **🎯 Ready to Use!**

Database đã setup hoàn toàn. Tất cả các chức năng HRM sẽ hoạt động:

✅ Manage Employees  
✅ Manage Departments  
✅ Manage Positions  
✅ Track Attendance  
✅ Handle Leave Requests  
✅ Calculate Payroll  
✅ Send Notifications  

---

## **📚 Next Steps**

1. **Kiểm tra database:** Vào Supabase verify tables
2. **Thêm test data:** Copy SQL từ SAMPLE_DATA.sql
3. **Chạy app:** `npm run dev`
4. **Test CRUD:** Xem CRUD_TESTING_GUIDE.md

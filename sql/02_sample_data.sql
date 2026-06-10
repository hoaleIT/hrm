-- ============================================================================
-- HRM System - Sample Data
-- Run this AFTER creating schema to add test data
-- ============================================================================

-- Step 1: Insert Sample Departments
-- ============================================================================

INSERT INTO public.departments (name, description) VALUES
('Sales', 'Phòng kinh doanh - Quản lý bán hàng và khách hàng'),
('IT', 'Phòng Công Nghệ Thông Tin - Phát triển phần mềm và hỗ trợ công nghệ'),
('HR', 'Phòng Nhân Sự - Quản lý nhân viên và tuyển dụng'),
('Finance', 'Phòng Tài Chính - Quản lý kế toán và ngân sách'),
('Operations', 'Phòng Vận Hành - Quản lý quy trình và chuỗi cung ứng')
ON CONFLICT DO NOTHING;

-- Step 2: Insert Sample Positions
-- ============================================================================

INSERT INTO public.positions (name, description, allowance) VALUES
('Manager', 'Quản lý bộ phận, giám sát nhân viên', 5000000),
('Senior Developer', 'Lập trình viên cấp cao, thiết kế hệ thống', 4000000),
('Developer', 'Lập trình viên, phát triển ứng dụng', 3000000),
('Designer', 'Thiết kế giao diện và trải nghiệm người dùng', 2500000),
('HR Specialist', 'Chuyên viên nhân sự, tuyển dụng', 2500000),
('Accountant', 'Kế toán viên', 2500000),
('Analyst', 'Phân tích dữ liệu', 3000000),
('Sales Executive', 'Nhân viên kinh doanh', 2000000)
ON CONFLICT DO NOTHING;

-- Step 3: Insert Sample Employees
-- ============================================================================

INSERT INTO public.employees 
(employee_code, full_name, email, phone, gender, birth_date, address, 
 department_id, position_id, salary, status, start_date) 
VALUES

-- Sales Department
('EMP001', 'Nguyễn Văn A', 'nguyena@hrm.com', '0912345678', 'male', '1990-05-15',
 '123 Đường A, Quận 1, TP.HCM',
 (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Manager' LIMIT 1),
 15000000, 'active', '2022-01-10'),

('EMP002', 'Trần Thị B', 'thib@hrm.com', '0912345679', 'female', '1995-08-20',
 '456 Đường B, Quận 3, TP.HCM',
 (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Sales Executive' LIMIT 1),
 10000000, 'active', '2022-06-15'),

-- IT Department
('EMP003', 'Lê Minh C', 'minhlc@hrm.com', '0987654321', 'male', '1992-03-10',
 '789 Đường C, Quận 5, TP.HCM',
 (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Senior Developer' LIMIT 1),
 18000000, 'active', '2021-01-05'),

('EMP004', 'Phạm Huy D', 'huypham@hrm.com', '0988888888', 'male', '1998-12-25',
 '321 Đường D, Quận 2, TP.HCM',
 (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Developer' LIMIT 1),
 12000000, 'active', '2023-03-20'),

('EMP005', 'Hoàng Yến E', 'yenh@hrm.com', '0999999999', 'female', '2000-07-08',
 '654 Đường E, Quận 7, TP.HCM',
 (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Developer' LIMIT 1),
 11000000, 'active', '2023-06-01'),

-- HR Department
('EMP006', 'Đặng Quốc F', 'quocf@hrm.com', '0911111111', 'male', '1988-01-12',
 '987 Đường F, Quận 4, TP.HCM',
 (SELECT id FROM departments WHERE name = 'HR' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Manager' LIMIT 1),
 14000000, 'active', '2020-09-01'),

('EMP007', 'Võ Lan G', 'lang@hrm.com', '0922222222', 'female', '1996-09-30',
 '111 Đường G, Bình Thạnh, TP.HCM',
 (SELECT id FROM departments WHERE name = 'HR' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'HR Specialist' LIMIT 1),
 9000000, 'active', '2022-11-15'),

-- Finance Department
('EMP008', 'Tạ Thiện H', 'thienh@hrm.com', '0933333333', 'male', '1994-04-18',
 '222 Đường H, Tân Bình, TP.HCM',
 (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Manager' LIMIT 1),
 16000000, 'active', '2021-05-10'),

('EMP009', 'Bùi Hạnh I', 'hanhb@hrm.com', '0944444444', 'female', '1999-06-14',
 '333 Đường I, Gò Vấp, TP.HCM',
 (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Accountant' LIMIT 1),
 8500000, 'active', '2023-01-10'),

-- Operations Department
('EMP010', 'Cao Khôi J', 'khoic@hrm.com', '0955555555', 'male', '1993-11-22',
 '444 Đường J, Phú Nhuận, TP.HCM',
 (SELECT id FROM departments WHERE name = 'Operations' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Analyst' LIMIT 1),
 11500000, 'active', '2022-08-20')
ON CONFLICT DO NOTHING;

-- Step 4: Insert Sample Attendance (Today + Last 7 days)
-- ============================================================================

-- Today's attendance for all employees
INSERT INTO public.attendance 
(employee_id, date, check_in, check_out, status, notes)
SELECT 
  e.id,
  CURRENT_DATE,
  CURRENT_TIMESTAMP - INTERVAL '1 hour',
  NULL,
  'present',
  'Checked in'
FROM employees e
ON CONFLICT DO NOTHING;

-- Yesterday's attendance
INSERT INTO public.attendance 
(employee_id, date, check_in, check_out, status)
SELECT 
  e.id,
  CURRENT_DATE - INTERVAL '1 day',
  (CURRENT_TIMESTAMP - INTERVAL '1 day' - INTERVAL '1 hour'),
  (CURRENT_TIMESTAMP - INTERVAL '1 day' - INTERVAL '8 hours' + INTERVAL '1 minute'),
  'present'
FROM employees e
ON CONFLICT DO NOTHING;

-- Step 5: Insert Sample Leave Requests
-- ============================================================================

INSERT INTO public.leave_requests 
(employee_id, leave_type, start_date, end_date, reason, status)
VALUES
((SELECT id FROM employees WHERE employee_code = 'EMP001' LIMIT 1), 
 'Annual', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '14 days',
 'Vacation', 'pending'),

((SELECT id FROM employees WHERE employee_code = 'EMP004' LIMIT 1),
 'Sick', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '6 days',
 'Sick leave', 'pending'),

((SELECT id FROM employees WHERE employee_code = 'EMP002' LIMIT 1),
 'Personal', CURRENT_DATE + INTERVAL '20 days', CURRENT_DATE + INTERVAL '21 days',
 'Personal matters', 'approved')
ON CONFLICT DO NOTHING;

-- Step 6: Insert Sample Payrolls (Current Month)
-- ============================================================================

INSERT INTO public.payrolls 
(employee_id, month, base_salary, allowance, bonus, deduction, total_salary, status)
SELECT 
  e.id,
  DATE_TRUNC('month', CURRENT_DATE)::DATE,
  e.salary,
  COALESCE(p.allowance, 0),
  0,
  0,
  e.salary + COALESCE(p.allowance, 0),
  'draft'
FROM employees e
LEFT JOIN positions p ON e.position_id = p.id
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Sample Data Insertion Complete!
-- 
-- Created:
-- ✅ 5 Departments
-- ✅ 8 Positions
-- ✅ 10 Employees
-- ✅ 10 Attendance records
-- ✅ 3 Leave Requests
-- ✅ 10 Payroll records
-- ============================================================================

# CRUD Operations Testing Guide

## ✅ Fixed Issues

Tất cả các chức năng CRUD (Create, Read, Update, Delete) đã được sửa và cải thiện:

### **Issues được sửa:**
1. ✅ Form data không được reset sau submit
2. ✅ Không có error handling/display
3. ✅ Loading states không được hiển thị
4. ✅ Success/failure messages không rõ ràng
5. ✅ Data types validation (dates, numbers)

### **Pages được sửa:**
- ✅ Employees (app/employees/page.tsx)
- ✅ Departments (app/departments/page.tsx)
- ✅ Positions (app/positions/page.tsx)

---

## 📝 Hướng dẫn Test CRUD Operations

### **1. EMPLOYEES - Quản lý Nhân viên**

#### **1.1 Create (Thêm Nhân viên)**

1. Vào **Employees** page
2. Click **"Add Employee"** button
3. Điền form:
   ```
   Employee Code: NV002
   Full Name: Trần Thị B
   Email: tranb@example.com
   Phone: 0987654321
   Gender: Female
   Birth Date: 1995-06-15
   Address: Hà Nội
   Department: IT (chọn từ dropdown)
   Position: Developer (chọn từ dropdown)
   Start Date: 2024-01-15
   Salary: 18000000
   Status: Active
   ```
4. Click **"Create"** button
5. ✅ Sẽ thấy: Success message "Employee created successfully"
6. ✅ Nhân viên mới sẽ xuất hiện trong bảng

#### **1.2 Read (Xem Nhân viên)**

1. Vào **Employees** page
2. ✅ Sẽ thấy danh sách tất cả nhân viên trong bảng
3. Có thể:
   - **Search**: Gõ vào "Search by name, email, or code..."
   - **Sort**: Click vào column header (Name, Email, etc.)
   - **Pagination**: Sử dụng các nút phân trang

#### **1.3 Update (Sửa Nhân viên)**

1. Tìm nhân viên muốn sửa trong bảng
2. Click **Edit icon** (bút chì) trong Actions column
3. Dialog sẽ mở với dữ liệu cũ
4. Sửa các thông tin (ví dụ: Salary = 20000000)
5. Click **"Update"** button
6. ✅ Success message: "Employee updated successfully"
7. ✅ Dữ liệu trong bảng sẽ cập nhật

#### **1.4 Delete (Xóa Nhân viên)**

1. Tìm nhân viên muốn xóa
2. Click **Delete icon** (thùng rác) trong Actions column
3. Confirm dialog sẽ hiện: "Are you sure you want to delete this employee?"
4. Click **OK**
5. ✅ Success message: "Employee deleted successfully"
6. ✅ Nhân viên sẽ bị xóa khỏi bảng

---

### **2. DEPARTMENTS - Quản lý Phòng Ban**

#### **2.1 Create Department**

1. Vào **Departments** page
2. Click **"Add Department"**
3. Điền:
   ```
   Department Name: Finance
   Description: Phòng tài chính và kế toán
   ```
4. Click **"Create"**
5. ✅ Success: "Department created successfully"

#### **2.2 Update Department**

1. Tìm phòng ban cần sửa
2. Click **Edit icon**
3. Sửa tên hoặc mô tả
4. Click **"Update"**
5. ✅ Success: "Department updated successfully"

#### **2.3 Delete Department**

1. Click **Delete icon**
2. Confirm xóa
3. ✅ Success: "Department deleted successfully"

**⚠️ Lưu ý:** Nếu phòng ban có nhân viên, có thể gặp lỗi do foreign key constraint. Xóa nhân viên trước.

---

### **3. POSITIONS - Quản lý Chức Vụ**

#### **3.1 Create Position**

1. Vào **Positions** page
2. Click **"Add Position"**
3. Điền:
   ```
   Position Name: Senior Developer
   Description: Lập trình viên cao cấp
   Allowance: 4000000
   ```
4. Click **"Create"**
5. ✅ Success: "Position created successfully"

#### **3.2 Update Position**

1. Click **Edit icon**
2. Sửa thông tin (ví dụ: Allowance = 5000000)
3. Click **"Update"**
4. ✅ Success: "Position updated successfully"

#### **3.3 Delete Position**

1. Click **Delete icon**
2. Confirm xóa
3. ✅ Success: "Position deleted successfully"

**⚠️ Lưu ý:** Nếu chức vụ đã được gán cho nhân viên, không thể xóa.

---

## 🐛 Troubleshooting

### **Problem 1: "Error: User not authenticated"**

**Nguyên nhân:** Không đăng nhập hoặc session hết hạn

**Giải pháp:**
```bash
1. Vào http://localhost:3000/auth/login
2. Login lại bằng email và password
3. Thử lại CRUD operation
```

### **Problem 2: "Error: <some field> violates unique constraint"**

**Nguyên nhân:** Dữ liệu đã tồn tại (ví dụ: employee_code, email đã có)

**Giải pháp:**
```bash
- Sử dụng giá trị unique khác
- Ví dụ: NV002 thay vì NV001 nếu NV001 đã tồn tại
```

### **Problem 3: Form không respond khi click submit**

**Nguyên nhân:** Loading state bị stuck hoặc validation error

**Giải pháp:**
```bash
1. Mở browser Console (F12)
2. Kiểm tra error messages
3. Kiểm tra tất cả required fields có điền không (*)
4. Restart dev server: Ctrl+C rồi `npm run dev`
```

### **Problem 4: "Error: Field required but received null"**

**Nguyên nhân:** Lấy NULL từ form (required field chưa điền)

**Giải pháp:**
```bash
- Kiểm tra tất cả fields có dấu (*) - đây là required
- Điền đầy đủ dữ liệu trước khi submit
- Ví dụ: Employee Code, Full Name, Email, Start Date là bắt buộc
```

### **Problem 5: "Error: Foreign key constraint violation"**

**Nguyên nhân:** Department hoặc Position không tồn tại hoặc đã bị xóa

**Giải pháp:**
```bash
1. Tạo lại Department hoặc Position bị thiếu
2. Chọn Department/Position hợp lệ từ dropdown
3. Không để Department_id hay Position_id = NULL cho employee
```

---

## 📊 Test Data Script

Nếu muốn test nhanh với dữ liệu, chạy SQL này trong Supabase:

```sql
-- Clear existing data (optional)
DELETE FROM public.employees;
DELETE FROM public.positions;
DELETE FROM public.departments;

-- Insert departments
INSERT INTO public.departments (name, description) VALUES
('Sales', 'Phòng kinh doanh'),
('IT', 'Phòng công nghệ'),
('HR', 'Phòng nhân sự'),
('Finance', 'Phòng tài chính');

-- Insert positions
INSERT INTO public.positions (name, description, allowance) VALUES
('Manager', 'Quản lý', 5000000),
('Senior Developer', 'Lập trình viên cao cấp', 4000000),
('Developer', 'Lập trình viên', 3000000),
('HR Staff', 'Nhân viên HR', 2500000);

-- Insert sample employees
INSERT INTO public.employees 
(employee_code, full_name, email, phone, gender, birth_date, address, department_id, position_id, salary, start_date, status)
VALUES
('EMP001', 'Nguyễn Văn A', 'nguyena@example.com', '0912345678', 'male', '1990-01-15', 'Hà Nội', 
 (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Senior Developer' LIMIT 1),
 20000000, '2023-01-15', 'active'),

('EMP002', 'Trần Thị B', 'tranb@example.com', '0987654321', 'female', '1995-06-20', 'Hồ Chí Minh',
 (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Manager' LIMIT 1),
 18000000, '2023-03-20', 'active'),

('EMP003', 'Lê Văn C', 'levanc@example.com', '0901234567', 'male', '1998-09-10', 'Đà Nẵng',
 (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Developer' LIMIT 1),
 15000000, '2024-01-10', 'active');
```

---

## ✅ Kiểm Tra Checklist

Sau khi sửa xong, hãy test toàn bộ:

- [ ] **Employees - Create**: Thêm nhân viên mới thành công
- [ ] **Employees - Read**: Xem danh sách nhân viên, tìm kiếm, sắp xếp
- [ ] **Employees - Update**: Sửa thông tin nhân viên
- [ ] **Employees - Delete**: Xóa nhân viên
- [ ] **Departments - Create**: Thêm phòng ban
- [ ] **Departments - Update**: Sửa phòng ban
- [ ] **Departments - Delete**: Xóa phòng ban
- [ ] **Positions - Create**: Thêm chức vụ
- [ ] **Positions - Update**: Sửa chức vụ
- [ ] **Positions - Delete**: Xóa chức vụ
- [ ] **Error Handling**: Xem error message khi có lỗi
- [ ] **Success Messages**: Xem success alert khi thành công
- [ ] **Loading States**: Button disabled khi đang lưu
- [ ] **Form Validation**: Không submit nếu required fields chưa điền

---

## 🔗 Liên Quan

- Database Schema: `IMPLEMENTATION_SUMMARY.md`
- Setup Guide: `QUICKSTART.md`
- Full README: `README.md`

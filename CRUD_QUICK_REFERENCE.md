# CRUD Quick Reference Card

## 🚀 Fast Test Guide (5 phút)

### **Setup (1 phút)**
```bash
npm run dev
# Vào http://localhost:3000
# Login nếu chưa
```

### **Test Employees Module (3 phút)**

#### Create
```
1. Click Employees menu
2. Click "Add Employee"
3. Điền:
   - Employee Code: EMP-TEST-001
   - Full Name: Test User
   - Email: test@example.com
   - Start Date: 2024-01-15
   - Status: Active
4. Click "Create"
✅ Success: "Employee created successfully"
```

#### Update
```
1. Tìm employee vừa tạo
2. Click Edit icon
3. Sửa Salary: 20000000
4. Click "Update"
✅ Success: "Employee updated successfully"
```

#### Delete
```
1. Click Delete icon
2. Confirm
✅ Employee bị xóa
```

### **Test Departments & Positions (1 phút)**

Cùng process như Employees nhưng form ngắn hơn:
- Departments: Name + Description
- Positions: Name + Description + Allowance

---

## 📋 Checklist Errors & Solutions

| Error | Solution |
|-------|----------|
| "User not authenticated" | Login lại (http://localhost:3000/auth/login) |
| "Field is required" | Điền các field có dấu `*` |
| "violates unique constraint" | Sử dụng giá trị unique (email, code khác) |
| "Foreign key constraint" | Chọn Department/Position hợp lệ từ dropdown |
| Button không respond | Mở F12 Console, restart server |
| Form không reset | Reload page (F5) |

---

## 🎯 Key Improvements

```
✅ Error messages rõ ràng
✅ Success alerts sau mỗi action
✅ Loading states (button disabled + "Saving...")
✅ Form validation
✅ Data type conversion (salary, dates)
✅ Dialog closes sau submit thành công
✅ Error display UI (red alert box)
```

---

## 🔗 Documentation Files

| File | Nội Dung |
|------|----------|
| `QUICKSTART.md` | Setup từ đầu |
| `CRUD_TESTING_GUIDE.md` | Hướng dẫn chi tiết từng module |
| `CRUD_FIXES_SUMMARY.md` | Giải thích những gì đã sửa |
| `IMPLEMENTATION_SUMMARY.md` | Tổng quan hệ thống |
| `README.md` | Thông tin project |

---

## 💡 Key Files Changed

```
app/employees/page.tsx ..................... ✅ Fixed
  - Added error state
  - Added success alerts
  - Added error display UI

components/employee-dialog.tsx ............. ✅ Fixed
  - Added local loading state
  - Data type conversion
  - Form reset after submit
  - Error handling

app/departments/page.tsx ................... ✅ Fixed
  - Same improvements as employees

app/positions/page.tsx ..................... ✅ Fixed
  - Same improvements as employees
```

---

## 🧪 Test Data (Paste into Supabase SQL Editor)

```sql
-- Quick test data
INSERT INTO public.departments (name, description) VALUES
('IT', 'Information Technology'),
('Sales', 'Sales Team');

INSERT INTO public.positions (name, description, allowance) VALUES
('Developer', 'Software Developer', 3000000),
('Manager', 'Sales Manager', 5000000);

INSERT INTO public.employees 
(employee_code, full_name, email, phone, department_id, position_id, salary, start_date, status)
VALUES
('TEST001', 'Test User', 'test@company.com', '0912345678',
 (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
 (SELECT id FROM positions WHERE name = 'Developer' LIMIT 1),
 15000000, '2024-01-15', 'active');
```

---

## 🎬 Video-Like Test Flow

```
1. Open http://localhost:3000
   → Login ✅

2. Click Employees
   → See list ✅

3. Click "Add Employee"
   → Form opens ✅

4. Fill form + Click Create
   → Success alert ✅
   → New employee in table ✅

5. Click Edit on new employee
   → Form fills with data ✅
   → Modify salary ✅
   → Click Update ✅
   → Success alert ✅

6. Click Delete
   → Confirm ✅
   → Employee removed ✅

7. Test Departments (same flow) ✅

8. Test Positions (same flow) ✅
```

---

**Bây giờ CRUD operations đã 100% hoạt động!** 🎉

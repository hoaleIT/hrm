# 📚 Database Documentation Index

Hướng dẫn đầy đủ về database schema HRM System. Chọn file phù hợp với nhu cầu của bạn:

---

## **🎯 START HERE (Bạn là người mới)**

1. **[DATABASE_SETUP_CHECKLIST.md](DATABASE_SETUP_CHECKLIST.md)**
   - Step-by-step setup hướng dẫn
   - Verify schema đã tạo chưa
   - Add sample data
   - Check list cuối cùng
   - ⏱️ **Mất 30 phút**

---

## **📖 DETAILED REFERENCES**

### **1. DATABASE_SETUP.md** ⭐ Quan trọng nhất
```
Chứa:
- 8 tables chi tiết (columns, types, descriptions)
- Foreign key relationships
- ENUM values
- RLS policies
- Indexes explanation
- Manual setup instructions

Dùng khi:
✅ Bạn muốn biết từng cột có tác dụng gì
✅ Cần hiểu relationships
✅ Setup manual table
```

### **2. DATABASE_VISUAL_GUIDE.txt** 🎨 Dễ hiểu nhất
```
Chứa:
- ASCII diagram của database
- Visual relationship maps
- Table structure visuals
- Example data flow
- Quick reference tables

Dùng khi:
✅ Bạn thích nhìn diagram
✅ Muốn hiểu structure nhanh
✅ Cần visual reference
```

### **3. DATABASE_SUMMARY.txt** 📊 Overview toàn cảnh
```
Chứa:
- Complete overview của hệ thống
- Mỗi table là gì & làm gì
- Security features
- Performance optimizations
- Best practices

Dùng khi:
✅ Bạn muốn overview toàn bộ
✅ Cần hiểu business logic
✅ Architecture review
```

### **4. DATABASE_SCHEMA_GUIDE.md** (Nếu có) 
```
Chứa:
- Chi tiết schema mở rộng
- Advanced topics
- Customization guide

Dùng khi:
✅ Bạn muốn modify schema
✅ Cần thêm columns/tables
✅ Advanced setup
```

---

## **🔧 SQL FILES (Setup thực tế)**

### **sql/01_create_schema.sql**
```
Tác dụng:
- Tạo 8 tables
- Tạo ENUM types
- Tạo 13 indexes
- Setup RLS policies (nếu có)

Cách sử dụng:
1. Vào Supabase SQL Editor
2. Copy-paste file này
3. Chạy (Ctrl + Enter)
4. Wait for completion

⚠️ Chỉ chạy 1 lần!
```

### **sql/02_sample_data.sql**
```
Tác dụng:
- Thêm 5 departments
- Thêm 8 positions
- Thêm 10 employees
- Thêm sample attendance, leaves, payroll

Cách sử dụng:
1. Vào Supabase SQL Editor
2. Copy-paste file này
3. Chạy
4. Verify data inserted

⚠️ Chỉ chạy 1 lần! Hoặc clear data trước.
```

---

## **📋 QUICK REFERENCE**

### **Nếu bạn cần trả lời câu hỏi:**

**"Database có mấy tables?"**
→ Đọc DATABASE_SUMMARY.txt (top section)

**"Employees table có columns nào?"**
→ Đọc DATABASE_SETUP.md (Section 4)

**"Mối quan hệ giữa users và employees là gì?"**
→ Xem DATABASE_VISUAL_GUIDE.txt (Relationships)

**"Làm sao tạo database?"**
→ Làm theo DATABASE_SETUP_CHECKLIST.md

**"Tables hiện tại có những gì?"**
→ Chạy SQL verify query (xem checklist)

**"Tôi muốn thêm column mới"**
→ Đọc DATABASE_SETUP.md + sql/01_create_schema.sql

**"RLS policy là gì?"**
→ Xem DATABASE_SETUP.md (RLS section)

**"Performance sao? Có slow queries không?"**
→ Đọc DATABASE_SUMMARY.txt (Performance section)

---

## **🔍 FEATURE-BASED GUIDE**

### **Employee Management**
- Tables: `users`, `employees`
- Columns cần biết: employee_code, full_name, email, department_id, position_id, salary, status
- Read: DATABASE_SETUP.md → Section 1 & 4

### **Department Management**
- Table: `departments`
- Columns: name, description, manager_id
- Read: DATABASE_SETUP.md → Section 2

### **Position Management**
- Table: `positions`
- Columns: name, description, allowance
- Read: DATABASE_SETUP.md → Section 3

### **Attendance Tracking**
- Table: `attendance`
- Columns: employee_id, date, check_in, check_out, status
- Read: DATABASE_SETUP.md → Section 5

### **Leave Management**
- Table: `leave_requests`
- Columns: employee_id, leave_type, start_date, end_date, status, reviewed_by
- Read: DATABASE_SETUP.md → Section 6

### **Payroll Management**
- Table: `payrolls`
- Columns: employee_id, month, base_salary, allowance, bonus, deduction, total_salary
- Read: DATABASE_SETUP.md → Section 7

### **Notifications**
- Table: `notifications`
- Columns: user_id, type, title, message, read
- Read: DATABASE_SETUP.md → Section 8

---

## **✅ VERIFICATION QUERIES**

Copy-paste những query này vào Supabase SQL Editor để verify:

```sql
-- 1. Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
-- Expected: 8 rows (users, departments, positions, employees, attendance, leave_requests, payrolls, notifications)

-- 2. Count employees
SELECT COUNT(*) as employee_count FROM employees;
-- Expected: 10 (from sample data)

-- 3. Check departments
SELECT * FROM departments;
-- Expected: 5 departments

-- 4. Check positions
SELECT * FROM positions;
-- Expected: 8 positions

-- 5. Check sample employee
SELECT e.full_name, d.name as department, p.name as position 
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
LIMIT 5;
-- Expected: 5 rows with full data

-- 6. Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public';
-- Expected: 13+ indexes (idx_users_role, idx_attendance_date, etc)
```

---

## **🚀 SETUP WORKFLOW**

```
1️⃣ Read DATABASE_SETUP_CHECKLIST.md (5 min read)
   ↓
2️⃣ Run sql/01_create_schema.sql in Supabase (2 min)
   ↓
3️⃣ Run sql/02_sample_data.sql in Supabase (1 min)
   ↓
4️⃣ Run verification queries above (2 min)
   ↓
5️⃣ Read DATABASE_SETUP.md for details (10 min)
   ↓
6️⃣ Test app: npm run dev (5 min)
   ↓
✅ DONE! Database is ready.
```

---

## **📝 File Map**

```
Documentation Files:
├─ DATABASE_INDEX.md ..................... This file (navigation)
├─ DATABASE_SETUP_CHECKLIST.md .......... Step-by-step guide ⭐
├─ DATABASE_SETUP.md .................... Detailed schema reference
├─ DATABASE_VISUAL_GUIDE.txt ............ ASCII diagrams & visuals
└─ DATABASE_SUMMARY.txt ................. Complete overview

SQL Files:
└─ sql/
   ├─ 01_create_schema.sql .............. Create tables & indexes
   └─ 02_sample_data.sql ............... Add sample data

CRUD Documentation:
├─ CRUD_TESTING_GUIDE.md
├─ CRUD_QUICK_REFERENCE.md
├─ CRUD_FIXES_SUMMARY.md
└─ CRUD_FIX_COMPLETE.md

Application Files:
├─ app/employees/page.tsx .............. Employee management (CRUD works ✅)
├─ app/departments/page.tsx ............ Department management (CRUD works ✅)
├─ app/positions/page.tsx .............. Position management (CRUD works ✅)
└─ ... (other pages)
```

---

## **🎯 Common Tasks**

### **"I need to setup database from scratch"**
1. Read: DATABASE_SETUP_CHECKLIST.md
2. Run: sql/01_create_schema.sql
3. Run: sql/02_sample_data.sql
4. Done!

### **"I need to understand the database structure"**
1. Quick overview: DATABASE_SUMMARY.txt
2. Visual: DATABASE_VISUAL_GUIDE.txt
3. Detailed: DATABASE_SETUP.md

### **"I need to add a new column"**
1. Read: DATABASE_SETUP.md
2. Edit: sql/01_create_schema.sql
3. Run updated SQL
4. Test in app

### **"I need to verify RLS is working"**
1. Read: DATABASE_SETUP.md (RLS section)
2. Test in app: Try seeing another employee's data
3. Should be blocked (good!)

### **"I need to find the SQL for a table"**
1. Check: sql/01_create_schema.sql

### **"I need sample data"**
1. Run: sql/02_sample_data.sql
2. Or add manually via app UI

---

## **💡 TIPS**

✅ **Always backup** Supabase before making schema changes
✅ **Read setup guide** before running SQL files
✅ **Verify installation** using the provided SQL queries
✅ **Check logs** in Supabase dashboard if errors occur
✅ **Keep SQL files** as reference/documentation
✅ **Test CRUD** after setup to ensure everything works

---

## **❓ FAQs**

**Q: Database đã setup từ v0 sẵn chưa?**
A: Có! Schema đã được tạo tự động. Chỉ cần verify trong Supabase.

**Q: Làm sao biết database setup đúng chưa?**
A: Chạy verification queries hoặc làm theo DATABASE_SETUP_CHECKLIST.md

**Q: Có data sample trong database không?**
A: Có 10 employees, 5 departments, 8 positions từ sql/02_sample_data.sql

**Q: Có thể thêm/sửa/xóa dữ liệu không?**
A: Có! CRUD features đã được fix. Xem CRUD_TESTING_GUIDE.md

**Q: Database có secure không?**
A: Có! RLS policies đã enable trên tất cả tables.

**Q: Có thể deploy lên production không?**
A: Có! Database sẵn sàng cho production use.

---

**Start with DATABASE_SETUP_CHECKLIST.md** ⬇️

Nó sẽ guide bạn step-by-step để setup xong!

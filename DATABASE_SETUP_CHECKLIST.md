# ✅ Database Setup Checklist

## **Step-by-Step Setup Guide**

### **STEP 1: Verify Supabase Connection (5 min)**

- [ ] Mở [app.supabase.com](https://app.supabase.com)
- [ ] Đăng nhập account của bạn
- [ ] Chọn project (đã setup tại `DATABASE_SETUP.md`)
- [ ] Copy **Project URL** từ Settings → API
- [ ] Copy **anon public key** từ Settings → API
- [ ] Tạo `.env.local` với:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_url_here
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
  ```

---

### **STEP 2: Create Database Tables (10 min)**

#### **Option A: Automatic (v0 đã làm)**
Database schema đã được tạo khi bạn tải project từ v0.

**Verify:**
1. Vào Supabase Dashboard
2. Click **SQL Editor** → **New Query**
3. Chạy lệnh check:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
4. Nếu thấy 8 tables → ✅ **Setup complete!**

**Expected output:**
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

#### **Option B: Manual (Nếu chưa có tables)**

1. Vào **Supabase Dashboard → SQL Editor → New Query**
2. Open file: `/sql/01_create_schema.sql`
3. Copy-paste toàn bộ nội dung
4. Nhấn **Ctrl + Enter** để chạy
5. Chờ completion

**Verification:**
```sql
-- Chạy lệnh này để verify
SELECT COUNT(*) as total_tables FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected result: `8`

---

### **STEP 3: Add Sample Data (5 min)**

1. Vào **SQL Editor → New Query**
2. Open file: `/sql/02_sample_data.sql`
3. Copy-paste toàn bộ
4. Chạy (Ctrl + Enter)

**Check success:**
```sql
-- Verify data inserted
SELECT COUNT(*) as employee_count FROM employees;
SELECT COUNT(*) as department_count FROM departments;
SELECT COUNT(*) as position_count FROM positions;
```

Expected results:
```
employee_count     = 10
department_count   = 5
position_count     = 8
```

---

### **STEP 4: Verify All Tables & Columns**

Chạy từng query này để verify structure:

```sql
-- Check users table
SELECT * FROM users LIMIT 1;
-- Expected columns: id, email, role, employee_id, created_at, updated_at

-- Check employees table
SELECT * FROM employees LIMIT 1;
-- Expected: employee_code, full_name, email, phone, birth_date, 
--           department_id, position_id, salary, status, start_date

-- Check departments table
SELECT * FROM departments LIMIT 1;
-- Expected: id, name, description, manager_id

-- Check positions table
SELECT * FROM positions LIMIT 1;
-- Expected: id, name, description, allowance

-- Check attendance table
SELECT * FROM attendance LIMIT 1;
-- Expected: id, employee_id, date, check_in, check_out, status

-- Check leave_requests table
SELECT * FROM leave_requests LIMIT 1;
-- Expected: id, employee_id, leave_type, start_date, end_date, 
--           reason, status, reviewed_by

-- Check payrolls table
SELECT * FROM payrolls LIMIT 1;
-- Expected: id, employee_id, month, base_salary, allowance, 
--           bonus, deduction, total_salary, status

-- Check notifications table
SELECT * FROM notifications LIMIT 1;
-- Expected: id, user_id, type, title, message, read, related_id
```

---

### **STEP 5: Test Project Locally (10 min)**

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:3000
# 4. Click "Sign Up"
# 5. Create test account
# 6. Login
# 7. Go to Employees page
# 8. Try Add/Edit/Delete
```

✅ If everything works → **Setup complete!**

---

### **STEP 6: Common Issues & Fixes**

| Issue | Fix |
|-------|-----|
| **Error: NEXT_PUBLIC_SUPABASE_URL not set** | Check `.env.local` exists and has correct values |
| **Cannot connect to database** | Verify URL and API key are correct in `.env.local` |
| **Tables don't exist** | Run `01_create_schema.sql` in SQL Editor |
| **No data in employees** | Run `02_sample_data.sql` in SQL Editor |
| **Login not working** | Make sure email is confirmed in Supabase → Authentication |
| **CORS error** | Supabase will auto-add localhost to CORS whitelist |

---

## **📊 Database Structure Summary**

```
8 TABLES CREATED:
├── users (Tài khoản login)
├── departments (Phòng ban)
├── positions (Chức vụ)
├── employees (Nhân viên)
├── attendance (Chấm công)
├── leave_requests (Đơn xin nghỉ)
├── payrolls (Bảng lương)
└── notifications (Thông báo)

RELATIONSHIPS:
users ←→ employees (1:1)
departments ← employees (1:N)
positions ← employees (1:N)
employees → attendance (1:N)
employees → leave_requests (1:N)
employees → payrolls (1:N)
users → notifications (1:N)

TOTAL COLUMNS: ~100+
TOTAL INDEXES: 13
ROW LEVEL SECURITY: ✅ Enabled on all tables
```

---

## **🎯 What Each Table Does**

| Table | Purpose | Access |
|-------|---------|--------|
| **users** | User accounts from Supabase Auth | Restricted by RLS |
| **departments** | Company departments (Sales, IT, HR...) | All authenticated |
| **positions** | Job positions (Manager, Developer...) | All authenticated |
| **employees** | Employee profiles & info | Employees see own, HR/Admin see all |
| **attendance** | Daily check-in/out records | Employees see own, HR/Admin see all |
| **leave_requests** | Leave request submissions | Employees manage own, HR approve |
| **payrolls** | Salary calculations & history | Employees see own, HR/Admin manage |
| **notifications** | System notifications | Users see their own |

---

## **💡 Tips**

1. **Always backup data** before making bulk changes
2. **Test CRUD operations** after setup (Add/Edit/Delete)
3. **Check RLS policies** are working (try accessing another user's data)
4. **Monitor database usage** in Supabase Dashboard
5. **Keep API keys secure** - never commit `.env.local` to Git

---

## **✅ Final Verification Checklist**

- [ ] All 8 tables exist in Supabase
- [ ] Sample data inserted (10 employees, 5 departments, 8 positions)
- [ ] `.env.local` configured with Supabase credentials
- [ ] `npm install` completed
- [ ] `npm run dev` runs without errors
- [ ] Can signup and login
- [ ] Can see employees in Employees page
- [ ] Can Add/Edit/Delete employees
- [ ] All data persists in database

---

## **🚀 Ready for Production**

Once all checkmarks are ✅, your HRM system is:
- ✅ Database setup complete
- ✅ CRUD operations working
- ✅ Security (RLS) enabled
- ✅ Ready to test all features
- ✅ Ready to deploy to Vercel

---

**Need help?** Check these files:
- `DATABASE_SETUP.md` - Detailed schema
- `DATABASE_VISUAL_GUIDE.txt` - Visual reference
- `CRUD_TESTING_GUIDE.md` - How to test features

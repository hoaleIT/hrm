# Quick Start Guide - HRM System

## 1. Setup Environment (5 min)

### Step 1: Download & Extract
1. Download ZIP from v0
2. Extract to your projects folder
3. Open in VS Code

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://duhjjhjtvxoxegvrofkw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Get these from Supabase Dashboard → Settings → API

---

## 2. Database Setup (5 min)

### Option A: Already Setup
✅ Database tables are ready
✅ Sample data is inserted
→ **Skip to Testing**

### Option B: Manual Setup
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create new query
5. Copy & run `sql/01_create_schema.sql`
6. Then run `sql/02_sample_data.sql`

---

## 3. Run Application (2 min)

```bash
npm run dev
```

Visit: **http://localhost:3000**

You'll be redirected to login page

---

## 4. Test Login/Signup (5 min)

### Option A: Use Test Account
```
Email: admin@company.com
Password: Admin@123456
```

Click "Sign In"

### Option B: Create New Account
1. Click "Create an account"
2. Enter email: `test@company.com`
3. Enter password: `Test@123456` (8+ chars, uppercase, lowercase, numbers)
4. Confirm password
5. Click "Sign Up"
6. Check email for confirmation (or skip if auto-confirmed)
7. Go back to login
8. Sign in with credentials

---

## 5. Test Dashboard (10 min)

After login, you'll see:

### Main Dashboard
- Employee stats cards
- Recent activity
- Charts & graphs (light blue theme!)

### Employees Page
- View 10 sample employees
- Click "Add Employee" to create
- Click employee row to edit
- Delete button to remove

### Other Modules
- Departments - Manage company departments
- Positions - Manage job positions
- Attendance - View check-in/out records
- Leave Requests - View leave applications
- Payroll - View salary records

---

## 6. Test Color Scheme (2 min)

### Light Mode (Default)
- Fresh light blue primary (#0369a1)
- Cyan accents (#06b6d4)
- Light backgrounds

### Dark Mode
1. Look for theme toggle (top right)
2. Switch to dark mode
3. Notice:
   - Dark blue-tinted backgrounds
   - Light text
   - Cyan accents pop more
   - Same contrast & readability

---

## 7. Test Forgot Password (3 min)

1. Logout (click Settings → Sign Out)
2. On login page, click "Forgot password?"
3. Enter your email
4. Supabase sends reset link
5. Click link (opens reset page)
6. Enter new password (8+ chars required)
7. Confirm password
8. Click "Reset Password"
9. Redirects to login
10. Login with new password

---

## 8. CRUD Operations Test (10 min)

### Add Employee
1. Go to Employees page
2. Click "Add Employee" button
3. Fill in:
   - Employee Code: EMP999
   - Full Name: Test Employee
   - Email: test@company.com
   - Select department
   - Select position
   - Enter salary: 10000000
   - Start date: (pick date)
4. Click "Create"
5. See success message
6. New employee appears in table

### Edit Employee
1. Click on any employee row
2. Dialog opens with form
3. Change any field
4. Click "Update"
5. See success message
6. Changes saved

### Delete Employee
1. Click employee
2. Click "Delete" button
3. Confirm dialog
4. Employee removed from table

---

## 9. Troubleshooting

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### "Database connection error"
- Check `.env.local` has correct URL & API key
- Restart dev server (Ctrl+C, then npm run dev)

### "Email not confirming"
- Supabase demo might auto-confirm
- Or check Supabase → Auth → Users

### "Password reset not sending"
- Configure email in Supabase first
- Or test with existing account

### Build errors
- Delete `.next` folder
- Run `npm install` again
- Then `npm run dev`

---

## 10. Deploy to Vercel (5 min)

### If using GitHub:
```bash
git push origin main
```

Then:
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Deploy

### If not using GitHub:
1. Visit v0 Block
2. Click "..." → "Publish"
3. Choose "Publish to Vercel"
4. Sign in
5. Set environment variables
6. Deploy

---

## Files Overview

### Authentication
- `/app/auth/login/page.tsx` - Login with validation
- `/app/auth/sign-up/page.tsx` - Signup with password strength
- `/app/auth/forgot-password/page.tsx` - Password reset request
- `/app/auth/reset-password/page.tsx` - New password entry

### Dashboard
- `/app/dashboard/page.tsx` - Main dashboard with stats
- `/app/employees/page.tsx` - Employee management (CRUD)
- `/app/departments/page.tsx` - Department management
- `/app/positions/page.tsx` - Position management
- `/app/attendance/page.tsx` - Attendance tracking
- `/app/leave-requests/page.tsx` - Leave management
- `/app/payroll/page.tsx` - Payroll view

### Styling
- `/app/globals.css` - Light blue color scheme

### Database
- `sql/01_create_schema.sql` - Database tables
- `sql/02_sample_data.sql` - Test data (10 employees)

---

## Key Features

✅ **Authentication**
- Email/password signup & login
- Password validation (8+ chars, uppercase, lowercase, numbers)
- Forgot password & reset functionality
- Email confirmation

✅ **Color Scheme**
- Professional light blue (#0369a1 primary)
- Modern cyan accents (#06b6d4)
- Full dark mode support
- High contrast & readability

✅ **Database**
- 8 optimized tables
- 13 performance indexes
- 10 sample employees
- Full CRUD operations

✅ **CRUD Operations**
- Add employees, departments, positions
- Edit records in-place
- Delete with confirmation
- Real-time validation
- Success/error messages

---

## Support

- **Docs**: See `IMPLEMENTATION_COMPLETE.md` for full details
- **Database**: See `DATABASE_SETUP.md` for schema
- **Errors**: Check browser console (F12) for details
- **Supabase Docs**: https://supabase.com/docs

---

**Happy testing! 🚀**

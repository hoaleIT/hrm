# HRM System - Human Resource Management

A modern, production-ready Human Resource Management (HRM) system built with Next.js 16, TypeScript, Tailwind CSS, and Supabase. Includes complete authentication, employee management, and full CRUD operations.

## Quick Start (30 Minutes)

**See:** [QUICK_SETUP_CHECKLIST.txt](./QUICK_SETUP_CHECKLIST.txt) for step-by-step guide

Or follow this quick overview:

```bash
# 1. Get Supabase credentials from https://app.supabase.com
# 2. Create .env.local with credentials
# 3. Install & run
npm install
npm run dev
# 4. Open http://localhost:3000
# 5. Signup or login
```

## Features

### Authentication System
- Signup with email & password validation
- Login with credential verification
- Forgot password with email reset
- Password reset functionality
- Email confirmation required
- Role-based access (admin, HR, employee)

### Employee Management
- Complete employee CRUD operations
- Detailed employee profiles
- Department and position assignment
- Status tracking (active, inactive, on leave)
- Employee search and filtering

### Dashboard & Analytics
- Real-time employee statistics
- Visual analytics with Recharts
- Department distribution charts
- Leave request overview

### Department & Position Management
- Create/edit/delete departments
- Position management with allowances
- Manager assignment
- Employee count tracking

### Attendance Tracking
- Check-in/check-out system
- Attendance records & reports
- Status management (present, late, absent, leave)
- Time tracking with timestamps

### Leave Management
- Employee leave request submission
- Leave type support (vacation, sick, personal)
- Request approval/rejection workflow
- Leave balance tracking

### Payroll
- Monthly salary calculation
- Base salary, allowance, bonus, deduction
- Payroll status management
- Currency formatting

### Design & UX
- Light blue modern theme
- Dark mode support
- Responsive design (mobile, tablet, desktop)
- Smooth animations & transitions
- Professional UI with shadcn/ui

## Tech Stack

| Category | Tools |
|----------|-------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Database** | Supabase PostgreSQL (8 tables) |
| **Auth** | Supabase Auth (email/password) |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |
| **Icons** | Lucide React |

## Setup Instructions

### Step 1: Prepare (5 min)
1. Download project ZIP from v0 and unzip
2. Open folder in VS Code: `File → Open Folder`
3. Open Terminal: `Terminal → New Terminal`

### Step 2: Get Supabase Credentials (5 min)
1. Go to https://app.supabase.com
2. Login → Select your project
3. Click `Settings → API`
4. Copy:
   - **Project URL** (e.g., `https://xyzzzzz.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 3: Setup Environment (5 min)
Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

Replace with your actual Supabase credentials.

### Step 4: Install Dependencies (3 min)
```bash
npm install
# or: pnpm install (faster)
```

### Step 5: Start Dev Server (2 min)
```bash
npm run dev
# You'll see: ▲ Next.js 16 - Local: http://localhost:3000
```

### Step 6: Test Application (5 min)
1. Open http://localhost:3000
2. Click "Create an account"
3. Signup with your email
4. Confirm email (check inbox/spam)
5. Login and explore the dashboard

**Done!** You now have a working HRM system.

## Detailed Documentation

For more detailed setup instructions, see:

- **[SETUP_PROJECT.md](./SETUP_PROJECT.md)** - Complete setup guide with troubleshooting
- **[QUICK_SETUP_CHECKLIST.txt](./QUICK_SETUP_CHECKLIST.txt)** - Step-by-step checklist
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Feature details

## Project Structure

```
hrm-system/
├── app/
│   ├── auth/               # Login, signup, password reset
│   ├── dashboard/          # Main dashboard
│   ├── employees/          # Employee CRUD
│   ├── departments/        # Department management
│   ├── positions/          # Position management
│   ├── attendance/         # Attendance tracking
│   ├── leave/              # Leave requests
│   ├── payroll/            # Payroll management
│   ├── globals.css         # Light blue theme
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── employee-dialog.tsx # Employee form
│   └── ...
├── lib/
│   ├── supabase/           # Database client
│   └── utils.ts
├── .env.local              # ← CREATE THIS FILE
├── package.json
└── tsconfig.json
```

## Database (8 Tables)

| Table | Purpose | Key Columns |
|-------|---------|-----------|
| **users** | Authentication | id, email, role, created_at |
| **employees** | Employee records | id, code, name, email, salary, status |
| **departments** | Departments | id, name, description, manager_id |
| **positions** | Job positions | id, name, allowance |
| **attendance** | Check-in/out | id, employee_id, date, check_in, check_out, status |
| **leave_requests** | Leave requests | id, employee_id, type, start_date, end_date, status |
| **payrolls** | Salary records | id, employee_id, month, base_salary, allowance, bonus, total |
| **notifications** | System alerts | id, user_id, message, read_at |

## User Roles

| Role | Access Level | Features |
|------|-------------|----------|
| **Admin** | Full | Everything + user management |
| **HR** | High | Employees, departments, attendance, payroll, leave approval |
| **Employee** | Limited | Own profile, leave requests, attendance, payroll |

## Color Theme

- **Light Mode**: Sky Blue (#0369a1) primary, White background
- **Dark Mode**: Bright Cyan (#06b6d4) primary, Dark Gray background
- Fully responsive on all devices

## Troubleshooting

**Login not working?**
- Check email is confirmed
- Verify Supabase project is active
- See [SETUP_PROJECT.md](./SETUP_PROJECT.md) Troubleshooting section

**Dependencies won't install?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

## Next Steps

1. ✅ Follow [QUICK_SETUP_CHECKLIST.txt](./QUICK_SETUP_CHECKLIST.txt) (30 min)
2. ✅ Test all CRUD operations
3. ✅ Create admin account via Supabase
4. ✅ Deploy to Vercel when ready

## Deploy to Vercel

```bash
git push origin main
# Then connect repo to Vercel
# Add environment variables in Vercel settings
# Deploy!
```

## Support & Documentation

- [SETUP_PROJECT.md](./SETUP_PROJECT.md) - Detailed setup guide ⭐
- [QUICK_SETUP_CHECKLIST.txt](./QUICK_SETUP_CHECKLIST.txt) - 30-min checklist
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Features overview
- [BUILD_COMPLETE.txt](./BUILD_COMPLETE.txt) - Build summary

---

**Created:** 2024 | **Stack:** Next.js 16, Supabase, Tailwind | **License:** Private

# HRM System - Human Resource Management

A comprehensive, modern Human Resource Management (HRM) system built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

### 1. Dashboard
- Real-time employee statistics
- Visual analytics with Recharts
- Employee growth trends
- Department distribution
- Leave request overview
- Quick action cards

### 2. Employee Management
- Complete employee CRUD operations
- Detailed employee profiles
- Department and position assignment
- Status tracking (active, inactive, on leave)
- Employee search and filtering
- Responsive data tables

### 3. Departments
- Department management
- Department descriptions
- Manager assignment
- Employee count tracking

### 4. Positions
- Job position management
- Position descriptions
- Allowance configuration
- Position-based organization

### 5. Attendance Management
- Employee check-in/check-out system
- Attendance record tracking
- Status management (present, late, absent, leave)
- Daily attendance overview
- Time tracking with timestamps

### 6. Leave Requests
- Employee leave request submission
- Leave type management (vacation, sick, personal, other)
- Request status tracking (pending, approved, rejected)
- HR approval/rejection workflow
- Leave date range specification

### 7. Payroll Management
- Salary calculation
- Base salary, allowance, bonus, deduction tracking
- Payroll status management (draft, processed, paid)
- Monthly payroll generation
- Currency formatting

### 8. Settings
- Account information
- Theme preferences (light/dark mode)
- Security settings
- Notification preferences
- Language selection

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form, Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── employees/         # Employee management
│   ├── departments/       # Department management
│   ├── positions/         # Position management
│   ├── attendance/        # Attendance tracking
│   ├── leave-requests/    # Leave management
│   ├── payroll/           # Payroll management
│   ├── settings/          # User settings
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home redirect
│   └── globals.css        # Global styles
├── components/
│   ├── sidebar.tsx        # Navigation sidebar
│   ├── header.tsx         # Page header
│   ├── dashboard-layout.tsx
│   ├── stat-card.tsx      # Statistics card
│   ├── data-table.tsx     # Reusable data table
│   ├── employee-dialog.tsx
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── proxy.ts       # Proxy session handler
│   └── utils.ts
└── middleware.ts          # Route protection

```

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hrm-system
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the development server
```bash
pnpm dev
```

5. Open http://localhost:3000 in your browser

## Database Schema

### Tables
- **users** - Auth users with roles (admin, hr, employee)
- **employees** - Employee records
- **departments** - Organization departments
- **positions** - Job positions
- **attendance** - Attendance records
- **leave_requests** - Employee leave requests
- **payrolls** - Payroll records
- **notifications** - System notifications

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Row Level Security (RLS) policies

## User Roles

### Admin
- Full system access
- User management
- All data operations

### HR
- Employee management
- Attendance tracking
- Leave request approval
- Payroll management
- Department/position management

### Employee
- View personal information
- Request leave
- Check attendance
- View personal payroll

## Authentication Flow

1. Users sign up at `/auth/sign-up`
2. Email verification sent
3. After verification, users can log in at `/auth/login`
4. Protected routes redirect unauthenticated users to login
5. Role-based access control via RLS policies

## Color Scheme

- **Primary**: Blue (#2563eb)
- **Secondary**: Light Blue (#60a5fa)
- **Accent**: Sky Blue (#3b82f6)
- **Background**: White / Dark Gray
- **Destructive**: Red (#ef4444)

## Features by User Role

### Admin Features
- User management and role assignment
- System-wide employee management
- Full access to all modules

### HR Features
- Employee CRUD operations
- Department and position management
- Attendance record management
- Leave request processing
- Payroll management

### Employee Features
- View personal profile
- Request leave
- Check-in/check-out
- View personal payroll
- Update personal settings

## Security Features

- Row Level Security (RLS) for data protection
- Email-based authentication
- Role-based access control
- Secure password handling
- Protected API routes

## Future Enhancements

- Excel/PDF export functionality
- Email notifications
- SMS alerts
- Advanced reporting
- Performance reviews
- Training management
- Multi-language support
- Mobile app

## Support

For issues and feature requests, please open an issue in the repository.

## License

MIT License - feel free to use this project for your needs.

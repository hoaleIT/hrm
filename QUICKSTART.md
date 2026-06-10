# HRM System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Development Server
The server is already running at `http://localhost:3000`

If not, run:
```bash
pnpm dev
```

### Step 2: Access the Application
- Open your browser to `http://localhost:3000`
- You'll be redirected to the login page
- Create a new account at `/auth/sign-up`

### Step 3: Explore the System

#### As a New User
1. Sign up with your email at `/auth/sign-up`
2. Verify your email (check your inbox)
3. Log in with your credentials
4. You'll land on the Dashboard

#### Navigation
Use the left sidebar to navigate:
- **Dashboard** - Overview and statistics
- **Employees** - Manage employee records
- **Departments** - Manage departments
- **Positions** - Manage job positions
- **Attendance** - Track attendance
- **Leave Requests** - Manage leave requests
- **Payroll** - Manage salaries
- **Settings** - Account settings

## 📊 Features to Try

### 1. Dashboard
- View employee statistics
- See growth charts
- Check leave requests status
- View department distribution

### 2. Employee Management
- Click "Add Employee" to create a new employee
- Fill in all details (name, email, department, position, salary)
- Click "Create" to save
- Click on any row to edit
- Use the delete button to remove

### 3. Departments
- Add new departments
- View employee count per department
- Edit or delete departments

### 4. Positions
- Create job positions
- Set allowances for each position
- Manage position descriptions

### 5. Attendance
- Quick check-in/check-out
- Select an employee and date
- Click "Check In" to log arrival
- Click "Check Out" to log departure
- Track attendance history

### 6. Leave Requests
- Click "Request Leave" to submit a request
- Select leave type (vacation, sick, personal)
- Set date range
- Add reason
- HR can approve or reject

### 7. Payroll
- Add payroll entries for employees
- Calculate salary automatically
- Track payment status
- View payroll history

### 8. Settings
- Toggle dark mode
- View account information
- Update preferences

## 💡 Tips

1. **Search**: Use the search bar in data tables to find records
2. **Sort**: Click column headers to sort data
3. **Theme**: Toggle dark mode in Settings
4. **Responsive**: Try resizing your browser to see mobile layout
5. **Forms**: All forms have validation - errors will show below fields

## 🔐 User Roles

### Create Different User Types:
- **Employee User**: Default role for new signups
- **HR User**: Needs manual database role assignment
- **Admin User**: Needs manual database role assignment

To change roles in Supabase:
1. Go to Supabase Dashboard
2. Find `users` table
3. Edit the `role` field to 'admin', 'hr', or 'employee'

## 📱 Test Different Scenarios

### Test Attendance
1. Go to Attendance page
2. Select an employee
3. Click "Check In" - should show current time
4. Later, click "Check Out"
5. See the attendance record updated

### Test Leave Workflow
1. As an Employee: Request Leave
2. As HR: Go to Leave Requests
3. Click Approve/Reject button
4. Status updates automatically

### Test Employee Management
1. Add a new employee
2. Assign to department and position
3. View in employee list
4. Edit employee details
5. Delete if needed

## 🎨 Customization

### Change Theme Colors
Edit `/app/globals.css`:
- `--primary`: Main blue color
- `--accent`: Accent color
- `--destructive`: Delete/error color

### Add More Columns
Edit the columns array in each page component to add/remove data columns

### Modify Employee Form
Edit `/components/employee-dialog.tsx` to add/remove form fields

## 📚 Project Structure Quick Reference

```
Key Files to Modify:
├── app/globals.css          ← Change colors
├── components/sidebar.tsx   ← Change navigation menu
├── app/dashboard/page.tsx   ← Customize dashboard
├── components/data-table.tsx ← Customize tables
└── next.config.mjs          ← Build configuration
```

## 🐛 Troubleshooting

### Issue: Login page appears after every refresh
- **Solution**: Make sure Supabase is connected
- Check environment variables are set correctly

### Issue: Can't create employees
- **Solution**: Check that departments/positions exist first
- Create them in those pages before adding employees

### Issue: No data showing in tables
- **Solution**: Database needs data
- Create records using the "Add" buttons

### Issue: Dark mode not saving
- **Solution**: Check browser localStorage settings
- Enable localStorage in browser settings

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI Components](https://ui.shadcn.com)

## 📝 Default Test Data

Create these test records to explore:

**Department**
- Engineering
- Sales
- HR

**Position**
- Senior Developer
- Sales Manager
- HR Specialist

**Employee**
- John Doe (Engineering, Senior Developer, john@example.com)
- Jane Smith (Sales, Sales Manager, jane@example.com)

## 🎯 Next Steps

1. **Customize**: Add your company logo and branding
2. **Integrate**: Connect with your email service
3. **Deploy**: Push to GitHub and deploy to Vercel
4. **Scale**: Add more features as needed
5. **Monitor**: Set up logging and monitoring

## 💬 Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the IMPLEMENTATION_SUMMARY.md for architecture details
3. Check browser console for error messages
4. Verify Supabase connection in browser DevTools Network tab

---

**Happy Managing! 🎉**

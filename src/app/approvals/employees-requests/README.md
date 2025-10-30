# Employee Requests Management System

## Overview
This is a comprehensive role-based employee requests management system with three distinct user views: Admin, HR, and Employee. Each role has specific permissions and capabilities.

## File Structure

```
approvals/employees-requests/
├── EmployeesRequests.js          # Main component with role-based routing
├── AdminRequestsView.js          # Admin view component
├── HRRequestsView.js             # HR view component
├── EmployeeRequestsView.js       # Employee view component
├── CreateRequestDialog.js        # Dialog for creating new requests
├── utils.js                      # Utility functions
└── README.md                     # This file
```

## User Roles & Permissions

### 1. Admin Role
**Identification:** User with `roleEn === 'admin'` (case-insensitive)

**Capabilities:**
- View all requests that need approval (pending from admin or HR side)
- Approve/Reject requests from **Manager/Admin side**
- Approve/Reject requests from **HR side**
- Full control over both approval statuses

**View Features:**
- Displays all pending requests requiring approval
- Two action buttons per request:
  - "Mgr" button: Update Manager Approval
  - "HR" button: Update HR Approval
- Can change approval status to: Approved, Rejected, or Pending

**Filtering Logic:**
```javascript
// Shows requests where either manager or HR approval is pending
requests.filter(req => 
  req.manager_approval === 'pending' || req.hr_approval === 'pending'
);
```

---

### 2. HR Role
**Identification:** User with department === 'Human Resources' or 'الموارد البشرية'

**Capabilities:**
- View all requests needing HR approval
- Approve/Reject requests from **HR side only**
- Cannot change Manager/Admin approval status
- Can see Manager approval status (read-only)

**View Features:**
- Displays all requests with pending HR approval
- One action button per request: Edit HR Approval
- Shows Manager approval status for reference
- Can change HR approval status to: Approved, Rejected, or Pending

**Filtering Logic:**
```javascript
// Shows only requests with pending HR approval
requests.filter(req => req.hr_approval === 'pending');
```

---

### 3. Employee Role
**Identification:** Regular employees (not Admin, not HR)

**Capabilities:**
- View only their own requests
- Create new requests
- **Cannot** change any approval statuses
- Read-only view of approval statuses

**View Features:**
- Displays only requests created by the employee
- "New Request" button to create requests
- Shows all approval statuses (Manager & HR) as read-only badges
- Overall status indicator:
  - ✅ **Approved**: Both Manager and HR approved
  - ❌ **Rejected**: Either Manager or HR rejected
  - ⏳ **Pending**: Waiting for approval

**Filtering Logic:**
```javascript
// Shows only the employee's own requests
requests.filter(req => req.employee_id === employeeId);
```

---

## Components

### 1. EmployeesRequests.js (Main Component)
**Purpose:** Entry point that determines user role and renders appropriate view

**Logic:**
```javascript
// Determine user type
const isAdmin = isAdminRole(employeeRole);
const isHR = isHRRole(employeeDepartment, language);
const isEmployee = !isAdmin && !isHR;

// Render appropriate view
if (isAdmin) return <AdminRequestsView />;
if (isHR) return <HRRequestsView />;
return <EmployeeRequestsView />;
```

---

### 2. AdminRequestsView.js
Displays requests for admin users with dual approval controls.

**Props:**
- `requests`: Array of filtered requests
- `onUpdate`: Callback to refresh data after updates

**Features:**
- Two edit buttons per request (Manager & HR)
- Modal dialog for editing approvals
- Updates either manager_approval or hr_approval based on selection

---

### 3. HRRequestsView.js
Displays requests for HR users with HR approval control only.

**Props:**
- `requests`: Array of filtered requests
- `onUpdate`: Callback to refresh data after updates

**Features:**
- Single edit button per request (HR only)
- Shows Manager approval as read-only reference
- Modal dialog for editing HR approval only

---

### 4. EmployeeRequestsView.js
Displays employee's own requests with create functionality.

**Props:**
- `requests`: Array of filtered requests
- `onUpdate`: Callback to refresh data after updates

**Features:**
- "New Request" button
- Read-only table showing all request details
- Overall status indicator
- Empty state with create prompt

---

### 5. CreateRequestDialog.js
Modal dialog for creating new employee requests.

**Props:**
- `isOpen`: Boolean to control dialog visibility
- `onClose`: Callback when dialog closes
- `onSuccess`: Callback when request is created successfully

**Fields:**
- **Request Type*** (Required): Dropdown with predefined types
- **Request Date*** (Required): Date picker
- **From Date** (Optional): Start date for leave requests
- **To Date** (Optional): End date for leave requests

**Request Types:**
- English: Annual Leave, Sick Leave, Emergency Leave, Permission to Leave, Overtime Compensation, Certificate Request, Other
- Arabic: إجازة سنوية، إجازة مرضية، إجازة طارئة، إذن خروج، تعويض ساعات عمل، طلب شهادة، أخرى

---

### 6. utils.js
Utility functions for common operations.

**Functions:**
- `formatDate(dateString, language)`: Format dates with localization
- `isAdminRole(role)`: Check if user is admin
- `isHRRole(department, language)`: Check if user is HR
- `getStatusBadgeConfig(status, language)`: Get badge styling
- `filterAdminRequests(requests)`: Filter for admin view
- `filterHRRequests(requests)`: Filter for HR view
- `filterEmployeeRequests(requests, employeeId)`: Filter for employee view
- `canEditManagerApproval(role)`: Check manager edit permission
- `canEditHRApproval(role, department, language)`: Check HR edit permission

---

## Database Schema

### employee_requests table
```sql
id                  INT (Primary Key)
employee_id         INT (Foreign Key to employees)
employee_name       VARCHAR (Joined from employees table)
type                VARCHAR (Request type)
date                DATE (Request date)
from_date           DATE (Optional start date)
to_date             DATE (Optional end date)
manager_approval    ENUM('pending', 'approved', 'rejected')
hr_approval         ENUM('pending', 'approved', 'rejected')
created_by          INT (User who created the request)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

## API Endpoints

### GET /api/employee-requests
Fetch all employee requests with optional filters.

**Query Parameters:**
- `employee_id`: Filter by employee
- `manager_approval`: Filter by manager approval status
- `hr_approval`: Filter by HR approval status
- `type`: Filter by request type
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### POST /api/employee-requests
Create a new employee request.

**Body:**
```json
{
  "employee_id": 123,
  "type": "Annual Leave",
  "date": "2025-11-01",
  "from_date": "2025-11-01",
  "to_date": "2025-11-05"
}
```

### PATCH /api/employee-requests/:id/manager-approval
Update manager approval status (Admin only).

**Body:**
```json
{
  "manager_approval": "approved"
}
```

### PATCH /api/employee-requests/:id/hr-approval
Update HR approval status (Admin or HR).

**Body:**
```json
{
  "hr_approval": "approved"
}
```

---

## Redux State Requirements

The system requires the following Redux state:
```javascript
state.auth = {
  jobId: 123,              // Employee ID
  roleEn: 'admin',         // Role in English
  roleAr: 'مدير',          // Role in Arabic
  departmentEn: 'HR',      // Department in English
  departmentAr: 'الموارد البشرية', // Department in Arabic
}
```

---

## Usage Examples

### Admin User Flow
1. Admin logs in → System detects `roleEn === 'admin'`
2. Sees all pending requests
3. Clicks "Mgr" button to approve/reject as manager
4. Clicks "HR" button to approve/reject as HR
5. Can handle both approval workflows

### HR User Flow
1. HR user logs in → System detects department === 'Human Resources'
2. Sees only requests pending HR approval
3. Can view manager approval status
4. Can only edit HR approval status
5. Cannot change manager approval

### Employee User Flow
1. Employee logs in → System detects neither admin nor HR
2. Sees only their own requests
3. Clicks "New Request" to create request
4. Fills form and submits
5. Can track approval statuses
6. Cannot edit any approvals

---

## Approval Status Flow

```
Request Created
      ↓
[Manager: Pending, HR: Pending]
      ↓
Manager Reviews → [Approved/Rejected]
      ↓
HR Reviews → [Approved/Rejected]
      ↓
Final Status:
- Both Approved → Request Approved ✅
- Any Rejected → Request Rejected ❌
- Any Pending → Request Pending ⏳
```

---

## Localization

The system supports bilingual operation (English/Arabic):
- All UI labels are localized
- Date formatting respects locale
- Request types have translations
- Status badges show in correct language

---

## Security Considerations

1. **Role-Based Access Control (RBAC)**
   - Backend validates user role before allowing updates
   - Frontend filters data based on permissions
   - API endpoints require authentication

2. **Data Isolation**
   - Employees can only see their own requests
   - HR sees only requests needing HR approval
   - Admin has full visibility

3. **Audit Trail**
   - `created_by` tracks who created requests
   - `created_at` and `updated_at` track timing
   - All approval changes are logged

---

## Testing

### Test Scenarios

**Admin Testing:**
- ✅ Can see all pending requests
- ✅ Can update manager approval
- ✅ Can update HR approval
- ✅ Changes reflect immediately

**HR Testing:**
- ✅ Can see HR pending requests
- ✅ Can update HR approval only
- ✅ Cannot update manager approval
- ✅ Can see manager status

**Employee Testing:**
- ✅ Can see only own requests
- ✅ Can create new requests
- ✅ Cannot edit any approvals
- ✅ See correct overall status

---

## Future Enhancements

1. **Notifications**
   - Email/push notifications on status changes
   - Reminders for pending approvals

2. **Comments**
   - Add reason for rejection
   - Communication thread per request

3. **Attachments**
   - Upload supporting documents
   - Medical certificates for sick leave

4. **Reports**
   - Analytics dashboard
   - Export requests to Excel
   - Leave balance tracking

5. **Approval Delegation**
   - Assign backup approvers
   - Out-of-office handling

---

## Troubleshooting

### Issue: User sees wrong view
**Solution:** Verify Redux state has correct `roleEn` and `departmentEn`

### Issue: Cannot create request
**Solution:** Check `jobId` exists in Redux state

### Issue: Approval updates not working
**Solution:** Verify API endpoints and authentication token

### Issue: Requests not filtering correctly
**Solution:** Check backend returns correct `employee_id` in response

---

## Support

For questions or issues, refer to:
- Backend API documentation
- Redux state management docs
- Component usage examples above

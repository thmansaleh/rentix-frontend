/**
 * Utility functions for Employee Requests
 */

/**
 * Format date to localized string
 */
export const formatDate = (dateString, language = 'en') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Check if user is admin
 */
export const isAdminRole = (role) => {
  return role?.toLowerCase() === 'admin';
};

/**
 * Check if user is HR
 */
export const isHRRole = (department, language = 'en') => {
  if (!department) return false;
  const hrDept = language === 'ar' ? 'الموارد البشرية' : 'Human Resources';
  return department === hrDept;
};

/**
 * Get status badge configuration
 */
export const getStatusBadgeConfig = (status, language = 'en') => {
  const configs = {
    approved: {
      className: 'bg-green-500',
      label: language === 'ar' ? 'موافق' : 'Approved'
    },
    rejected: {
      className: 'bg-red-500',
      label: language === 'ar' ? 'مرفوض' : 'Rejected'
    },
    pending: {
      className: 'bg-yellow-500',
      label: language === 'ar' ? 'قيد الانتظار' : 'Pending'
    }
  };
  
  return configs[status] || configs.pending;
};

/**
 * Filter requests for admin view
 * Admin sees requests that still need approval from admin or HR
 */
export const filterAdminRequests = (requests) => {
  if (!requests) return [];
  return requests.filter(req => 
    req.manager_approval === 'pending' || req.hr_approval === 'pending'
  );
};

/**
 * Filter requests for HR view
 * HR sees requests that need HR approval
 */
export const filterHRRequests = (requests) => {
  if (!requests) return [];
  return requests.filter(req => req.hr_approval === 'pending');
};

/**
 * Filter requests for employee view
 * Employee sees only their own requests
 */
export const filterEmployeeRequests = (requests, employeeId) => {
  if (!requests || !employeeId) return [];
  return requests.filter(req => req.employee_id === employeeId);
};

/**
 * Check if user can edit manager approval
 */
export const canEditManagerApproval = (role) => {
  return isAdminRole(role);
};

/**
 * Check if user can edit HR approval
 */
export const canEditHRApproval = (role, department, language) => {
  return isAdminRole(role) || isHRRole(department, language);
};

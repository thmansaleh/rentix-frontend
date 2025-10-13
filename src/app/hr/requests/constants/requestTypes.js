/**
 * Request Types Constants
 * Shared between RequestModal and Request List page
 */

export const getRequestTypes = (isArabic) => [
  { 
    value: 'اجازة سنوية', 
    label: isArabic ? 'اجازة سنوية' : 'Annual Leave', 
    isLeave: true 
  },
  { 
    value: 'اجازة مرضية', 
    label: isArabic ? 'اجازة مرضية' : 'Sick Leave', 
    isLeave: true 
  },
  { 
    value: 'اجازة ابوية', 
    label: isArabic ? 'اجازة ابوية' : 'Paternity Leave', 
    isLeave: true 
  },
  { 
    value: 'اجازة امومية', 
    label: isArabic ? 'اجازة امومية' : 'Maternity Leave', 
    isLeave: true 
  },
  { 
    value: 'شهادة راتب', 
    label: isArabic ? 'شهادة راتب' : 'Salary Certificate', 
    isLeave: false 
  },
  { 
    value: 'شهادة خبرة', 
    label: isArabic ? 'شهادة خبرة' : 'Experience Certificate', 
    isLeave: false 
  },
  { 
    value: 'شهادة لا مانع', 
    label: isArabic ? 'شهادة لا مانع' : 'No Objection Certificate', 
    isLeave: false 
  },
  { 
    value: 'بدل اجازة سنوية', 
    label: isArabic ? 'بدل اجازة سنوية' : 'Annual Leave Allowance', 
    isLeave: false 
  },
  { 
    value: 'اخرى', 
    label: isArabic ? 'اخرى' : 'Other', 
    isLeave: false 
  }
]

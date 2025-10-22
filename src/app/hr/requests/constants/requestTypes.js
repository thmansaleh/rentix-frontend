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
    value: 'اجازة الوضع', 
    label: isArabic ? 'اجازة الوضع' : 'Paternity Leave', 
    isLeave: true 
  },
  { 
    value: 'اجازة الحداد', 
    label: isArabic ? 'اجازة الحداد' : 'Mourning Leave', 
    isLeave: true 
  },
  { 
    value: 'اجازة التفرغ لإداء الخدمة الوطنية', 
    label: isArabic ? 'اجازة التفرغ لإداء الخدمة الوطنية' : 'National Service Leave', 
    isLeave: true 
  },
  { 
    value: 'اجازة الحج والعمرة', 
    label: isArabic ? 'اجازة الحج والعمرة' : 'Hajj and Umrah Leave', 
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

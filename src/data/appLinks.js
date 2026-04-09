// App navigation links data for search functionality
export const appLinks = [
  // Dashboard
  {
    id: 'dashboard',
    label: { ar: 'لوحة التحكم', en: 'Dashboard' },
    route: '/',
    category: { ar: 'رئيسي', en: 'Main' },
    keywords: { ar: ['لوحة', 'تحكم', 'رئيسي', 'الرئيسية'], en: ['dashboard', 'home', 'main'] }
  },

  // Customers
  {
    id: 'clients',
    label: { ar: 'العملاء', en: 'Customers' },
    route: '/clients',
    category: { ar: 'العملاء', en: 'Customers' },
    keywords: { ar: ['عملاء', 'عميل', 'زبائن', 'مستأجرين'], en: ['customers', 'clients', 'renters', 'tenants'] }
  },

  // Fleet Management
  {
    id: 'cars',
    label: { ar: 'السيارات', en: 'Cars' },
    route: '/cars',
    category: { ar: 'الأسطول', en: 'Fleet' },
    keywords: { ar: ['سيارات', 'سيارة', 'مركبات', 'أسطول'], en: ['cars', 'vehicles', 'fleet', 'automobile'] }
  },
  {
    id: 'accidents',
    label: { ar: 'الحوادث', en: 'Accidents' },
    route: '/accidents',
    category: { ar: 'الأسطول', en: 'Fleet' },
    keywords: { ar: ['حوادث', 'حادث', 'اصطدام', 'تلف'], en: ['accidents', 'incidents', 'damage', 'crash'] }
  },
  {
    id: 'fines',
    label: { ar: 'المخالفات', en: 'Fines' },
    route: '/fines',
    category: { ar: 'الأسطول', en: 'Fleet' },
    keywords: { ar: ['مخالفات', 'مخالفة', 'غرامات', 'جزاء'], en: ['fines', 'tickets', 'violations', 'penalties'] }
  },

  // Contracts
  {
    id: 'contracts',
    label: { ar: 'العقود', en: 'Contracts' },
    route: '/contracts',
    category: { ar: 'العقود', en: 'Contracts' },
    keywords: { ar: ['عقود', 'عقد', 'إيجار', 'اتفاقية'], en: ['contracts', 'agreements', 'rental', 'lease'] }
  },

  // Meetings
  {
    id: 'meetings',
    label: { ar: 'الاجتماعات', en: 'Meetings' },
    route: '/meetings',
    category: { ar: 'الاجتماعات', en: 'Meetings' },
    keywords: { ar: ['اجتماعات', 'اجتماع', 'مواعيد', 'لقاء'], en: ['meetings', 'appointments', 'schedule'] }
  },

  // Statistics
  {
    id: 'statistics',
    label: { ar: 'الإحصائيات', en: 'Statistics' },
    route: '/statistics',
    category: { ar: 'الإحصائيات', en: 'Statistics' },
    keywords: { ar: ['إحصائيات', 'تقارير', 'بيانات', 'تحليل'], en: ['statistics', 'reports', 'analytics', 'data'] }
  },

  // Website Management
  {
    id: 'website-cars',
    label: { ar: 'سيارات الموقع', en: 'Website Cars' },
    route: '/website/cars',
    category: { ar: 'الموقع الإلكتروني', en: 'Website' },
    keywords: { ar: ['موقع', 'سيارات', 'تقييمات', 'عروض'], en: ['website', 'cars', 'reviews', 'listings'] }
  },
  {
    id: 'website-about',
    label: { ar: 'من نحن', en: 'About Us' },
    route: '/website/manage/about',
    category: { ar: 'الموقع الإلكتروني', en: 'Website' },
    keywords: { ar: ['عن الشركة', 'من نحن', 'تعريف'], en: ['about', 'company', 'about us'] }
  },
  {
    id: 'website-contact',
    label: { ar: 'تواصل معنا', en: 'Contact Us' },
    route: '/website/manage/contact',
    category: { ar: 'الموقع الإلكتروني', en: 'Website' },
    keywords: { ar: ['تواصل', 'اتصال', 'تواصل معنا'], en: ['contact', 'contact us', 'reach us'] }
  },
  {
    id: 'website-bookings',
    label: { ar: 'الحجوزات', en: 'Bookings' },
    route: '/website/manage/bookings',
    category: { ar: 'الموقع الإلكتروني', en: 'Website' },
    keywords: { ar: ['حجوزات', 'حجز', 'طلبات'], en: ['bookings', 'reservations', 'requests'] }
  },

  // Human Resources
  {
    id: 'hr-employees',
    label: { ar: 'الموظفين', en: 'Employees' },
    route: '/hr/employees',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['موظفين', 'موظف', 'عامل', 'staff'], en: ['employees', 'staff', 'workers', 'hr'] }
  },
  {
    id: 'hr-add-employee',
    label: { ar: 'إضافة موظف', en: 'Add Employee' },
    route: '/hr/employees/add-employee',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['إضافة', 'موظف', 'جديد', 'تسجيل'], en: ['add', 'new', 'employee', 'register'] }
  },
  {
    id: 'hr-requests',
    label: { ar: 'طلبات الموظفين', en: 'Employee Requests' },
    route: '/hr/requests',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['طلبات', 'طلب', 'إجازة', 'غياب'], en: ['requests', 'leave', 'applications', 'absence'] }
  },
  {
    id: 'hr-forms',
    label: { ar: 'النماذج', en: 'Forms' },
    route: '/hr/forms',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['نماذج', 'نموذج', 'مستندات'], en: ['forms', 'templates', 'documents'] }
  },
  {
    id: 'hr-events',
    label: { ar: 'الأحداث', en: 'Events' },
    route: '/hr/events',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['أحداث', 'فعاليات', 'حدث', 'مناسبة'], en: ['events', 'activities', 'occasions'] }
  },
  {
    id: 'hr-notifications',
    label: { ar: 'إشعارات الموظفين', en: 'HR Notifications' },
    route: '/hr/notifications',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['إشعارات', 'تنبيهات', 'رسائل'], en: ['notifications', 'alerts', 'messages', 'hr'] }
  },

  // Finance
  {
    id: 'bank-accounts',
    label: { ar: 'الحسابات البنكية', en: 'Bank Accounts' },
    route: '/finance/bank-accounts',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['بنك', 'حساب', 'بنكي', 'مصرف'], en: ['bank', 'accounts', 'banking', 'finance'] }
  },
  {
    id: 'invoices',
    label: { ar: 'الفواتير', en: 'Invoices' },
    route: '/finance/invoices',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['فواتير', 'فاتورة', 'مدفوعات'], en: ['invoices', 'bills', 'billing'] }
  },
  {
    id: 'payments',
    label: { ar: 'المدفوعات', en: 'Payments' },
    route: '/finance/payments',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['مدفوعات', 'دفع', 'سداد', 'تحصيل'], en: ['payments', 'pay', 'transactions', 'collection'] }
  },
  {
    id: 'expenses',
    label: { ar: 'المصروفات', en: 'Expenses' },
    route: '/finance/expenses',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['مصروفات', 'نفقات', 'مصاريف'], en: ['expenses', 'costs', 'spending'] }
  },

  // Settings
  {
    id: 'settings-company',
    label: { ar: 'إعدادات الشركة', en: 'Company Settings' },
    route: '/settings/company',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['شركة', 'معلومات', 'إعدادات', 'بيانات'], en: ['company', 'settings', 'profile', 'info'] }
  },
  {
    id: 'settings-appearance',
    label: { ar: 'المظهر', en: 'Appearance' },
    route: '/settings/appearance',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['مظهر', 'ثيم', 'لون', 'تصميم'], en: ['appearance', 'theme', 'display', 'design'] }
  },
  {
    id: 'settings-branches',
    label: { ar: 'الفروع', en: 'Branches' },
    route: '/settings/branches',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['فروع', 'فرع', 'مكاتب', 'مواقع'], en: ['branches', 'offices', 'locations'] }
  },
  {
    id: 'settings-rental-terms',
    label: { ar: 'شروط الإيجار', en: 'Rental Terms' },
    route: '/settings/rental-terms',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['شروط', 'إيجار', 'اتفاقية', 'بنود'], en: ['rental', 'terms', 'conditions', 'agreement'] }
  },
  {
    id: 'settings-assets',
    label: { ar: 'الأصول', en: 'Assets' },
    route: '/settings/assets',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['أصول', 'معدات', 'ممتلكات'], en: ['assets', 'equipment', 'property'] }
  },
  {
    id: 'settings-notifications',
    label: { ar: 'إعدادات الإشعارات', en: 'Notification Settings' },
    route: '/settings/notifications',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['إشعارات', 'تنبيهات', 'إعدادات'], en: ['notifications', 'alerts', 'settings'] }
  },
  {
    id: 'settings-security',
    label: { ar: 'الأمان', en: 'Security' },
    route: '/settings/security',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['أمان', 'كلمة مرور', 'حماية', 'صلاحيات'], en: ['security', 'password', 'protection', 'permissions'] }
  },
  {
    id: 'settings-profile',
    label: { ar: 'الملف الشخصي', en: 'Profile' },
    route: '/settings/profile',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['ملف شخصي', 'حساب', 'بيانات شخصية'], en: ['profile', 'account', 'personal info'] }
  },
  {
    id: 'logs',
    label: { ar: 'سجل النشاط', en: 'Activity Logs' },
    route: '/logs',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['سجل', 'نشاط', 'أحداث', 'تاريخ'], en: ['logs', 'activity', 'audit', 'history'] }
  },
];
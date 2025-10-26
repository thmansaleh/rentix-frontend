// App navigation links data for search functionality
export const appLinks = [
  // Dashboard
  {
    id: 'dashboard',
    label: { ar: 'لوحة التحكم', en: 'Dashboard' },
    route: '/',
    category: { ar: 'رئيسي', en: 'Main' },
    keywords: { ar: ['لوحة', 'تحكم', 'رئيسي', 'dashboard'], en: ['dashboard', 'home', 'main'] }
  },

  // Cases Management
  {
    id: 'cases',
    label: { ar: 'القضايا', en: 'Cases' },
    route: '/cases',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['قضايا', 'محكمة', 'دعوى', 'cases'], en: ['cases', 'lawsuits', 'court'] }
  },
  {
    id: 'add-case',
    label: { ar: 'إضافة ملف قضية', en: 'Add Case File' },
    route: '/cases/add-case',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['إضافة', 'قضية', 'جديد', 'ملف', 'add', 'new'], en: ['add', 'new', 'case', 'file', 'create'] }
  },
  {
    id: 'sessions',
    label: { ar: 'الجلسات', en: 'Sessions' },
    route: '/cases/sessions',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['جلسات', 'محكمة', 'sessions'], en: ['sessions', 'hearings', 'court'] }
  },

  // Clients Management
  {
    id: 'parties',
    label: { ar: 'الموكلين والخصوم', en: 'Clients & Opponents' },
    route: '/parties',
    category: { ar: 'إدارة الموكلين', en: 'Clients Management' },
    keywords: { ar: ['أطراف', 'موكل', 'خصم', 'عملاء', 'parties'], en: ['parties', 'clients', 'opponents', 'customers'] }
  },
  {
    id: 'potential-clients',
    label: { ar: 'العملاء المحتملين', en: 'Potential Clients' },
    route: '/potential-clients',
    category: { ar: 'إدارة الموكلين', en: 'Clients Management' },
    keywords: { ar: ['محتمل', 'عملاء', 'جدد', 'potential'], en: ['potential', 'prospects', 'leads'] }
  },
  {
    id: 'meetings',
    label: { ar: 'المواعيد والاجتماعات', en: 'Meetings & Appointments' },
    route: '/meetings',
    category: { ar: 'إدارة الموكلين', en: 'Clients Management' },
    keywords: { ar: ['اجتماعات', 'مواعيد', 'لقاء', 'meetings'], en: ['meetings', 'appointments', 'consultations'] }
  },
  {
    id: 'call-logs',
    label: { ar: 'سجل المكالمات', en: 'Call Logs' },
    route: '/call-logs',
    category: { ar: 'إدارة الموكلين', en: 'Clients Management' },
    keywords: { ar: ['مكالمات', 'سجل', 'اتصال', 'calls'], en: ['calls', 'logs', 'phone'] }
  },
  {
    id: 'goaml',
    label: { ar: 'GoAML', en: 'GoAML' },
    route: '/goaml',
    category: { ar: 'إدارة الموكلين', en: 'Clients Management' },
    keywords: { ar: ['غسل', 'أموال', 'مكافحة', 'goaml'], en: ['goaml', 'aml', 'anti-money laundering'] }
  },

  // Approvals Center
  {
    id: 'approvals',
    label: { ar: 'مركز الموافقات', en: 'Approvals Center' },
    route: '/approvals',
    category: { ar: 'إدارة', en: 'Management' },
    keywords: { ar: ['موافقات', 'اعتماد', 'approvals'], en: ['approvals', 'authorizations', 'confirmations'] }
  },

  // Human Resources
  {
    id: 'employees',
    label: { ar: 'الموظفين', en: 'Employees' },
    route: '/hr/employees',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['موظفين', 'موظف', 'عامل', 'employees'], en: ['employees', 'staff', 'workers'] }
  },
  {
    id: 'hr-requests',
    label: { ar: 'الطلبات', en: 'Requests' },
    route: '/hr/requests',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['طلبات', 'طلب', 'إجازة', 'requests'], en: ['requests', 'applications', 'leave'] }
  },
  {
    id: 'hr-assets',
    label: { ar: 'الأصول', en: 'Assets' },
    route: '/hr/assets',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['أصول', 'معدات', 'assets'], en: ['assets', 'equipment'] }
  },
  {
    id: 'hr-forms',
    label: { ar: 'النماذج', en: 'Forms' },
    route: '/hr/forms',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['نماذج', 'نموذج', 'forms'], en: ['forms', 'templates', 'documents'] }
  },
  {
    id: 'hr-events',
    label: { ar: 'الاحداث', en: 'Events' },
    route: '/hr/events',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['فعاليات', 'حدث', 'events'], en: ['events', 'activities', 'occasions'] }
  },
  {
    id: 'hr-notifications',
    label: { ar: 'الإشعارات', en: 'Notifications' },
    route: '/hr/notifications',
    category: { ar: 'الموارد البشرية', en: 'Human Resources' },
    keywords: { ar: ['إشعارات', 'تنبيه', 'notifications'], en: ['notifications', 'alerts', 'messages'] }
  },

  // Finance
  {
    id: 'finance-clients',
    label: { ar: 'العملاء', en: 'Clients' },
    route: '/finance/clients',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['مالية', 'عملاء', 'فواتير', 'finance'], en: ['finance', 'clients', 'billing'] }
  },
  {
    id: 'wallets',
    label: { ar: 'أرصدة الموكلين', en: 'Client Balances' },
    route: '/finance/wallets',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['أرصدة', 'رصيد', 'محافظ', 'موكلين', 'balances'], en: ['balances', 'wallets', 'accounts', 'ledger'] }
  },
  {
    id: 'invoices',
    label: { ar: 'الفواتير', en: 'Invoices' },
    route: '/finance/invoices',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['فواتير', 'فاتورة', 'invoices'], en: ['invoices', 'bills', 'billing'] }
  },
  {
    id: 'bank-accounts',
    label: { ar: 'الحسابات البنكية', en: 'Bank Accounts' },
    route: '/finance/bank-accounts',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['بنك', 'حساب', 'بنكي', 'bank'], en: ['bank', 'accounts', 'banking'] }
  },
  {
    id: 'finance-statistics',
    label: { ar: 'الإحصائيات', en: 'Statistics' },
    route: '/finance/statistics',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['إحصائيات', 'تقارير', 'statistics'], en: ['statistics', 'reports', 'analytics'] }
  },
  {
    id: 'finance-employees',
    label: { ar: 'كشوف حسابات الموظفين', en: 'Employee Statements' },
    route: '/finance/employees',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['موظفين', 'كشوف', 'حسابات', 'رواتب'], en: ['employees', 'statements', 'payroll', 'salaries'] }
  },

  // Settings
  {
    id: 'settings-appearance',
    label: { ar: 'المظهر', en: 'Appearance' },
    route: '/settings/appearance',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['مظهر', 'ثيم', 'appearance', 'theme'], en: ['appearance', 'theme', 'display'] }
  },
  {
    id: 'settings-branches',
    label: { ar: 'الفروع', en: 'Branches' },
    route: '/settings/branches',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['فروع', 'فرع', 'مكاتب', 'branches'], en: ['branches', 'offices', 'locations'] }
  },
  {
    id: 'settings-performance',
    label: { ar: 'الأداء', en: 'Performance' },
    route: '/settings/performance',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['أداء', 'performance'], en: ['performance', 'speed', 'optimization'] }
  },
  {
    id: 'logs',
    label: { ar: 'سجل النشاط', en: 'Activity Logs' },
    route: '/logs',
    category: { ar: 'الإعدادات', en: 'Settings' },
    keywords: { ar: ['سجل', 'نشاط', 'logs'], en: ['logs', 'activity', 'audit'] }
  },
];

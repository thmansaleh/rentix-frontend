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
    label: { ar: 'إضافة قضية', en: 'Add Case' },
    route: '/cases/add-case',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['إضافة', 'قضية', 'جديد', 'add', 'new'], en: ['add', 'new', 'case', 'create'] }
  },
  {
    id: 'sessions',
    label: { ar: 'الجلسات', en: 'Sessions' },
    route: '/cases/sessions',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['جلسات', 'محكمة', 'sessions'], en: ['sessions', 'hearings', 'court'] }
  },
  {
    id: 'my-tasks',
    label: { ar: 'مهامي', en: 'My Tasks' },
    route: '/cases/my-tasks',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['مهام', 'مهمة', 'tasks'], en: ['tasks', 'todos', 'assignments'] }
  },
  {
    id: 'judgments',
    label: { ar: 'الأحكام الصادرة', en: 'Issued Judgments' },
    route: '/judgments',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['أحكام', 'حكم', 'قرار', 'judgments'], en: ['judgments', 'verdicts', 'rulings'] }
  },

  // Parties
  {
    id: 'parties',
    label: { ar: 'الأطراف', en: 'Parties' },
    route: '/parties',
    category: { ar: 'العملاء', en: 'Clients' },
    keywords: { ar: ['أطراف', 'عملاء', 'موكل', 'parties', 'clients'], en: ['parties', 'clients', 'customers'] }
  },

  // Potential Clients
  {
    id: 'potential-clients',
    label: { ar: 'العملاء المحتملين', en: 'Potential Clients' },
    route: '/potential-clients',
    category: { ar: 'العملاء', en: 'Clients' },
    keywords: { ar: ['محتمل', 'عملاء', 'جدد', 'potential'], en: ['potential', 'prospects', 'leads'] }
  },

  // Approvals
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
    id: 'client-balances',
    label: { ar: 'أرصدة العملاء', en: 'Client Balances' },
    route: '/finance/client-balances',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['أرصدة', 'رصيد', 'عملاء', 'balances'], en: ['balances', 'accounts', 'ledger'] }
  },
  {
    id: 'bank-accounts',
    label: { ar: 'الحسابات البنكية', en: 'Bank Accounts' },
    route: '/finance/bank-accounts',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['بنك', 'حساب', 'بنكي', 'bank'], en: ['bank', 'accounts', 'banking'] }
  },
  {
    id: 'invoices',
    label: { ar: 'الفواتير العامة', en: 'General Invoices' },
    route: '/finance/invoices',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['فواتير', 'فاتورة', 'invoices'], en: ['invoices', 'bills', 'billing'] }
  },
  {
    id: 'cash-box',
    label: { ar: 'الصندوق النقدي', en: 'Cash Box' },
    route: '/finance/cash-box',
    category: { ar: 'المالية', en: 'Finance' },
    keywords: { ar: ['صندوق', 'نقدي', 'كاش', 'cash'], en: ['cash', 'cashbox', 'petty cash'] }
  },

  // GOAML
  {
    id: 'goaml',
    label: { ar: 'مكافحة غسل الأموال', en: 'GOAML' },
    route: '/goaml',
    category: { ar: 'إدارة', en: 'Management' },
    keywords: { ar: ['غسل', 'أموال', 'مكافحة', 'goaml'], en: ['goaml', 'aml', 'anti-money laundering'] }
  },

  // Call Logs
  {
    id: 'call-logs',
    label: { ar: 'سجل المكالمات', en: 'Call Logs' },
    route: '/call-logs',
    category: { ar: 'إدارة', en: 'Management' },
    keywords: { ar: ['مكالمات', 'سجل', 'اتصال', 'calls'], en: ['calls', 'logs', 'phone'] }
  },

  // Charts
//   {
//     id: 'charts',
//     label: { ar: 'الرسوم البيانية', en: 'Charts' },
//     route: '/charts',
//     category: { ar: 'إدارة', en: 'Management' },
//     keywords: { ar: ['رسوم', 'بيانية', 'charts'], en: ['charts', 'graphs', 'visualization'] }
//   },

  // Settings
//   {
//     id: 'settings',
//     label: { ar: 'الإعدادات', en: 'Settings' },
//     route: '/settings',
//     category: { ar: 'النظام', en: 'System' },
//     keywords: { ar: ['إعدادات', 'إعداد', 'settings'], en: ['settings', 'preferences', 'configuration'] }
//   },
  {
    id: 'settings-appearance',
    label: { ar: 'المظهر', en: 'Appearance' },
    route: '/settings/appearance',
    category: { ar: 'النظام', en: 'System' },
    keywords: { ar: ['مظهر', 'ثيم', 'appearance', 'theme'], en: ['appearance', 'theme', 'display'] }
  },
//   {
//     id: 'settings-profile',
//     label: { ar: 'الملف الشخصي', en: 'Profile' },
//     route: '/settings/profile',
//     category: { ar: 'النظام', en: 'System' },
//     keywords: { ar: ['ملف', 'شخصي', 'profile'], en: ['profile', 'account', 'user'] }
//   },
//   {
//     id: 'settings-security',
//     label: { ar: 'الأمان', en: 'Security' },
//     route: '/settings/security',
//     category: { ar: 'النظام', en: 'System' },
//     keywords: { ar: ['أمان', 'حماية', 'security'], en: ['security', 'password', 'privacy'] }
//   },
//   {
//     id: 'settings-general',
//     label: { ar: 'عام', en: 'General' },
//     route: '/settings/general',
//     category: { ar: 'النظام', en: 'System' },
//     keywords: { ar: ['عام', 'general'], en: ['general', 'basic', 'common'] }
//   },

  // Payments
//   {
//     id: 'payments',
//     label: { ar: 'المدفوعات', en: 'Payments' },
//     route: '/payments',
//     category: { ar: 'المالية', en: 'Finance' },
//     keywords: { ar: ['مدفوعات', 'دفع', 'payments'], en: ['payments', 'transactions', 'billing'] }
//   },

  // Sessions (standalone)
  {
    id: 'sessions-page',
    label: { ar: 'الجلسات', en: 'Sessions' },
    route: '/sessions',
    category: { ar: 'إدارة القضايا', en: 'Cases Management' },
    keywords: { ar: ['جلسات', 'sessions'], en: ['sessions', 'hearings'] }
  },
];

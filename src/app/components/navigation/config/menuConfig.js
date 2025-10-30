import { 
  LayoutDashboard, 
  Users, 
  UserRoundPlus,
  Package,
  Scale,
  Calendar,
  FolderPlus,
  CheckCircle,
  FileText,
  ScrollText,
  Bell,
  Settings2,
  Palette,
  Shield,
  Phone,
  DollarSign,
  Banknote,
  Clock,
  Wallet,
  List,
  BarChartIcon,
  Users2,
  Building2,
  Gauge
} from 'lucide-react';

export const getMenuItems = (t, userRole = null, userDepartment = null, permissions = []) => {
  // Check if user has access to HR section (admin or HR Officer)
  const hasHRAccess = userRole === 'admin' || userRole === 'HR Officer';
  
  // Check if user has access to Finance section (admin or Accountant)
  const hasFinanceAccess = userRole === 'admin' || userRole === 'Accountant';
  
  // Check if user has access to Logs section (admin only)
  const hasLogsAccess = userRole === 'admin';
  
  // Check if user has access to Legal sections (admin or specific departments)
  const legalDepartments = ['Litigation', 'Consultation', 'Legal Department'];
  const hasLegalAccess = userRole === 'admin' || legalDepartments.includes(userDepartment);
  
  // Helper function to check permissions
  const hasPermission = (permissionName) => {
    if (userRole === 'admin') return true;
    return permissions.some(
      permission => 
        permission.permission_ar === permissionName || 
        permission.permission_en === permissionName
    );
  };

  const menuItems = [
    {
      id: '/',
      label: t('navigation.dashboard'),
      icon: LayoutDashboard,
      type: 'link'
    },

    // Cases Management - Only visible to admin or Legal departments (Litigation, Consultation, Legal Department)
    ...(hasLegalAccess ? [{
      id: 'casesManagement',
      label: t('navigation.casesManagement'),
      icon: Scale,
      type: 'category',
      submenu: [
        { id: 'cases', label: t('navigation.cases'), icon: Scale },
        ...(hasPermission('Add Case') ? [
          { id: 'cases/add-case', label: t('navigation.addCaseFile'), icon: FolderPlus }
        ] : []),
        { id: 'cases/sessions', label: t('navigation.sessions'), icon: Calendar },
        { id: 'cases/judicial-decisions', label: t('navigation.judicialDecisions'), icon: CheckCircle },
      ]
    }] : []),
    // Clients Management - Only visible to admin or Legal departments
    ...(hasLegalAccess ? [{
      id: 'clientsManagement',
      label: t('navigation.clientsManagement'),
      icon: Users,
      type: 'category',
      submenu: [
        { id: 'parties', label: t('navigation.parties'), icon: Users },
        { id: 'potential-clients', label: t('navigation.potentialClients'), icon: UserRoundPlus },
        { id: 'meetings', label: t('navigation.meetings'), icon: Calendar },
        { id: 'call-logs', label: t('navigation.callLogs'), icon: Phone },
        { id: 'goaml', label: t('navigation.goaml'), icon: Shield },
      ]
    }] : []),
    {
      id: 'approvals',
      label: t('navigation.approvalsCenter'),
      icon: CheckCircle,
      type: 'link'
    },
    // HR Section - Only visible to admin or HR Officer
    ...(hasHRAccess ? [{
      id: 'humanResources',
      label: t('navigation.humanResources'),
      icon: Users,
      type: 'category',
      submenu: [
        { id: 'hr/employees', label: t('navigation.employees'), icon: Users },
        { id: 'hr/requests', label: t('navigation.requests'), icon: FileText },
        { id: 'hr/assets', label: t('navigation.assets'), icon: Package },
        { id: 'hr/forms', label: t('navigation.forms'), icon: ScrollText },
        { id: 'hr/events', label: t('navigation.events'), icon: Calendar },
        { id: 'hr/notifications', label: t('navigation.notifications'), icon: Bell },
      ]
    }] : []),
    // Finance Section - Only visible to admin or Accountant
    ...(hasFinanceAccess ? [{
      id: 'finance',
      label: t('navigation.finance'),
      icon: DollarSign,
      type: 'category',
      submenu: [
        { id: 'finance/clients', label: t('navigation.financeClients'), icon: Users },
        { id: 'finance/wallets', label: t('navigation.clientBalances'), icon: Wallet },
        { id: 'finance/invoices', label: t('navigation.invoices'), icon: List },
        { id: 'finance/bank-accounts', label: t('navigation.bankAccounts'), icon: Banknote },
        { id: 'finance/statistics', label: t('navigation.statistics'), icon: BarChartIcon },
        { id: 'finance/employees', label: t('navigation.employeesStatements'), icon: Users2     },
      ]
    }] : []),
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: Settings2,
      type: 'category',
      submenu: [
        { id: 'settings/appearance', label: t('navigation.appearance'), icon: Palette },
        // Branches and Performance - Only visible to admin
        ...(userRole === 'admin' ? [
          { id: 'settings/branches', label: t('navigation.branches'), icon: Building2 },
          { id: 'settings/performance', label: t('navigation.performance'), icon: Gauge },
        ] : []),
        // Logs - Only visible to admin
        ...(hasLogsAccess ? [
          { id: 'logs', label: t('navigation.logs'), icon: Clock }
        ] : []),
      ]
    }
  ];

  return menuItems;
};

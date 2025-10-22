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
  Wallet
} from 'lucide-react';

export const getMenuItems = (t, userRole = null, userDepartment = null) => {
  // Check if user has access to HR section (admin or HR Officer)
  const hasHRAccess = userRole === 'admin' || userRole === 'HR Officer';
  
  // Check if user has access to Finance section (admin or Accountant)
  const hasFinanceAccess = userRole === 'admin' || userRole === 'Accountant';
  
  // Check if user has access to Logs section (admin only)
  const hasLogsAccess = userRole === 'admin';
  
  // Check if user has access to Legal sections (admin or specific departments)
  const legalDepartments = ['Litigation', 'Consultation', 'Legal Department'];
  const hasLegalAccess = userRole === 'admin' || legalDepartments.includes(userDepartment);

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
        { id: 'cases/add-case', label: t('navigation.addCaseFile'), icon: FolderPlus },
        { id: 'cases/sessions', label: t('navigation.sessions'), icon: Calendar },
      ]
    }] : []),
    // Clients Management - Only visible to admin or Legal departments
    ...(hasLegalAccess ? [{
      id: 'clientsManagement',
      label: 'ادارة الموكلين',
      icon: Users,
      type: 'category',
      submenu: [
        { id: 'parties', label: t('navigation.parties'), icon: Users },
        { id: 'potential-clients', label: t('navigation.potentialClients'), icon: UserRoundPlus },
        { id: 'meetings', label: 'المواعيد والاجتماعات', icon: Calendar },
        { id: 'call-logs', label: 'سجل المكالمات', icon: Phone },
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
    // ...(hasFinanceAccess ? [{
    //   id: 'finance',
    //   label: 'المالية',
    //   icon: DollarSign,
    //   type: 'category',
    //   submenu: [
    //     { id: 'finance/bank-accounts', label: 'الحسابات البنكية', icon: Banknote },
    //     { id: 'finance/wallets', label: 'ارصدة الموكلين', icon: Wallet },
    //   ]
    // }] : []),
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: Settings2,
      type: 'category',
      submenu: [
        { id: 'settings/appearance', label: t('navigation.appearance'), icon: Palette },
        // Logs - Only visible to admin
        ...(hasLogsAccess ? [
          { id: 'logs', label: t('navigation.logs'), icon: Clock }
        ] : []),
      ]
    }
  ];

  return menuItems;
};

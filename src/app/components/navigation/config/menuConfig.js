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
  Clock
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
    // Parties - Only visible to admin or Legal departments
    ...(hasLegalAccess ? [{
      id: 'parties',
      label: t('navigation.parties'),
      icon: Users,
      type: 'link'
    }] : []),
    // Potential Clients - Only visible to admin or Legal departments
    ...(hasLegalAccess ? [{
      id: 'potential-clients',
      label: t('navigation.potentialClients'),
      icon: UserRoundPlus,
      type: 'link'
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
      label: 'المالية',
      icon: DollarSign,
      type: 'category',
      submenu: [
        { id: 'finance/bank-accounts', label: 'الحسابات البنكية', icon: Banknote },
      ]
    }] : []),
    {
      id: 'goaml',
      label: t('navigation.goaml'),
      icon: Shield,
      type: 'link'
    },
    {
      id: 'call-logs',
      label: 'سجل المكالمات',
      icon: Phone,
      type: 'link'
    },
    // Logs Section - Only visible to admin
    ...(hasLogsAccess ? [{
      id: 'logs',
      label: t('navigation.logs'),
      icon: Clock,
      type: 'link'
    }] : []),
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: Settings2,
      type: 'category',
      submenu: [
        { id: 'settings/appearance', label: t('navigation.appearance'), icon: Palette },
      ]
    }
  ];

  return menuItems;
};

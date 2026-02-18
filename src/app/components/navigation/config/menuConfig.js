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
  List,
  BarChartIcon,
  Users2,
  Building2,
  Gauge,
  Car,
  Globe,
  AlertTriangle
} from 'lucide-react';

export const getMenuItems = (t, userRole = null, userDepartment = null, permissions = []) => {
  const menuItems = [
    {
      id: '/',
      label: t('navigation.dashboard'),
      icon: LayoutDashboard,
      type: 'link'
    },
   
    
    {
      id: 'cars',
      label: t('navigation.cars'),
      icon: Car,
      type: 'link'
    },
    {
      id: 'clients',
      label: t('navigation.customers'),
      icon: Users2,
      type: 'link'
    },
    {
      id: 'contracts',
      label: t('navigation.contracts'),
      icon: FileText,
      type: 'link'
    },
    {
      id: 'accidents',
      label: t('navigation.accidents'),
      icon: AlertTriangle,
      type: 'link'
    },
    {
      id: 'website',
      label: t('navigation.website'),
      icon: Globe,
      type: 'link'
    },
    {
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
    },
    {
      id: 'finance',
      label: t('navigation.finance'),
      icon: DollarSign,
      type: 'category',
      submenu: [
        { id: 'finance/bank-accounts', label: t('navigation.bankAccounts'), icon: Banknote },
      ]
    },
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: Settings2,
      type: 'category',
      submenu: [
        { id: 'settings/company', label: t('navigation.company'), icon: Building2 },
        { id: 'settings/appearance', label: t('navigation.appearance'), icon: Palette },
        { id: 'settings/branches', label: t('navigation.branches'), icon: Building2 },
        { id: 'settings/rental-terms', label: t('navigation.rentalTerms'), icon: ScrollText },
        // { id: 'settings/performance', label: t('navigation.performance'), icon: Gauge },
        { id: 'logs', label: t('navigation.logs'), icon: Clock },
      ]
    }
  ];

  return menuItems;
};

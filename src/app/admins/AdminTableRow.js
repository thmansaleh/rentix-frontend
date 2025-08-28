import { User, MoreHorizontal, Eye, Edit, Trash2, Shield, List } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import PermissionsDialog from './PermissionsDialog';
import UserDetailsDialog from './UserDetailsDialog';
import EditUserDialog from './EditUserDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ActivityLogModal from './ActivityLogModal';
import { useTranslations } from '@/hooks/useTranslations';

export default function AdminTableRow({ admin, StatusBadge }) {
  const t = useTranslations();
  
  return (
    <tr className="hover:bg-muted/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User className="w-6 h-6 text-muted-foreground" />
          <div className="mr-4">
            <div className="text-sm font-medium text-foreground">{admin.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {admin.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {admin.role}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {admin.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={admin.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {admin.lastLogin}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-muted">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" dir="rtl">
            <UserDetailsDialog
              admin={admin}
              trigger={
                <div className="flex items-center gap-2 cursor-pointer w-full h-full">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  {t('buttons.view')} {t('buttons.details')}
                </div>
              }
            />
            <EditUserDialog
              admin={admin}
              trigger={
                <div className="flex items-center gap-2 cursor-pointer w-full h-full">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                  {t('buttons.edit')}
                </div>
              }
            />
            <ConfirmDeleteDialog
              trigger={
                <div className="flex items-center gap-2 cursor-pointer w-full h-full">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                  {t('buttons.delete')}
                </div>
              }
              onConfirm={() => {
                // TODO: implement delete logic here
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <PermissionsDialog
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded text-right cursor-pointer border-none bg-transparent"
            >
              <Shield className="w-4 h-4 text-muted-foreground" />
              {t('admins.permissions')}
            </button>
          }
        />
        <ActivityLogModal
          admin={admin}
          trigger={
            <div className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded text-right cursor-pointer">
              <List className="w-4 h-4 text-muted-foreground" />
              <span>{t('admins.activityLog')}</span>
            </div>
          }
        />
      </td>
      
    </tr>
  );
}
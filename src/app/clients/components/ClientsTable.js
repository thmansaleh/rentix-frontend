"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ShieldBan, User, Users, Plus } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Shared clients table used by both the Clients page and Blocked Clients page.
 *
 * Props:
 *  - customers        {Array}    - list of customer objects
 *  - onView           {Function} - called with customerId
 *  - onEdit           {Function} - called with customerId
 *  - onDelete         {Function} - called with customer object
 *  - onAddFirst       {Function} - called when "Add First Client" button is clicked (optional)
 *  - searchQuery      {string}   - current active search query
 *  - emptyIcon        {ReactNode}- optional icon override for empty state
 *  - emptyMessage     {string}   - optional override for empty message
 */
export function ClientsTable({
  customers = [],
  onView,
  onEdit,
  onDelete,
  onAddFirst,
  searchQuery = '',
  emptyMessage,
}) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {emptyMessage || (searchQuery ? t('clients.noMatchingClients') : t('clients.noClientsFound'))}
        </p>
        {!searchQuery && onAddFirst && (
          <Button onClick={onAddFirst}>
            <Plus className="w-4 h-4 mr-2" />
            {t('clients.addFirstClient')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('clients.table.name')}</TableHead>
            <TableHead>{t('clients.table.phone')}</TableHead>
            <TableHead>{t('clients.table.nationality')}</TableHead>
            <TableHead>{t('clients.table.status')}</TableHead>
            <TableHead>{t('clients.table.joinDate')}</TableHead>
            <TableHead className="text-right">{t('clients.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              {/* Name */}
              <TableCell className="py-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {customer.full_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>
                {isRTL ? customer.nationality_ar : customer.nationality_en || '-'}
              </TableCell>
              <TableCell>
                {customer.is_blacklisted ? (
                  <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                    <ShieldBan className="w-3 h-3" />
                    {t('clients.blacklisted')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
                    {t('clients.active')}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{formatDate(customer.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(customer.id)}
                    className="h-8 w-8 p-0"
                    title={t('clients.viewClient')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(customer.id)}
                    className="h-8 w-8 p-0"
                    title={t('clients.editClient')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(customer)}
                    className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title={t('clients.deleteClient')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

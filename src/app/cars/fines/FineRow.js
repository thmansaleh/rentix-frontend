import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DollarSign, Info, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import ChangeStatusDialog from './ChangeStatusDialog';
import FineDetailsDialog from './FineDetailsDialog'; // Import details dialog
import EditFineDialog from './EditFineDialog'; // Import the dialog
import DeleteFineDialog from './DeleteFineDialog'; // Add this import
import { useTranslations } from '@/hooks/useTranslations';

export default function FineRow({ fine }) {
  const t = useTranslations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const statusLabels = {
    paid: t('fines.status.paid'),
    unpaid: t('fines.status.unpaid'),
  };

  const statusColors = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    unpaid: 'bg-red-100 text-red-800 border-red-200',
  };

  const handleChangeStatus = () => {
    setDialogOpen(false);
    // ...update status logic...
  };

  const handleEditSave = (updatedFine) => {
    // ...save logic (API call or state update)...
    setEditOpen(false);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    // ...delete logic (API call or state update)...
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">{fine.id}</td>
      <td className="px-4 py-3">{fine.carPlate}</td>
      <td className="px-4 py-3">{fine.amount} درهم</td>
      <td className="px-4 py-3">{fine.date}</td>
      <td className="px-4 py-3">{fine.reason}</td>
      <td className="px-4 py-3">{fine.emirate}</td>
      <td className="px-4 py-3">{fine.source}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[fine.status]}`}
        >
          {statusLabels[fine.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
              <Info className="ml-2 w-4 h-4 text-gray-500" />
              {t('fines.actions.details')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="ml-2 w-4 h-4 text-gray-500" />
              {t('fines.actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              <DollarSign
                className={`ml-2 w-4 h-4 ${fine.status === 'paid' ? 'text-red-500' : 'text-green-500'}`}
              />
              {fine.status === 'paid' ? t('fines.actions.changeStatusToUnpaid') : t('fines.actions.changeStatusToPaid')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              <Trash2 className="ml-2 w-4 h-4 text-red-500" />
              {t('fines.actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ChangeStatusDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleChangeStatus}
          status={fine.status}
        />
        <FineDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          fine={fine}
        />
        <EditFineDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          fine={fine}
          onSave={handleEditSave}
        />
        <DeleteFineDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
        />
      </td>
    </tr>
  );
}
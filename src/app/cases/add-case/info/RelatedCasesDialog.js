'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link } from 'lucide-react';
import RelatedCases from './RelatedCases';
import { useTranslations } from '@/hooks/useTranslations';

function RelatedCasesDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          <Link className="h-4 w-4" />
          <span className="text-sm font-medium">{t('employeeFinance.relatedCases.relatedFiles')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('employeeFinance.relatedCases.manageRelatedFiles')}</DialogTitle>
          <DialogDescription>
            {t('employeeFinance.relatedCases.addRemoveRelatedFiles')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <RelatedCases />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RelatedCasesDialog;

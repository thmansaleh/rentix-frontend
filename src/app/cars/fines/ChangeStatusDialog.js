import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ChangeStatusDialog({ open, onOpenChange, onConfirm, status }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-2">تأكيد تغيير الحالة</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          هل أنت متأكد أنك تريد تغيير الحالة إلى&nbsp;
          <span className={status === 'paid' ? 'text-red-600' : 'text-green-600'}>
            {status === 'paid' ? 'غير مدفوع' : 'مدفوع'}
          </span>
          ؟
        </div>
        <DialogFooter className="flex flex-row-reverse gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>لا</Button>
          <Button className="ml-2" onClick={onConfirm}>نعم</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
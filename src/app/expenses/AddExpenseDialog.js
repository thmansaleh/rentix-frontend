'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const AddExpenseDialog = () => {
  const router = useRouter();

  const handleAddExpense = () => {
    router.push('/expenses/add');
  };

  return (
    <Button onClick={handleAddExpense} className="gap-2">
      <Plus size={16} />
      إضافة مصروف جديد
    </Button>
  );
};

export default AddExpenseDialog;

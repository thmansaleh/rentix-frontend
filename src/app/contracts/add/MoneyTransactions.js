import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
// Import Dialog components from shadcn
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CreditCard, Receipt } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    addTransaction,
    removeTransaction,
    addAdditionalFee,
    removeAdditionalFee
} from '../../../redux/slices/addContractSlice';

function MoneyTransactions() {
    const dispatch = useDispatch();
    const contractData = useSelector((state) => state.addContract);
    const { transactions, additionalFees, totalPrice } = contractData;
    
    const t = useTranslations('contracts.addForm.payments');
    const tFees = useTranslations('contracts.addForm.additionalFees');
    const tButtons = useTranslations('buttons');
    
    // Local state for form inputs
    const [user, setUser] = useState('othman');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState(t('cash'));
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    
    // Additional fees local state for form inputs
    const [feeAmount, setFeeAmount] = useState('');
    const [feeType, setFeeType] = useState(tFees('violation'));
    const [feeNote, setFeeNote] = useState('');
    const [feeError, setFeeError] = useState('');
    const [openFeeDialog, setOpenFeeDialog] = useState(false);
    const [deleteFeeId, setDeleteFeeId] = useState(null);
    
    const { isRTL } = useLanguage();

    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const feesTotal = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    const remainingAmount = (Number(totalPrice) || 0) - total;

    const handleAddTransaction = () => {
        if (!amount || isNaN(amount)) {
            setError(t('enterAmountCorrectly'));
            return;
        }
        if (!method) {
            setError(t('selectPaymentMethod'));
            return;
        }
        
        const newTransaction = {
            id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
            user: user || '',
            amount: Number(amount),
            method
        };
        
        dispatch(addTransaction(newTransaction));
        setAmount('');
        setMethod(t('cash'));
        setError('');
    };

    const handleAddFee = () => {
        if (!feeAmount || isNaN(feeAmount)) {
            setFeeError(tFees('enterAmountCorrectly'));
            return;
        }
        if (!feeType) {
            setFeeError(tFees('selectFeeType'));
            return;
        }
        
        const newFee = {
            id: additionalFees.length > 0 ? Math.max(...additionalFees.map(f => f.id)) + 1 : 1,
            amount: Number(feeAmount),
            type: feeType,
            note: feeNote
        };
        
        dispatch(addAdditionalFee(newFee));
        setFeeAmount('');
        setFeeType(tFees('violation'));
        setFeeNote('');
        setFeeError('');
    };

    // Open dialog and set id to delete
    const handleAskDelete = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleAskDeleteFee = (id) => {
        setDeleteFeeId(id);
        setOpenFeeDialog(true);
    };

    // Confirm delete
    const handleDeleteTransaction = () => {
        dispatch(removeTransaction(deleteId));
        setOpenDialog(false);
        setDeleteId(null);
    };

    const handleDeleteFee = () => {
        dispatch(removeAdditionalFee(deleteFeeId));
        setOpenFeeDialog(false);
        setDeleteFeeId(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    {t('title')} / {tFees('title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="payments" dir={isRTL ? "rtl" : "ltr"}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="payments" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {t('title')}
                        </TabsTrigger>
                        <TabsTrigger value="additionalFees" className="flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            {tFees('title')}
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="payments" className="space-y-4">
                        <div className="flex gap-2 mb-4">
                            <Input
                                className="w-44"
                                type="number"
                                placeholder={t('amount')}
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                            <Select dir={isRTL ? "rtl" : "ltr"} value={method} onValueChange={setMethod}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder={t('paymentMethod')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={t('cash')}>{t('cash')}</SelectItem>
                                    <SelectItem value={t('card')}>{t('card')}</SelectItem>
                                    <SelectItem value={t('check')}>{t('check')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleAddTransaction}
                                className="cursor-pointer"
                            >
                                {t('add')}
                            </Button>
                        </div>
                        {error && (
                            <div className="text-red-600 text-sm mb-2">{error}</div>
                        )}
                        <div className="border rounded-lg overflow-hidden mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">{t('amount')}</TableHead>
                                        <TableHead className="text-center">{t('paymentMethod')}</TableHead>
                                        <TableHead className="text-center">{t('user')}</TableHead>
                                        <TableHead className="text-center">{t('delete')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                                                {t('noPayments')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map(transaction => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="text-center">{transaction.amount}</TableCell>
                                                <TableCell className="text-center">{transaction.method}</TableCell>
                                                <TableCell className="text-center">{transaction.user}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        className='cursor-pointer'
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleAskDelete(transaction.id)}
                                                    >
                                                        {t('delete')}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="font-bold mt-2">
                            {t('total')}: {total}
                        </div>
                        <div className="font-bold mt-2">
                            {t('remainingAmount')}: {remainingAmount}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="additionalFees" className="space-y-4">
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <Input
                                className="w-44"
                                type="number"
                                placeholder={tFees('amount')}
                                value={feeAmount}
                                onChange={e => setFeeAmount(e.target.value)}
                            />
                            <Select dir={isRTL ? "rtl" : "ltr"} value={feeType} onValueChange={setFeeType}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder={tFees('feeType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={tFees('violation')}>{tFees('violation')}</SelectItem>
                                    <SelectItem value={tFees('fuel')}>{tFees('fuel')}</SelectItem>
                                    <SelectItem value={tFees('carWash')}>{tFees('carWash')}</SelectItem>
                                    <SelectItem value={tFees('extraKilometers')}>{tFees('extraKilometers')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                className="w-48"
                                placeholder={tFees('note')}
                                value={feeNote}
                                onChange={e => setFeeNote(e.target.value)}
                            />
                            <Button
                                onClick={handleAddFee}
                                className="cursor-pointer"
                            >
                                {tFees('add')}
                            </Button>
                        </div>
                        {feeError && (
                            <div className="text-red-600 text-sm mb-2">{feeError}</div>
                        )}
                        <div className="border rounded-lg overflow-hidden mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">{tFees('amount')}</TableHead>
                                        <TableHead className="text-center">{tFees('feeType')}</TableHead>
                                        <TableHead className="text-center">{tFees('note')}</TableHead>
                                        <TableHead className="text-center">{tFees('delete')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {additionalFees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                                                {tFees('noFees')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        additionalFees.map(fee => (
                                            <TableRow key={fee.id}>
                                                <TableCell className="text-center">{fee.amount}</TableCell>
                                                <TableCell className="text-center">{fee.type}</TableCell>
                                                <TableCell className="text-center">{fee.note || '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        className='cursor-pointer'
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleAskDeleteFee(fee.id)}
                                                    >
                                                        {tFees('delete')}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="font-bold mt-2">
                            {tFees('total')}: {feesTotal}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            
            {/* Dialog for confirming delete action for payments */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('confirmDelete')}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 mb-2">
                        {t('deleteMessage')}
                    </div>
                    <DialogFooter>
                        <Button
                            className='cursor-pointer'
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            className='cursor-pointer'
                            variant="destructive"
                            onClick={handleDeleteTransaction}
                        >
                            {t('confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Dialog for confirming delete action for additional fees */}
            <Dialog open={openFeeDialog} onOpenChange={setOpenFeeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{tFees('confirmDelete')}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 mb-2">
                        {tFees('deleteMessage')}
                    </div>
                    <DialogFooter>
                        <Button
                            className='cursor-pointer'
                            variant="outline"
                            onClick={() => setOpenFeeDialog(false)}
                        >
                            {tFees('cancel')}
                        </Button>
                        <Button
                            className='cursor-pointer'
                            variant="destructive"
                            onClick={handleDeleteFee}
                        >
                            {tFees('confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default MoneyTransactions;
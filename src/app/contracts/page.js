"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Plus, FileText, Search, SlidersHorizontal, X, CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';
import { getContracts } from '../services/api/contracts';
import { AddContractModal } from './AddContractModal';
import ContractsTable from './ContractsTable';

const EMPTY_FILTERS = { search: '', status: 'all', dateFrom: '', dateTo: '' };

export default function ContractsPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Draft state — what the user is currently typing/selecting
  const [draft, setDraft] = useState(EMPTY_FILTERS);

  // Applied state — sent to the API when user clicks Apply
  const [applied, setApplied] = useState(EMPTY_FILTERS);

  // Build the SWR cache key from applied filters so it refetches on Apply
  const swrKey = ['contracts', applied.search, applied.status, applied.dateFrom, applied.dateTo];

  const buildParams = (f) => {
    const params = {};
    if (f.search) params.search = f.search;
    if (f.status && f.status !== 'all') params.status = f.status;
    if (f.dateFrom) params.date_from = f.dateFrom;
    if (f.dateTo) params.date_to = f.dateTo;
    return params;
  };

  const { data: contractsData, error, isLoading, mutate } = useSWR(
    swrKey,
    () => getContracts(buildParams(applied)),
    { revalidateOnFocus: false }
  );

  const contracts = contractsData || [];

  const hasAppliedFilters =
    applied.search || applied.status !== 'all' || applied.dateFrom || applied.dateTo;

  const handleApply = () => {
    setApplied({ ...draft });
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  const handleContractAdded = (newContract) => {
    mutate((current) => [newContract, ...(current || [])], { revalidate: false });
  };

  const handleContractDeleted = (id) => {
    mutate((current) => (current || []).filter(c => c.id !== id), { revalidate: false });
  };

  const handleContractUpdated = (updatedContract) => {
    mutate(
      (current) => (current || []).map(c => c.id === updatedContract.id ? updatedContract : c),
      { revalidate: false }
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('contracts.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('contracts.subtitle')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('contracts.addNewContract')}
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-3 mb-4 flex flex-col gap-3">
        {/* Row 1: Search + Status */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              value={draft.search}
              onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder={t('contracts.searchPlaceholder')}
              className="pl-9 h-9 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
            <Select value={draft.status} onValueChange={(v) => setDraft((d) => ({ ...d, status: v }))}>
              <SelectTrigger className="w-44 h-9 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-1 focus:ring-primary text-sm">
                <SelectValue placeholder={t('contracts.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('contracts.filterAll')}</SelectItem>
                <SelectItem value="active">{t('contracts.statusActive')}</SelectItem>
                <SelectItem value="completed">{t('contracts.statusCompleted')}</SelectItem>
                <SelectItem value="draft">{t('contracts.statusDraft')}</SelectItem>
                <SelectItem value="cancelled">{t('contracts.statusCancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Date range + Apply + Clear */}
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2 flex-1">
            <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />

            {/* Date From picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 flex-1 min-w-0 justify-start text-left font-normal text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {draft.dateFrom
                    ? format(new Date(draft.dateFrom), 'dd MMM yyyy')
                    : <span className="text-gray-400">{t('contracts.filterDateFrom')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={draft.dateFrom ? new Date(draft.dateFrom) : undefined}
                  onSelect={(date) =>
                    setDraft((d) => ({ ...d, dateFrom: date ? format(date, 'yyyy-MM-dd') : '' }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-gray-400 text-sm shrink-0">–</span>

            {/* Date To picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 flex-1 min-w-0 justify-start text-left font-normal text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {draft.dateTo
                    ? format(new Date(draft.dateTo), 'dd MMM yyyy')
                    : <span className="text-gray-400">{t('contracts.filterDateTo')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={draft.dateTo ? new Date(draft.dateTo) : undefined}
                  onSelect={(date) =>
                    setDraft((d) => ({ ...d, dateTo: date ? format(date, 'yyyy-MM-dd') : '' }))
                  }
                  disabled={(date) => draft.dateFrom ? date < new Date(draft.dateFrom) : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isLoading}
              className="h-9 px-4 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              {t('contracts.applyFilter')}
            </Button>
            {hasAppliedFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-9 px-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                {t('contracts.clearFilters')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ContractsTable
        contracts={contracts}
        isLoading={isLoading}
        error={error}
        onDelete={handleContractDeleted}
        onUpdate={handleContractUpdated}
      />

      <AddContractModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleContractAdded}
      />
    </div>
  );
}
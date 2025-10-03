'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, MoreHorizontal, FileText, Calendar, CheckSquare, Gavel, FileSearch, User, Scale, Printer } from 'lucide-react';
import { getCases } from '@/app/services/api/cases';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import AddSessionModal from '@/app/cases/modals/AddSessionModal';
import AddTaskModal from '@/app/cases/modals/AddTaskModal';
import AddCaseDegreeModal from '@/app/cases/modals/AddCaseDegreeModal';
import AddExecutionModal from '@/app/cases/[id]/edit/executions/AddExecutionModal';
import CasesSearchForm from '@/app/cases/modals/CasesSearchForm';
import ExportButtons from '@/app/cases/ExportButtons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CasesPage = () => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const router = useRouter();
  
  // Modal state
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddCaseDegreeModalOpen, setIsAddCaseDegreeModalOpen] = useState(false);
  const [isAddExecutionModalOpen, setIsAddExecutionModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  
  // Fetch cases data using SWR
  const { data: casesData, error, isLoading, mutate } = useSWR('/cases', getCases, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: true
  });

  // Process cases data
  const cases = useMemo(() => {
    if (!casesData?.success || !casesData?.data) return [];
    return casesData.data;
  }, [casesData, language]);

  // Helper function to get localized text
  const getLocalizedText = (arText, enText) => {
    if (language === 'ar') {
      return arText || enText || ''; // Fallback to English if Arabic is not available
    } else {
      return enText || arText || ''; // Fallback to Arabic if English is not available
    }
  };

  // Helper function to mask sensitive data
  const maskSensitiveData = (data, isSecret) => {
    return isSecret ? '***' : data;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US');
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    let variant, text, color;
    
    switch (statusLower) {
      case 'active':
        variant = 'default';
        text = language === 'ar' ? 'نشطة' : 'Active';
        color = 'bg-green-100 text-green-800 hover:bg-green-100';
        break;
      case 'pending':
        variant = 'secondary';
        text = language === 'ar' ? 'قيد الانتظار' : 'Pending';
        color = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        break;
      case 'inactive':
        variant = 'outline';
        text = language === 'ar' ? 'غير نشطة' : 'Inactive';
        color = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        break;
      default:
        variant = 'outline';
        text = status;
        color = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    
    return (
      <Badge variant={variant} className={color}>
        {text}
      </Badge>
    );
  };

  // Action handlers
  const handleView = (caseId) => {
    console.log('View case:', caseId);
    // TODO: Implement view functionality
  };

  const handleEdit = (caseId) => {
    router.push(`/cases/${caseId}/edit`);
  };

  const handleDelete = (caseId) => {
    console.log('Delete case:', caseId);
    // TODO: Implement delete functionality
  };

  const handleAddNote = (caseId) => {
    console.log('Add note to case:', caseId);
    // TODO: Implement add note functionality
  };

  const handleAddSession = (caseId) => {
    setSelectedCaseId(caseId);
    setIsAddSessionModalOpen(true);
  };

  const handleSessionAdded = (newSession) => {
    // Refresh the cases data to show any updates
    mutate();
  };

  const handleAddTask = (caseId) => {
    setSelectedCaseId(caseId);
    setIsAddTaskModalOpen(true);
  };

  const handleTaskAdded = (newTask) => {
    // Refresh the cases data to show any updates
    mutate();
  };

  const handleAddExecution = (caseId) => {
    setSelectedCaseId(caseId);
    setIsAddExecutionModalOpen(true);
  };

  const handleAddPetition = (caseId) => {
    console.log('Add petition to case:', caseId);
    // TODO: Implement add petition functionality
  };

  const handleAddCourtLevel = (caseId) => {
    setSelectedCaseId(caseId);
    setIsAddCaseDegreeModalOpen(true);
  };

  const handleCaseDegreeAdded = (newCaseDegree) => {
    // Refresh the cases data to show any updates
    mutate();
  };

  const handlePrint = (caseId) => {
    router.push(`/cases/${caseId}`);
  };

  if (error) {
    return (
      <div className="container mx-auto p-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">{t('common.error')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('common.errorLoading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-2 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className={`flex flex-col space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold tracking-tight">{t('navigation.cases')}</h1>
        <p className="text-muted-foreground">
          {t('casesTable.title')}
        </p>
      </div>

      {/* Search Form */}
      <CasesSearchForm onSearch={(searchParams) => {
        // TODO: Handle search functionality later
        console.log('Search params from cases page:', searchParams);
      }} />

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('navigation.cases')}</CardTitle>
          <CardDescription>
            {t('casesTable.totalCases')}: {cases.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Export Buttons Section */}
          <div className="mb-4 pb-4 border-b">
            <ExportButtons data={cases} t={t} language={language} />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className={`${isRTL ? 'mr-2' : 'ml-2'}`}>{t('common.loading')}</span>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('common.noData')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className='text-center'>
                  <TableRow>
                    <TableHead className='text-center'>
                      {t('caseForm.caseNumber')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.fileNumber')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.topic')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.court')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.caseType')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.classification')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('caseForm.startDate')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.clientParties')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.opponentParties')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.status')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.flags')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.sessionCount')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.lastSessionDate')}
                    </TableHead>
                    <TableHead className='text-center'>
                      {t('casesTable.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell className="font-medium">
                        {case_.case_number}
                      </TableCell>
                      <TableCell>
                        {maskSensitiveData(case_.file_number, case_.is_secret)}
                      </TableCell>
                      <TableCell>
                        {maskSensitiveData(case_.topic, case_.is_secret)}
                      </TableCell>
                      <TableCell>
                        {maskSensitiveData(
                          getLocalizedText(case_.court_ar, case_.court_en),
                          case_.is_secret
                        )}
                      </TableCell>
                      <TableCell>
                        {maskSensitiveData(
                          getLocalizedText(case_.case_type_ar, case_.case_type_en),
                          case_.is_secret
                        )}
                      </TableCell>
                      <TableCell>
                        {maskSensitiveData(
                          getLocalizedText(case_.case_classification_ar, case_.case_classification_en),
                          case_.is_secret
                        )}
                      </TableCell>
                      <TableCell>
                        {maskSensitiveData(formatDate(case_.start_date), case_.is_secret)}
                      </TableCell>
                      <TableCell>
                        {case_.is_secret ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>***</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {case_.clientParties?.map((party, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{party}</span>
                              </div>
                            )) || (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="text-sm">-</span>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {case_.is_secret ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>***</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {case_.opponentParties?.map((party, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <User className="h-4 w-4 text-red-600" />
                                <span className="text-sm">{party}</span>
                              </div>
                            )) || (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="text-sm">-</span>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(case_.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {case_.is_important === 1 && (
                            <Badge variant="destructive" className="text-xs">
                              {t('caseToggles.isImportant')}
                            </Badge>
                          )}
                          {case_.is_secret === 1 && (
                            <Badge variant="outline" className="text-xs">
                              {t('caseToggles.isSecret')}
                            </Badge>
                          )}
                          {case_.is_archived === 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {t('caseToggles.isArchived')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {case_.session_count || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {case_.last_session_date ? formatDate(case_.last_session_date) : '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu dir={isRTL ? 'rtl' : 'ltr'}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                            {/* <DropdownMenuItem onClick={() => handleView(case_.id)}>
                              <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.view')}
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => handleEdit(case_.id)}>
                              <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(case_.id)}>
                              <Printer className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {language === 'ar' ? 'طباعة الملف' : 'Print Case'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem onClick={() => handleAddNote(case_.id)}>
                              <FileText className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.addNote')}
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => handleAddSession(case_.id)}>
                              <Calendar className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.addSession')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddTask(case_.id)}>
                              <CheckSquare className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.addTask')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddExecution(case_.id)}>
                              <Gavel className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.addExecution')}
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem onClick={() => handleAddPetition(case_.id)}>
                              <FileSearch className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.addPetition')}
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => handleAddCourtLevel(case_.id)}>
                              <Scale className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {language === 'ar' ? 'اضافة درجة تقاضي' : 'Add Court Level'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(case_.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t('casesTable.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Session Modal */}
      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
        caseId={selectedCaseId}
        onSessionAdded={handleSessionAdded}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        caseId={selectedCaseId}
        onTaskAdded={handleTaskAdded}
      />

      {/* Add Case Degree Modal */}
      <AddCaseDegreeModal
        isOpen={isAddCaseDegreeModalOpen}
        onClose={() => setIsAddCaseDegreeModalOpen(false)}
        caseId={selectedCaseId}
        onCaseDegreeAdded={handleCaseDegreeAdded}
      />

      {/* Add Execution Modal */}
      <AddExecutionModal
        isOpen={isAddExecutionModalOpen}
        onClose={() => setIsAddExecutionModalOpen(false)}
        caseId={selectedCaseId}
      />
    </div>
  );
};

export default CasesPage;
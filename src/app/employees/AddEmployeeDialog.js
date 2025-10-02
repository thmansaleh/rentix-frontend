import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Shield, Plus, CircleX, CalendarIcon, Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useSWR from 'swr';
import { getPermissions } from '@/app/services/api/permissions';
import { getRoles } from '@/app/services/api/roles';
import { getDepartments } from '@/app/services/api/departments';
import { getEmployees, createEmployee } from '@/app/services/api/employees';
import { getBranches } from '@/app/services/api/branches';
import { toast } from 'react-toastify';

// Custom Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 bg-white dark:bg-black  rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
};

// DatePickerField Component
const DatePickerField = ({ name, placeholder, value, onChange, isRTL }) => {
  const [open, setOpen] = useState(false);
  
  const handleDateSelect = (date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange({
        target: {
          name: name,
          value: formattedDate
        }
      });
    } else {
      onChange({
        target: {
          name: name,
          value: ""
        }
      });
    }
    setOpen(false);
  };

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            isRTL && "flex-row-reverse"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CalendarIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {value ? format(selectedDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          dir={isRTL ? "rtl" : "ltr"}
        />
      </PopoverContent>
    </Popover>
  );
};

export default function AddEmployeeModal({ onAdd }) {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  
  // Fetch permissions directly using SWR
  const { data: permissionsData, error: permissionsError, isLoading: permissionsLoading } = useSWR('/permissions', getPermissions);
  const permissions = permissionsData?.success ? permissionsData.data : [];

  // Fetch roles directly using SWR
  const { data: rolesData, error: rolesError, isLoading: rolesLoading } = useSWR('/roles', getRoles);
  const roles = rolesData?.success ? rolesData.data : [];

  // Fetch departments directly using SWR
  const { data: departmentsData, error: departmentsError, isLoading: departmentsLoading } = useSWR('/departments', getDepartments);
  const departments = departmentsData ? departmentsData.data : [];

  // Fetch employees for manager dropdown
  const { data: employeesData, error: employeesError, isLoading: employeesLoading } = useSWR('/employees', getEmployees);
  const employees = employeesData ? employeesData.data : [];

  // Fetch branches directly using SWR
  const { data: branchesData, error: branchesError, isLoading: branchesLoading } = useSWR('/branches', getBranches);
  const branches = branchesData?.success ? branchesData.data : [];

  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    roleId: "",
    departmentId: "",
    branchId: "",
    status: 'active',
    permissions: [],
    identityNumber: "",
    passportNumber: "",
    employeeNumber: "",
    basicSalary: "",
    directManagerId: "",
    phoneNumber: "",
    identityExpiryDate: "",
    passportExpiryDate: "",
    residenceExpiryDate: "",
    insuranceExpiryDate: "",
    contractExpiryDate: "",
    workPermitExpiryDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePermission = (permissionId) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { field: 'name', message: t('validation.nameRequired') || 'Name is required' },
      { field: 'username', message: t('validation.usernameRequired') || 'Username is required' },
      { field: 'email', message: t('validation.emailRequired') || 'Email is required' },
      { field: 'password', message: t('validation.passwordRequired') || 'Password is required' },
      { field: 'roleId', message: t('validation.roleRequired') || 'Role is required' },
      { field: 'departmentId', message: t('validation.departmentRequired') || 'Department is required' },
      { field: 'branchId', message: t('validation.branchRequired') || 'Branch is required' },
      { field: 'phoneNumber', message: t('validation.phoneRequired') || 'Phone number is required' }
    ];

    for (const { field, message } of requiredFields) {
      if (!form[field] || form[field].toString().trim() === '') {
        toast.error(message);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error(t('validation.emailInvalid') || 'Please enter a valid email address');
      return false;
    }

    // Password validation (minimum 3 characters)
    if (form.password.length < 3) {
      toast.error(t('validation.passwordMinLength') || 'Password must be at least 3 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSaving) return; // Prevent multiple submissions
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await createEmployee(form);
      
      if (response.success) {
        console.log('Employee created successfully:', response);
        
        toast.success(t('messages.employeeCreatedSuccessfully') || 'Employee created successfully!');
        
        if (onAdd) onAdd(response);
        
        // Close modal and reset form on success
        setIsOpen(false);
        setForm({
          name: "",
          username: "",
          email: "",
          password: "",
          roleId: "",
          departmentId: "",
          branchId: "",
          status: 'active',
          permissions: [],
          identityNumber: "",
          passportNumber: "",
          employeeNumber: "",
          basicSalary: "",
          directManagerId: "",
          phoneNumber: "",
          identityExpiryDate: "",
          passportExpiryDate: "",
          residenceExpiryDate: "",
          insuranceExpiryDate: "",
          contractExpiryDate: "",
          workPermitExpiryDate: ""
        });
        setTab("info");
      } else {
        console.error('Failed to create employee:', response);
        toast.error(t('messages.errorCreatingEmployee') || 'Error creating employee. Please try again.');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(t('messages.errorCreatingEmployee') || 'Error creating employee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-4 h-4" />
        {t('employees.addNew')}
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b " >
          <h2 className="text-xl font-semibold">{t('employees.addNewTitle')}</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CircleX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6" >
          <Tabs dir={isRTL ? "rtl" : "ltr"} value={tab} onValueChange={setTab} >
            <TabsList className="mb-4 flex gap-2" >
              <TabsTrigger value="info" className="cursor-pointer">{t('employees.information')}</TabsTrigger>
              <TabsTrigger value="permissions" className="cursor-pointer">{t('employees.permissions')}</TabsTrigger>
              <TabsTrigger value="documents" className="cursor-pointer">{t('employees.documents') || 'الوثائق'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <Input 
                  name="name" 
                  placeholder={t('employees.name')} 
                  value={form.name} 
                  onChange={handleChange} 
                />
                <Input 
                  name="username" 
                  placeholder={t('employees.username')} 
                  value={form.username} 
                  onChange={handleChange} 
                />
                <Input 
                  name="email" 
                  placeholder={t('employees.email')} 
                  value={form.email} 
                  onChange={handleChange} 
                />
                <Input 
                  name="password" 
                  placeholder={t('employees.password')} 
                  type="password"
                  value={form.password} 
                  onChange={handleChange} 
                />
                {/* Role Selector */}
                <Select dir={isRTL ? "rtl" : "ltr"} value={form.roleId} onValueChange={value => setForm(f => ({ ...f, roleId: value }))}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder={t('employees.selectRole')} />
                  </SelectTrigger>
                  <SelectContent >
                    {rolesLoading ? (
                      <div className="p-2 text-center text-gray-500">{t('common.loading')}...</div>
                    ) : rolesError ? (
                      <div className="p-2 text-center text-red-500">{t('common.error')}</div>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id} className="cursor-pointer">
                          {language === 'ar' ? role.role_ar : role.role_en}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {/* Department Selector */}
                <Select dir={isRTL ? "rtl" : "ltr"} value={form.departmentId} onValueChange={value => setForm(f => ({ ...f, departmentId: value }))}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder={t('employees.selectDepartment')} />
                  </SelectTrigger>
                  <SelectContent >
                    {departmentsLoading ? (
                      <div className="p-2 text-center text-gray-500">{t('common.loading')}...</div>
                    ) : departmentsError ? (
                      <div className="p-2 text-center text-red-500">{t('common.error')}</div>
                    ) : (
                      departments.map((department) => (
                        <SelectItem key={department.id} value={department.id} className="cursor-pointer">
                          {language === 'ar' ? department.name_ar : department.name_en}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {/* Branch Selector */}
                <Select dir={isRTL ? "rtl" : "ltr"} value={form.branchId} onValueChange={value => setForm(f => ({ ...f, branchId: value }))}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder={t('employees.selectBranch')} />
                  </SelectTrigger>
                  <SelectContent >
                    {branchesLoading ? (
                      <div className="p-2 text-center text-gray-500">{t('common.loading')}...</div>
                    ) : branchesError ? (
                      <div className="p-2 text-center text-red-500">{t('common.error')}</div>
                    ) : (
                      branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id} className="cursor-pointer">
                          {language === 'ar' ? branch.name_ar : branch.name_en}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {/* Identity Number */}
                <Input 
                  name="identityNumber" 
                  placeholder={t('employees.identityNumber')} 
                  value={form.identityNumber} 
                  onChange={handleChange} 
                />
                
                {/* Passport Number */}
                <Input 
                  name="passportNumber" 
                  placeholder={t('employees.passportNumber')} 
                  value={form.passportNumber} 
                  onChange={handleChange} 
                />
                
                {/* Employee Number */}
                <Input 
                  name="employeeNumber" 
                  placeholder={t('employees.employeeNumber')} 
                  value={form.employeeNumber} 
                  onChange={handleChange} 
                />
                
                {/* Basic Salary */}
                <Input 
                  name="basicSalary" 
                  placeholder={t('employees.basicSalary')} 
                  type="number"
                  value={form.basicSalary} 
                  onChange={handleChange} 
                />
                
                {/* Phone Number */}
                <Input 
                  name="phoneNumber" 
                  placeholder={t('employees.phoneNumber')} 
                  type="tel"
                  value={form.phoneNumber} 
                  onChange={handleChange} 
                />
                
                {/* Direct Manager Selector */}
                <Select dir={isRTL ? "rtl" : "ltr"} value={form.directManagerId} onValueChange={value => setForm(f => ({ ...f, directManagerId: value }))}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder={t('employees.selectDirectManager')} />
                  </SelectTrigger>
                  <SelectContent >
                    {employeesLoading ? (
                      <div className="p-2 text-center text-gray-500">{t('common.loading')}...</div>
                    ) : employeesError ? (
                      <div className="p-2 text-center text-red-500">{t('common.error')}</div>
                    ) : (
                      employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id} className="cursor-pointer">
                          {employee.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {/* Identity Expiry Date */}
                <DatePickerField
                  name="identityExpiryDate"
                  placeholder={t('employees.identityExpiryDate')}
                  value={form.identityExpiryDate}
                  onChange={handleChange}
                  isRTL={isRTL}
                />
                
                {/* Passport Expiry Date */}
                <DatePickerField
                  name="passportExpiryDate"
                  placeholder={t('employees.passportExpiryDate')}
                  value={form.passportExpiryDate}
                  onChange={handleChange}
                  isRTL={isRTL}
                />
                
                {/* Residence Expiry Date */}
                <DatePickerField
                  name="residenceExpiryDate"
                  placeholder={t('employees.residenceExpiryDate')}
                  value={form.residenceExpiryDate}
                  onChange={handleChange}
                  isRTL={isRTL}
                />
                
                {/* Insurance Expiry Date */}
                <DatePickerField
                  name="insuranceExpiryDate"
                  placeholder={t('employees.insuranceExpiryDate')}
                  value={form.insuranceExpiryDate}
                  onChange={handleChange}
                  isRTL={isRTL}
                />
                
                {/* Contract Expiry Date */}
                <DatePickerField
                  name="contractExpiryDate"
                  placeholder={t('employees.contractExpiryDate')}
                  value={form.contractExpiryDate}
                  onChange={handleChange}
                  isRTL={isRTL}
                />
                
                {/* Work Permit Expiry Date */}
                <DatePickerField
                  name="workPermitExpiryDate"
                  placeholder={t('employees.workPermitExpiryDate')}
                  value={form.workPermitExpiryDate}
                  onChange={handleChange}
                  isRTL={isRTL}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              {permissionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="text-gray-500">{t('common.loading')}...</div>
                </div>
              ) : permissionsError ? (
                <div className="flex justify-center py-8">
                  <div className="text-red-500">{t('common.error')}: {permissionsError}</div>
                </div>
              ) : (
                <>
                  {/* Select All Checkbox */}
                  <div className="mb-4 p-3  rounded-lg border">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <Checkbox
                        checked={form.permissions.length === permissions.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setForm(prev => ({ ...prev, permissions: permissions.map(p => p.id) }));
                          } else {
                            setForm(prev => ({ ...prev, permissions: [] }));
                          }
                        }}
                        id="select-all"
                      />
                      <span className="">{t('employees.selectAll')} ({form.permissions.length}/{permissions.length})</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={form.permissions.includes(permission.id)}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          id={`permission-${permission.id}`}
                        />
                        <span className="text-sm">
                          {language === 'ar' ? permission.permission_ar : permission.permission_en}
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-6">
                {/* Upload Documents Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t('employees.uploadDocument') || 'رفع وثيقة جديدة'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder={t('employees.documentName') || 'اسم الوثيقة'} 
                    />
                    <div className="flex gap-2">
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="flex-1"
                      />
                      <Button size="sm">
                        {t('buttons.upload') || 'رفع'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                  <h3 className="font-medium">{t('employees.existingDocuments') || 'الوثائق الموجودة'}</h3>
                  
                  {employeesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">{t('common.loading')}...</div>
                    </div>
                  ) : employeesError ? (
                    <div className="flex justify-center py-8">
                      <div className="text-red-500">{t('common.error')}: {employeesError}</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Sample documents - replace with actual employee documents when editing existing employee */}
                      <div className="text-sm text-gray-500 p-3 border rounded-lg bg-gray-50">
                        {t('employees.documentsNote') || 'سيتم عرض الوثائق بعد حفظ الموظف'}
                      </div>
                      
                      {/* Template for when documents exist */}
                      {false && (
                        <div className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-sm">Contract.pdf</p>
                                <p className="text-xs text-gray-500">
                                  {t('employees.uploadedBy')}: admin • 01/01/2025
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <CircleX className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t" >
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="px-6"
          >
            {t('buttons.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? (t('buttons.saving') || 'Saving...') : t('buttons.save')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
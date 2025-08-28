import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield, Plus, X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";

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

export default function AddAdminModal({ onAdd }) {
  const { isRTL } = useLanguage();
  const t = useTranslations();

  // Create permissions list from translations
  const permissionsList = [
    t('admins.permissionsList.addCar'),
    t('admins.permissionsList.editCar'),
    t('admins.permissionsList.deleteCar'),
    t('admins.permissionsList.manageUsers'),
    t('admins.permissionsList.viewStats'),
    t('admins.permissionsList.changeSettings'),
    t('admins.permissionsList.addClient'),
    t('admins.permissionsList.editClient'),
    t('admins.permissionsList.deleteClient'),
    t('admins.permissionsList.addBooking'),
    t('admins.permissionsList.editBooking'),
    t('admins.permissionsList.deleteBooking'),
    t('admins.permissionsList.addContract'),
    t('admins.permissionsList.editContract'),
    t('admins.permissionsList.deleteContract'),
    t('admins.permissionsList.addFine'),
    t('admins.permissionsList.editFine'),
    t('admins.permissionsList.deleteFine'),
    t('admins.permissionsList.manageBills'),
    t('admins.permissionsList.managePayments'),
    t('admins.permissionsList.manageFleet'),
    t('admins.permissionsList.manageMaintenance'),
    t('admins.permissionsList.manageInsurance'),
    t('admins.permissionsList.manageNotifications'),
    t('admins.permissionsList.managePermissions'),
    t('admins.permissionsList.exportData'),
    t('admins.permissionsList.importData'),
    t('admins.permissionsList.viewLogs'),
    t('admins.permissionsList.changePassword'),
    t('admins.permissionsList.changeLanguage')
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    department: "",
    status: t('admins.active'),
    permissions: []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSubmit = () => {
    if (onAdd) onAdd(form);
    setIsOpen(false);
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "",
      department: "",
      status: t('admins.active'),
      permissions: []
    });
    setTab("info");
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
        {t('admins.addNew')}
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b " >
          <h2 className="text-xl font-semibold">{t('admins.addNewTitle')}</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6" >
          <Tabs dir={isRTL ? "rtl" : "ltr"} value={tab} onValueChange={setTab} >
            <TabsList className="mb-4 flex gap-2" >
              <TabsTrigger value="info" className="cursor-pointer">{t('admins.information')}</TabsTrigger>
              <TabsTrigger value="permissions" className="cursor-pointer">{t('admins.permissions')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <Input 
                  name="name" 
                  placeholder={t('admins.name')} 
                  value={form.name} 
                  onChange={handleChange} 
                />
                <Input 
                  name="username" 
                  placeholder={t('admins.username')} 
                  value={form.username} 
                  onChange={handleChange} 
                />
                <Input 
                  name="email" 
                  placeholder={t('admins.email')} 
                  value={form.email} 
                  onChange={handleChange} 
                />
                <Input 
                  name="password" 
                  placeholder={t('admins.password')} 
                  type="password"
                  value={form.password} 
                  onChange={handleChange} 
                />
                {/* Role Selector */}
                <Select dir={isRTL ? "rtl" : "ltr"} value={form.role} onValueChange={value => setForm(f => ({ ...f, role: value }))}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder={t('admins.selectRole')} />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value={t('admins.manager')} className="cursor-pointer">{t('admins.manager')}</SelectItem>
                    <SelectItem value={t('admins.supervisor')} className="cursor-pointer">{t('admins.supervisor')}</SelectItem>
                    <SelectItem value={t('admins.employee')} className="cursor-pointer">{t('admins.employee')}</SelectItem>
                  </SelectContent>
                </Select>
                {/* Department Selector */}
                <Select dir={isRTL ? "rtl" : "ltr"} value={form.department} onValueChange={value => setForm(f => ({ ...f, department: value }))}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder={t('admins.selectDepartment')} />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value={t('admins.sales')} className="cursor-pointer">{t('admins.sales')}</SelectItem>
                    <SelectItem value={t('admins.support')} className="cursor-pointer">{t('admins.support')}</SelectItem>
                    <SelectItem value={t('admins.maintenance')} className="cursor-pointer">{t('admins.maintenance')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              {/* Select All Checkbox */}
              <div className="mb-4 p-3  rounded-lg border">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <Checkbox
                    checked={form.permissions.length === permissionsList.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setForm(prev => ({ ...prev, permissions: [...permissionsList] }));
                      } else {
                        setForm(prev => ({ ...prev, permissions: [] }));
                      }
                    }}
                    id="select-all"
                  />
                  <span className="">{t('admins.selectAll')} ({form.permissions.length}/{permissionsList.length})</span>
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2">
                {permissionsList.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.permissions.includes(perm)}
                      onCheckedChange={() => handleTogglePermission(perm)}
                      id={perm}
                    />
                    <span className="text-sm">{perm}</span>
                  </label>
                ))}
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
            className="px-6"
          >
            {t('buttons.save')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
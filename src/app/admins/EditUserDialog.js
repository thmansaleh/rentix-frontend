import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/useTranslations";

export default function EditUserDialog({ admin, trigger }) {
  const t = useTranslations();
  
  const [form, setForm] = useState({
    name: admin.name,
    username: admin.username || "",
    email: admin.email,
    password: "",
    role: admin.role,
    department: admin.department,
    status: admin.status,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle update logic here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center my-4'>{t('admins.editUser')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div>
            <Label className="block mb-1" htmlFor="name">{t('admins.name')}</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label className="block mb-1" htmlFor="username">{t('admins.username')}</Label>
            <Input id="username" name="username" value={form.username} onChange={handleChange} />
          </div>
          <div>
            <Label className="block mb-1" htmlFor="email">{t('admins.email')}</Label>
            <Input id="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label className="block mb-1" htmlFor="password">{t('admins.password')}</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder={t('admins.passwordPlaceholder')} />
          </div>
          <div>
            <Label className="block mb-1" htmlFor="role">{t('admins.role')}</Label>
            <Select dir="rtl" value={form.role} onValueChange={value => setForm({ ...form, role: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('admins.selectRole')} />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="admin">{t('admins.admin')}</SelectItem>
                <SelectItem value="user">{t('admins.user')}</SelectItem>
                <SelectItem value="manager">{t('admins.manager')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block mb-1" htmlFor="department">{t('admins.department')}</Label>
            <Select dir="rtl" value={form.department} onValueChange={value => setForm({ ...form, department: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('admins.selectDepartment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">{t('admins.sales')}</SelectItem>
                <SelectItem value="support">{t('admins.support')}</SelectItem>
                <SelectItem value="it">{t('admins.it')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block mb-1" htmlFor="status">{t('admins.status')}</Label>
            <Select dir="rtl" value={form.status} onValueChange={value => setForm({ ...form, status: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('admins.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('admins.active')}</SelectItem>
                <SelectItem value="inactive">{t('admins.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className='grid col-span-2'>
            <Button className='w-full' type="submit">{t('admins.saveChanges')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

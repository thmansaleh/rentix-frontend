"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Save, Loader2 } from "lucide-react";
import { createParty } from "@/app/services/api/parties";
import { toast } from "react-toastify";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";

const AddPartyModal = ({ onPartyAdded, children, initialPartyType = "" }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    e_id: "",
    category: "",
    email: "",
    party_type: initialPartyType,
    username: "",
    password: "",
    status: "active",
    nationality: "",
    branch_id: 1
  });

  // Update form when initialPartyType changes
  useEffect(() => {
    if (initialPartyType) {
      setFormData(prev => ({
        ...prev,
        party_type: initialPartyType
      }));
    }
  }, [initialPartyType]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      e_id: "",
      category: "",
      email: "",
      party_type: initialPartyType,
      username: "",
      password: "",
      status: "active",
      nationality: "",
      branch_id: 1
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.name || !formData.phone || !formData.party_type) {
        toast.error(t('parties.fillRequiredFields') || "يرجى ملء الحقول المطلوبة");
        return;
      }

      const response = await createParty(formData);
      
      if (response.success) {
        toast.success(t('parties.partyAddedSuccess') || "تم إضافة الطرف بنجاح");
        resetForm();
        setOpen(false);
        if (onPartyAdded) {
          // Pass the new party data with the returned ID
          onPartyAdded({
            ...formData,
            id: response.id
          });
        }
      } else {
        toast.error(t('parties.partyAddError') || "حدث خطأ أثناء إضافة الطرف");
      }
    } catch (error) {
      console.error("Error creating party:", error);
      toast.error(t('parties.partyAddError') || "حدث خطأ أثناء إضافة الطرف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 ml-2" />
            {t('parties.addNewParty') || 'إضافة طرف جديد'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('parties.addNewParty') || 'إضافة طرف جديد'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('parties.name') || 'الاسم'} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={t('parties.enterName') || 'أدخل اسم الطرف'}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t('parties.phone') || 'رقم الهاتف'} *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={t('parties.phoneExample') || 'مثال: +971501234567'}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('parties.email') || 'البريد الإلكتروني'}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          {/* Party Type */}
          <div className="space-y-2">
            <Label>{t('parties.partyType') || 'نوع الطرف'} *</Label>
            <Select 
            dir={isRTL ? "rtl" : "ltr"}
              value={formData.party_type} 
              onValueChange={(value) => handleInputChange("party_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('parties.choosePartyType') || 'اختر نوع الطرف'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">{t('parties.client') || 'عميل'}</SelectItem>
                <SelectItem value="opponent">{t('parties.opponent') || 'خصم'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{t('parties.category') || 'الفئة'}</Label>
            <Select 
              dir={isRTL ? "rtl" : "ltr"}
              value={formData.category} 
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('parties.chooseCategory') || 'اختر الفئة'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">{t('parties.individual') || 'فرد'}</SelectItem>
                <SelectItem value="company">{t('parties.company') || 'شركة'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emirates ID */}
          <div className="space-y-2">
            <Label htmlFor="e_id">{t('parties.emiratesId') || 'رقم الهوية الإماراتية'}</Label>
            <Input
              id="e_id"
              value={formData.e_id}
              onChange={(e) => handleInputChange("e_id", e.target.value)}
              placeholder="784-1234-1234567-1"
            />
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality">{t('parties.nationality') || 'الجنسية'}</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder={t('parties.nationalityExample') || 'الإمارات العربية المتحدة'}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">{t('parties.username') || 'اسم المستخدم'}</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder={t('parties.username') || 'اسم المستخدم'}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t('parties.password') || 'كلمة المرور'}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={t('parties.password') || 'كلمة المرور'}
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">{t('parties.address') || 'العنوان'}</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder={t('parties.enterAddress') || 'أدخل العنوان التفصيلي'}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 space-x-reverse mt-6">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {t('parties.cancel') || 'إلغاء'}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                {t('parties.saving') || 'جاري الحفظ...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                {t('parties.save') || 'حفظ'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartyModal;
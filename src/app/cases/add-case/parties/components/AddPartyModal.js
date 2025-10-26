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

const AddPartyModal = ({ onPartyAdded, children, initialPartyType = "" }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
const { isRTL } = useLanguage();
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
        toast.error("يرجى ملء الحقول المطلوبة");
        return;
      }

      const response = await createParty(formData);
      
      if (response.success) {
        toast.success("تم إضافة الطرف بنجاح");
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
        toast.error("حدث خطأ أثناء إضافة الطرف");
      }
    } catch (error) {

      toast.error("حدث خطأ أثناء إضافة الطرف");
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
            إضافة طرف جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة طرف جديد</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="أدخل اسم الطرف"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="مثال: +971501234567"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
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
            <Label>نوع الطرف *</Label>
            <Select 
            dir={isRTL ? "rtl" : "ltr"}
              value={formData.party_type} 
              onValueChange={(value) => handleInputChange("party_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الطرف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">عميل</SelectItem>
                <SelectItem value="opponent">خصم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>الفئة</Label>
            <Select 
              dir={isRTL ? "rtl" : "ltr"}
              value={formData.category} 
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">فرد</SelectItem>
                <SelectItem value="company">شركة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Emirates ID */}
          <div className="space-y-2">
            <Label htmlFor="e_id">رقم الهوية الإماراتية</Label>
            <Input
              id="e_id"
              value={formData.e_id}
              onChange={(e) => handleInputChange("e_id", e.target.value)}
              placeholder="784-1234-1234567-1"
            />
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality">الجنسية</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder="الإمارات العربية المتحدة"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="اسم المستخدم"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="كلمة المرور"
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="أدخل العنوان التفصيلي"
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
            إلغاء
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                حفظ
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartyModal;
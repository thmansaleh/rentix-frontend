"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { getTenantById, updateTenant } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

export function EditTenantModal({ isOpen, onClose, tenantId, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ company_name: "", email: "", phone: "", status: "active" });

  const { data: tenantRes, isLoading } = useSWR(
    isOpen && tenantId ? ["tenant-edit", tenantId] : null,
    () => getTenantById(tenantId),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (tenantRes?.data) {
      const d = tenantRes.data;
      setForm({
        company_name: d.company_name || "",
        email: d.email || "",
        phone: d.phone || "",
        status: d.status || "active",
      });
    }
  }, [tenantRes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name.trim()) {
      toast.error(t("tenants.companyNameRequired"));
      return;
    }
    setSaving(true);
    try {
      const result = await updateTenant(tenantId, form);
      toast.success(t("tenants.updateSuccess"));
      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error(error.response?.data?.message || t("tenants.updateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("tenants.editTenant")} size="md">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CustomModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="company_name">{t("tenants.companyName")} *</Label>
                <Input
                  id="company_name"
                  value={form.company_name}
                  onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("tenants.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t("tenants.phone")}</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("tenants.status")}</Label>
                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("tenants.statusActive")}</SelectItem>
                    <SelectItem value="trial">{t("tenants.statusTrial")}</SelectItem>
                    <SelectItem value="suspended">{t("tenants.statusSuspended")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CustomModalBody>
          <CustomModalFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              {t("tenants.cancel")}
            </Button>
            <Button type="submit" disabled={saving} className="min-w-[120px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("tenants.saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("tenants.save")}
                </>
              )}
            </Button>
          </CustomModalFooter>
        </form>
      )}
    </CustomModal>
  );
}

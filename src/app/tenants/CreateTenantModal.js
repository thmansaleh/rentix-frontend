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
import { Loader2, Plus, UserCog } from "lucide-react";
import { toast } from "react-toastify";
import { createTenant, getSubscriptionPlans } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

const initialForm = {
  code: "",
  company_name: "",
  company_name_en: "",
  company_name_ar: "",
  email: "",
  phone: "",
  traffic_number: "",
  trn_number: "",
  status: "trial",
  plan_id: "",
  branch_name: "",
  admin_name: "",
  admin_username: "",
  admin_password: "",
  billing_cycle: "monthly",
};

export function CreateTenantModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const { data: plansRes, isLoading: loadingPlans } = useSWR(
    isOpen ? "subscription-plans-create" : null,
    () => getSubscriptionPlans(),
    { revalidateOnFocus: false }
  );

  const plans = plansRes?.data || [];

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error(t("tenants.codeRequired"));
      return;
    }
    if (!form.company_name.trim()) {
      toast.error(t("tenants.companyNameRequired"));
      return;
    }
    if (!form.admin_username.trim()) {
      toast.error(t("tenants.adminUsernameRequired"));
      return;
    }
    if (!form.admin_password.trim()) {
      toast.error(t("tenants.adminPasswordRequired"));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        plan_id: form.plan_id ? Number(form.plan_id) : undefined,
      };
      await createTenant(payload);
      toast.success(t("tenants.createSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating tenant:", error);
      toast.error(error.response?.data?.message || t("tenants.createError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("tenants.createTenant")} size="lg">
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div className="space-y-1.5">
              <Label htmlFor="code">{t("tenants.code")} *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))}
                placeholder="e.g. TENANT001"
                required
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <Label htmlFor="company_name">{t("tenants.companyName")} *</Label>
              <Input
                id="company_name"
                value={form.company_name}
                onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))}
                required
              />
            </div>

            {/* Company Name EN */}
            <div className="space-y-1.5">
              <Label htmlFor="company_name_en">{t("tenants.companyNameEn")}</Label>
              <Input
                id="company_name_en"
                value={form.company_name_en}
                onChange={(e) => setForm(f => ({ ...f, company_name_en: e.target.value }))}
              />
            </div>

            {/* Company Name AR */}
            <div className="space-y-1.5">
              <Label htmlFor="company_name_ar">{t("tenants.companyNameAr")}</Label>
              <Input
                id="company_name_ar"
                value={form.company_name_ar}
                onChange={(e) => setForm(f => ({ ...f, company_name_ar: e.target.value }))}
                dir="rtl"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("tenants.email")}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("tenants.phone")}</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            {/* Traffic Number */}
            <div className="space-y-1.5">
              <Label htmlFor="traffic_number">{t("tenants.trafficNumber")}</Label>
              <Input
                id="traffic_number"
                value={form.traffic_number}
                onChange={(e) => setForm(f => ({ ...f, traffic_number: e.target.value }))}
              />
            </div>

            {/* TRN Number */}
            <div className="space-y-1.5">
              <Label htmlFor="trn_number">{t("tenants.trnNumber")}</Label>
              <Input
                id="trn_number"
                value={form.trn_number}
                onChange={(e) => setForm(f => ({ ...f, trn_number: e.target.value }))}
              />
            </div>

            {/* Status */}
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

            {/* Plan */}
            <div className="space-y-1.5">
              <Label>{t("tenants.selectPlan")}</Label>
              <Select value={form.plan_id} onValueChange={(v) => setForm(f => ({ ...f, plan_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingPlans ? t("tenants.loading") : t("tenants.selectPlan")} />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={String(plan.id)}>
                      {plan.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Billing Cycle - shown when plan selected */}
            {form.plan_id && (
              <div className="space-y-1.5">
                <Label>{t("tenants.billingCycle")}</Label>
                <Select value={form.billing_cycle} onValueChange={(v) => setForm(f => ({ ...f, billing_cycle: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">{t("tenants.monthly")}</SelectItem>
                    <SelectItem value="annual">{t("tenants.annual")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Branch Name */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="branch_name">{t("tenants.branchName")}</Label>
              <Input
                id="branch_name"
                value={form.branch_name}
                onChange={(e) => setForm(f => ({ ...f, branch_name: e.target.value }))}
                placeholder={t("tenants.branchNamePlaceholder")}
              />
            </div>

            {/* Admin Section Divider */}
            <div className="md:col-span-2 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <UserCog className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t("tenants.adminAccount")}</span>
              </div>
            </div>

            {/* Admin Name */}
            <div className="space-y-1.5">
              <Label htmlFor="admin_name">{t("tenants.adminName")}</Label>
              <Input
                id="admin_name"
                value={form.admin_name}
                onChange={(e) => setForm(f => ({ ...f, admin_name: e.target.value }))}
              />
            </div>

            {/* Admin Username */}
            <div className="space-y-1.5">
              <Label htmlFor="admin_username">{t("tenants.adminUsername")} *</Label>
              <Input
                id="admin_username"
                value={form.admin_username}
                onChange={(e) => setForm(f => ({ ...f, admin_username: e.target.value }))}
                required
              />
            </div>

            {/* Admin Password */}
            <div className="space-y-1.5">
              <Label htmlFor="admin_password">{t("tenants.adminPassword")} *</Label>
              <Input
                id="admin_password"
                type="password"
                value={form.admin_password}
                onChange={(e) => setForm(f => ({ ...f, admin_password: e.target.value }))}
                required
              />
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
                <Plus className="mr-2 h-4 w-4" />
                {t("tenants.create")}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}

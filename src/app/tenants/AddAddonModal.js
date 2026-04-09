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
import { Loader2, Save, Package } from "lucide-react";
import { toast } from "react-toastify";
import { getAddonDefinitions, createTenantAddon } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

export function AddAddonModal({ isOpen, onClose, tenantId, subscriptions, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    subscription_id: "",
    addon_id: "",
    quantity: "1",
    start_date: "",
    end_date: "",
  });

  const { data: defRes, isLoading: loadingDefs } = useSWR(
    isOpen ? "addon-definitions" : null,
    getAddonDefinitions,
    { revalidateOnFocus: false }
  );
  const addonDefs = defRes?.data || [];

  const selectedDef = addonDefs.find((d) => String(d.id) === form.addon_id);
  const totalUnits = selectedDef
    ? selectedDef.unit_quantity * (parseInt(form.quantity) || 0)
    : 0;

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().slice(0, 10);
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);
      const active = subscriptions?.find((s) =>
        ["trial", "active", "past_due"].includes(s.status)
      );
      setForm({
        subscription_id: active ? String(active.id) : "",
        addon_id: "",
        quantity: "1",
        start_date: today,
        end_date: end.toISOString().slice(0, 10),
      });
    }
  }, [isOpen, subscriptions]);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subscription_id) {
      toast.error(t("tenants.invoiceSubscriptionRequired"));
      return;
    }
    if (!form.addon_id) {
      toast.error(t("tenants.addonRequired"));
      return;
    }
    if (!form.quantity || parseInt(form.quantity) < 1) {
      toast.error(t("tenants.addonQuantityRequired"));
      return;
    }
    if (!form.start_date || !form.end_date) {
      toast.error(t("tenants.datesRequired"));
      return;
    }

    setSaving(true);
    try {
      await createTenantAddon(tenantId, {
        subscription_id: Number(form.subscription_id),
        addon_id: Number(form.addon_id),
        quantity: parseInt(form.quantity),
        start_date: form.start_date,
        end_date: form.end_date,
      });
      toast.success(t("tenants.addonCreateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("tenants.addonCreateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("tenants.addAddon")} size="md">
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          {loadingDefs ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Subscription */}
              <div className="space-y-2">
                <Label>{t("tenants.subscription")}</Label>
                <Select
                  value={form.subscription_id}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, subscription_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("tenants.selectSubscription")} />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions?.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.plan_name_en} — {s.billing_cycle} ({s.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Addon */}
              <div className="space-y-2">
                <Label>{t("tenants.addonName")}</Label>
                <Select
                  value={form.addon_id}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, addon_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("tenants.selectAddon")} />
                  </SelectTrigger>
                  <SelectContent>
                    {addonDefs.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name_en} ({d.resource_type}) — {d.unit_quantity} units/pack
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity + Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("tenants.quantity")}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantity}
                    onChange={set("quantity")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("tenants.totalUnits")}</Label>
                  <div className="flex items-center h-9 px-3 rounded-md border bg-muted/50 text-sm font-semibold text-primary">
                    {totalUnits}
                  </div>
                </div>
              </div>

              {/* Pricing preview */}
              {selectedDef && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("tenants.monthly")}</p>
                    <p className="font-semibold">
                      {(selectedDef.monthly_price * (parseInt(form.quantity) || 1)).toFixed(2)} AED
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("tenants.annual")}</p>
                    <p className="font-semibold">
                      {(selectedDef.annual_price * (parseInt(form.quantity) || 1)).toFixed(2)} AED
                    </p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">{t("tenants.startDate")}</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={set("start_date")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">{t("tenants.endDate")}</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={set("end_date")}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </CustomModalBody>
        <CustomModalFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            {t("tenants.cancel")}
          </Button>
          <Button type="submit" disabled={saving || loadingDefs}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                {t("tenants.saving")}
              </>
            ) : (
              <>
                <Package className="w-4 h-4 me-2" />
                {t("tenants.addAddon")}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}

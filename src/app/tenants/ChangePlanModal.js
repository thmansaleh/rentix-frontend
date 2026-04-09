"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { CustomModal, CustomModalBody, CustomModalHeader, CustomModalTitle, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Save, Crown, CheckCircle2, Car, GitBranch, Users, ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { getSubscriptionPlans, updateTenantSubscription } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function ChangePlanModal({ isOpen, onClose, tenantId, currentSubscription, onSuccess }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");

  const { data: plansRes, isLoading: loadingPlans } = useSWR(
    isOpen ? "subscription-plans" : null,
    () => getSubscriptionPlans(),
    { revalidateOnFocus: false }
  );

  const plans = plansRes?.data || [];

  // Pre-fill from current subscription
  useEffect(() => {
    if (currentSubscription) {
      setSelectedPlanId(String(currentSubscription.plan_id));
      setBillingCycle(currentSubscription.billing_cycle || "monthly");
      setStatus(currentSubscription.status || "active");
      setStartDate(currentSubscription.start_date ? currentSubscription.start_date.slice(0, 10) : "");
      setEndDate(currentSubscription.end_date ? currentSubscription.end_date.slice(0, 10) : "");
    } else {
      // New subscription defaults
      setSelectedPlanId("");
      setBillingCycle("monthly");
      setStatus("active");
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
      // Default end date: 1 month from now
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      setEndDate(end.toISOString().slice(0, 10));
    }
  }, [currentSubscription, isOpen]);

  // Auto-calculate end date when billing cycle or start date changes
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      if (billingCycle === "monthly") {
        start.setMonth(start.getMonth() + 1);
      } else {
        start.setFullYear(start.getFullYear() + 1);
      }
      setEndDate(start.toISOString().slice(0, 10));
    }
  }, [billingCycle, startDate]);

  const selectedPlan = useMemo(
    () => plans.find((p) => String(p.id) === selectedPlanId),
    [plans, selectedPlanId]
  );

  const currentPlanId = currentSubscription?.plan_id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) {
      toast.error(t("tenants.selectPlanRequired"));
      return;
    }
    if (!startDate || !endDate) {
      toast.error(t("tenants.datesRequired"));
      return;
    }

    setSaving(true);
    try {
      await updateTenantSubscription(tenantId, {
        plan_id: Number(selectedPlanId),
        billing_cycle: billingCycle,
        start_date: startDate,
        end_date: endDate,
        status,
      });
      toast.success(t("tenants.planUpdateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("tenants.planUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  const displayPrice = (plan) => {
    if (!plan) return "—";
    const price = billingCycle === "monthly" ? plan.monthly_price : plan.annual_price;
    return `${parseFloat(price || 0).toFixed(2)} AED`;
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={currentSubscription ? t("tenants.changePlan") : t("tenants.assignPlan")}
      size="lg"
    >
      {loadingPlans ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CustomModalBody>
            <div className="space-y-5">
              {/* Billing Cycle Toggle */}
              <div className="space-y-2">
                <Label>{t("tenants.billingCycle")}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={billingCycle === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingCycle("monthly")}
                    className="flex-1"
                  >
                    {t("tenants.monthly")}
                  </Button>
                  <Button
                    type="button"
                    variant={billingCycle === "annual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBillingCycle("annual")}
                    className="flex-1"
                  >
                    {t("tenants.annual")}
                  </Button>
                </div>
              </div>

              {/* Plan Selection Cards */}
              <div className="space-y-2">
                <Label>{t("tenants.selectPlan")}</Label>
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {plans.map((plan) => {
                    const isSelected = String(plan.id) === selectedPlanId;
                    const isCurrent = plan.id === currentPlanId;
                    const price = billingCycle === "monthly" ? plan.monthly_price : plan.annual_price;

                    return (
                      <Card
                        key={plan.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          isSelected
                            ? "ring-2 ring-primary border-primary"
                            : "hover:border-primary/40",
                          isCurrent && !isSelected && "border-dashed border-muted-foreground/40"
                        )}
                        onClick={() => setSelectedPlanId(String(plan.id))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                              )}>
                                <Crown className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{isRTL ? plan.name_ar : plan.name_en}</span>
                                  {isCurrent && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                      {t("tenants.currentPlan")}
                                    </span>
                                  )}
                                </div>
                                {plan.name_ar && (
                                  <p className="text-xs text-muted-foreground">{plan.name_ar}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">
                                {parseFloat(price || 0).toFixed(2)} <span className="text-xs font-normal">AED</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                /{billingCycle === "monthly" ? t("tenants.month") : t("tenants.year")}
                              </p>
                            </div>
                          </div>

                          {/* Plan limits */}
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Car className="w-3 h-3" />
                              {plan.max_cars ?? "∞"} {t("tenants.cars")}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              {plan.max_branches ?? "∞"} {t("tenants.branches")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {plan.max_employees ?? "∞"} {t("tenants.employees")}
                            </span>
                          </div>

                          {/* Features preview */}
                          {isSelected && plan.features?.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="grid grid-cols-2 gap-1">
                                {plan.features.map((f) => (
                                  <div key={f.id} className="flex items-center gap-1.5 text-xs">
                                    <CheckCircle2 className={cn("w-3 h-3", f.is_included ? "text-emerald-500" : "text-gray-300")} />
                                    <span className={f.is_included ? "" : "text-muted-foreground line-through"}>
                                      {(isRTL ? f.label_ar : f.label_en) || f.feature_key}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Dates & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">{t("tenants.startDate")}</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">{t("tenants.endDate")}</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("tenants.status")}</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("tenants.statusActive")}</SelectItem>
                      <SelectItem value="trial">{t("tenants.statusTrial")}</SelectItem>
                      <SelectItem value="past_due">{t("tenants.statusPastDue")}</SelectItem>
                      <SelectItem value="cancelled">{t("tenants.statusCancelled")}</SelectItem>
                      <SelectItem value="expired">{t("tenants.statusExpired")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              {selectedPlan && (
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      {currentSubscription && (
                        <>
                          <span className="text-muted-foreground">{isRTL ? currentSubscription.plan_name_ar : currentSubscription.plan_name_en}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </>
                      )}
                      <span className="font-semibold">{isRTL ? selectedPlan.name_ar : selectedPlan.name_en}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-semibold text-primary">{displayPrice(selectedPlan)}</span>
                      <span className="text-muted-foreground capitalize">/ {billingCycle}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CustomModalBody>

          <CustomModalFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              {t("tenants.cancel")}
            </Button>
            <Button type="submit" disabled={saving || !selectedPlanId}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ltr:mr-2 rtl:ml-2" />
                  {t("tenants.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {currentSubscription ? t("tenants.changePlan") : t("tenants.assignPlan")}
                </>
              )}
            </Button>
          </CustomModalFooter>
        </form>
      )}
    </CustomModal>
  );
}

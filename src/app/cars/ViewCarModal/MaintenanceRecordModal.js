"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Wrench } from "lucide-react";
import { createCarMaintenance, updateCarMaintenance } from "../../services/api/cars";
import { formatDate } from "./utils";

const EMPTY_FORM = {
  maintenance_date: "",
  maintenance_type: "",
  description: "",
  cost: "",
  mileage: "",
  garage_name: "",
  invoice_number: "",
  next_maintenance_date: "",
};

// ─── Add / Edit Form Modal ────────────────────────────────────────────────────
export function MaintenanceRecordModal({ isOpen, onClose, onSuccess, carId, record, t, isRTL }) {
  const isEdit = Boolean(record);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (record) {
      const toDateInput = (val) => {
        if (!val) return "";
        const d = new Date(val);
        if (isNaN(d)) return "";
        return d.toISOString().split("T")[0];
      };
      setForm({
        maintenance_date: toDateInput(record.maintenance_date),
        maintenance_type: record.maintenance_type || "",
        description: record.description || "",
        cost: record.cost != null ? String(record.cost) : "",
        mileage: record.mileage != null ? String(record.mileage) : "",
        garage_name: record.garage_name || "",
        invoice_number: record.invoice_number || "",
        next_maintenance_date: toDateInput(record.next_maintenance_date),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [record, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.maintenance_date) {
      setError(t("cars.maintenanceHistoryTab.form.validationDate"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        cost: form.cost !== "" ? Number(form.cost) : null,
        mileage: form.mileage !== "" ? Number(form.mileage) : null,
        maintenance_date: form.maintenance_date || null,
        next_maintenance_date: form.next_maintenance_date || null,
      };
      if (isEdit) {
        await updateCarMaintenance(carId, record.id, payload);
      } else {
        await createCarMaintenance(carId, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || t("cars.maintenanceHistoryTab.form.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            {isEdit
              ? t("cars.maintenanceHistoryTab.form.editTitle")
              : t("cars.maintenanceHistoryTab.form.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Maintenance Date */}
            <div className="space-y-1">
              <Label htmlFor="maintenance_date">
                {t("cars.maintenanceHistoryTab.columns.date")}
                <span className="text-destructive ms-1">*</span>
              </Label>
              <Input
                id="maintenance_date"
                name="maintenance_date"
                type="date"
                value={form.maintenance_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-1">
              <Label htmlFor="maintenance_type">
                {t("cars.maintenanceHistoryTab.columns.type")}
              </Label>
              <Input
                id="maintenance_type"
                name="maintenance_type"
                value={form.maintenance_type}
                onChange={handleChange}
                placeholder={t("cars.maintenanceHistoryTab.form.typePlaceholder")}
              />
            </div>

            {/* Cost */}
            <div className="space-y-1">
              <Label htmlFor="cost">
                {t("cars.maintenanceHistoryTab.columns.cost")}
              </Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            {/* Mileage */}
            {/* <div className="space-y-1">
              <Label htmlFor="mileage">
                {t("cars.maintenanceHistoryTab.columns.mileage")}
              </Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                min="0"
                value={form.mileage}
                onChange={handleChange}
                placeholder="0"
              />
            </div> */}

            {/* Garage */}
            <div className="space-y-1">
              <Label htmlFor="garage_name">
                {t("cars.maintenanceHistoryTab.columns.garage")}
              </Label>
              <Input
                id="garage_name"
                name="garage_name"
                value={form.garage_name}
                onChange={handleChange}
              />
            </div>

            {/* Invoice # */}
            {/* <div className="space-y-1">
              <Label htmlFor="invoice_number">
                {t("cars.maintenanceHistoryTab.columns.invoice")}
              </Label>
              <Input
                id="invoice_number"
                name="invoice_number"
                value={form.invoice_number}
                onChange={handleChange}
              />
            </div> */}

            {/* Next Maintenance Date */}
            <div className="space-y-1 col-span-2">
              <Label htmlFor="next_maintenance_date">
                {t("cars.maintenanceHistoryTab.columns.nextDate")}
              </Label>
              <Input
                id="next_maintenance_date"
                name="next_maintenance_date"
                type="date"
                value={form.next_maintenance_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">
              {t("cars.maintenanceHistoryTab.columns.description")}
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              {t("cars.maintenanceHistoryTab.form.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
              {t("cars.maintenanceHistoryTab.form.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── View Detail Dialog ────────────────────────────────────────────────────────
export function MaintenanceRecordViewDialog({ isOpen, onClose, record, t, isRTL }) {
  if (!record) return null;

  const toDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return isNaN(d) ? "-" : d.toLocaleDateString(isRTL ? "ar-AE" : "en-AE", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const formatCost = (val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return "-";
    return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 2 }).format(n);
  };

  const Row = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm">{value || "-"}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            {t("cars.maintenanceHistoryTab.view.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <Row label={t("cars.maintenanceHistoryTab.columns.date")} value={toDate(record.maintenance_date)} />
          <Row label={t("cars.maintenanceHistoryTab.columns.type")} value={record.maintenance_type} />
          <Row label={t("cars.maintenanceHistoryTab.columns.cost")} value={formatCost(record.cost)} />
          {/* <Row label={t("cars.maintenanceHistoryTab.columns.mileage")} value={record.mileage ? Number(record.mileage).toLocaleString() : null} /> */}
          <Row label={t("cars.maintenanceHistoryTab.columns.garage")} value={record.garage_name} />
          {/* <Row label={t("cars.maintenanceHistoryTab.columns.invoice")} value={record.invoice_number} /> */}
          <Row label={t("cars.maintenanceHistoryTab.columns.nextDate")} value={toDate(record.next_maintenance_date)} />
          <Row label={t("cars.maintenanceHistoryTab.view.addedBy")} value={record.created_by_name} />
          <div className="col-span-2">
            <Row label={t("cars.maintenanceHistoryTab.columns.description")} value={record.description} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t("cars.maintenanceHistoryTab.form.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────
export function MaintenanceDeleteDialog({ isOpen, onClose, onConfirm, deleting, t, isRTL }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-destructive">
            {t("cars.maintenanceHistoryTab.delete.title")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t("cars.maintenanceHistoryTab.delete.confirm")}
        </p>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={deleting}>
            {t("cars.maintenanceHistoryTab.form.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
            {t("cars.maintenanceHistoryTab.delete.deleteBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

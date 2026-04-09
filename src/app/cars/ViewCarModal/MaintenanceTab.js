"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Droplets,
  Wrench,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Check,
  X,
} from "lucide-react";
import {
  getOilChangesByCarId,
  createOilChange,
  updateOilChange,
  deleteOilChange,
} from "../../services/api/oilChanges";
import {
  getCarMaintenance,
  deleteCarMaintenance,
} from "../../services/api/cars";
import {
  MaintenanceRecordModal,
  MaintenanceRecordViewDialog,
  MaintenanceDeleteDialog,
} from "./MaintenanceRecordModal";
import { formatDate } from "./utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(amount);
};

const emptyOilForm = {
  oil_type: "",
  oil_filter_changed: true,
  mileage_at_change: "",
  next_change_km: "",
  change_date: "",
  cost: "",
  garage_name: "",
  notes: "",
};

// ─── Oil Change Form Modal ───────────────────────────────────────────────────

function OilFormModal({ isOpen, onClose, onSubmit, initial, isRTL, isSaving }) {
  const [form, setForm] = useState(initial || emptyOilForm);

  useEffect(() => {
    setForm(initial || emptyOilForm);
  }, [initial, isOpen]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initial
              ? isRTL ? "تعديل سجل تغيير الزيت" : "Edit Oil Change"
              : isRTL ? "إضافة تغيير زيت" : "Add Oil Change"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>{isRTL ? "نوع الزيت" : "Oil Type"}</Label>
              <Input value={form.oil_type} onChange={(e) => set("oil_type", e.target.value)} placeholder="e.g. 5W-30" />
            </div>
            <div className="space-y-1">
              <Label>{isRTL ? "تاريخ التغيير" : "Change Date"}</Label>
              <Input type="date" value={form.change_date} onChange={(e) => set("change_date", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>{isRTL ? "الكيلومترات عند التغيير" : "Mileage at Change (km)"}</Label>
              <Input type="number" min={0} value={form.mileage_at_change} onChange={(e) => set("mileage_at_change", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label>{isRTL ? "كيلومترات التغيير القادم" : "Next Change (km)"}</Label>
              <Input type="number" min={0} value={form.next_change_km} onChange={(e) => set("next_change_km", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label>{isRTL ? "التكلفة" : "Cost"}</Label>
              <Input type="number" min={0} step="0.01" value={form.cost} onChange={(e) => set("cost", e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1">
              <Label>{isRTL ? "اسم الكراج/ الورشة" : "Garage Name"}</Label>
              <Input value={form.garage_name} onChange={(e) => set("garage_name", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="oil_filter_check"
              type="checkbox"
              checked={!!form.oil_filter_changed}
              onChange={(e) => set("oil_filter_changed", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="oil_filter_check">{isRTL ? "تم تغيير فلتر الزيت" : "Oil Filter Changed"}</Label>
          </div>
          <div className="space-y-1">
            <Label>{isRTL ? "ملاحظات" : "Notes"}</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{isRTL ? "إلغاء" : "Cancel"}</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {initial ? (isRTL ? "حفظ" : "Save") : (isRTL ? "إضافة" : "Add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm ──────────────────────────────────────────────────────────

function DeleteConfirm({ isOpen, onClose, onConfirm, isRTL, isDeleting }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isRTL ? "تأكيد الحذف" : "Confirm Delete"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {isRTL
            ? "هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع."
            : "Are you sure you want to delete this record? This cannot be undone."}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{isRTL ? "إلغاء" : "Cancel"}</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isRTL ? "حذف" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Oil Records Panel ───────────────────────────────────────────────────────

function OilRecordsPanel({ carId, isRTL, isActive }) {
  const { data: response, isLoading, mutate } = useSWR(
    isActive && carId ? `car-oil-changes-${carId}` : null,
    () => getOilChangesByCarId(carId),
    { revalidateOnFocus: false }
  );

  const records = response?.data || [];
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = async (form) => {
    setIsSaving(true);
    try {
      await createOilChange({ ...form, car_id: carId });
      await mutate();
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setIsSaving(true);
    try {
      await updateOilChange(editRecord.id, form);
      await mutate();
      setEditRecord(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOilChange(deleteRecord.id);
      await mutate();
      setDeleteRecord(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const editInitial = editRecord
    ? {
        oil_type: editRecord.oil_type || "",
        oil_filter_changed: !!editRecord.oil_filter_changed,
        mileage_at_change: editRecord.mileage_at_change || "",
        next_change_km: editRecord.next_change_km || "",
        change_date: editRecord.change_date ? editRecord.change_date.split("T")[0] : "",
        cost: editRecord.cost || "",
        garage_name: editRecord.garage_name || "",
        notes: editRecord.notes || "",
      }
    : null;

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Droplets className="w-5 h-5 text-amber-500" />
              {isRTL ? "سجلات تغيير الزيت" : "Oil Change Records"}
            </Label>
            {!isLoading && (
              <p className="text-sm text-muted-foreground mt-1">
                {records.length} {isRTL ? "سجل" : "record(s)"}
              </p>
            )}
          </div>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isRTL ? "إضافة" : "Add Oil Change"}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {isRTL ? "لا توجد سجلات تغيير زيت" : "No oil change records"}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
                    <TableHead>{isRTL ? "نوع الزيت" : "Oil Type"}</TableHead>
                    <TableHead>{isRTL ? "  الكيلومترات عند التغيير " : "Mileage (km)"}</TableHead>
                    <TableHead>{isRTL ? "التغيير القادم" : "Next Change (km)"}</TableHead>
                    <TableHead>{isRTL ? "فلتر الزيت" : "Oil Filter"}</TableHead>
                    <TableHead>{isRTL ? "التكلفة" : "Cost"}</TableHead>
                    <TableHead>{isRTL ? "اسم الكراج/ الورشة" : "Garage"}</TableHead>
                    <TableHead className="text-right">{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(rec.change_date)}</TableCell>
                      <TableCell>{rec.oil_type || "-"}</TableCell>
                      <TableCell>{rec.mileage_at_change ? Number(rec.mileage_at_change).toLocaleString() : "-"}</TableCell>
                      <TableCell>{rec.next_change_km ? Number(rec.next_change_km).toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        {rec.oil_filter_changed ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Check className="w-3 h-3 mr-1" />{isRTL ? "نعم" : "Yes"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <X className="w-3 h-3 mr-1" />{isRTL ? "لا" : "No"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{rec.cost ? Number(rec.cost).toLocaleString() : "-"}</TableCell>
                      <TableCell>{rec.garage_name || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditRecord(rec)}>
                            <Edit className="w-4 h-4 text-amber-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteRecord(rec)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      <OilFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAdd} initial={null} isRTL={isRTL} isSaving={isSaving} />
      <OilFormModal isOpen={!!editRecord} onClose={() => setEditRecord(null)} onSubmit={handleEdit} initial={editInitial} isRTL={isRTL} isSaving={isSaving} />
      <DeleteConfirm isOpen={!!deleteRecord} onClose={() => setDeleteRecord(null)} onConfirm={handleDelete} isRTL={isRTL} isDeleting={isDeleting} />
    </Card>
  );
}

// ─── Maintenance Records Panel ───────────────────────────────────────────────

function MaintenanceRecordsPanel({ carId, isRTL, t, isActive }) {
  const { data: maintenanceResponse, isLoading, mutate } = useSWR(
    isActive && carId ? `car-maintenance-${carId}` : null,
    () => getCarMaintenance(carId),
    { revalidateOnFocus: false }
  );

  const records = maintenanceResponse?.data || [];
  const totalCost = records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);

  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => { setEditRecord(null); setFormOpen(true); };
  const openEdit = (r) => { setEditRecord(r); setFormOpen(true); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCarMaintenance(carId, deleteTarget.id);
      mutate();
      setDeleteTarget(null);
    } catch {
      // user can retry
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              {t("cars.maintenanceHistoryTab.title")}
            </Label>
            {!isLoading && (
              <p className="text-sm text-muted-foreground mt-1">
                {records.length} {t("cars.maintenanceHistoryTab.recordsCount")}
                {records.length > 0 && (
                  <span className="ms-2 font-medium text-foreground">
                    {t("cars.maintenanceHistoryTab.totalCost")}: {formatCurrency(totalCost)}
                  </span>
                )}
              </p>
            )}
          </div>
          <Button size="sm" onClick={openAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t("cars.maintenanceHistoryTab.addRecord")}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">{t("cars.maintenanceHistoryTab.empty")}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("cars.maintenanceHistoryTab.columns.date")}</TableHead>
                    <TableHead>{t("cars.maintenanceHistoryTab.columns.type")}</TableHead>
                    <TableHead>{t("cars.maintenanceHistoryTab.columns.description")}</TableHead>
                    <TableHead>{t("cars.maintenanceHistoryTab.columns.cost")}</TableHead>
                    {/* <TableHead>{t("cars.maintenanceHistoryTab.columns.mileage")}</TableHead> */}
                    <TableHead>{t("cars.maintenanceHistoryTab.columns.garage")}</TableHead>
                    {/* <TableHead>{t("cars.maintenanceHistoryTab.columns.invoice")}</TableHead> */}
                    <TableHead>{t("cars.maintenanceHistoryTab.columns.nextDate")}</TableHead>
                    <TableHead className="text-right">{t("cars.maintenanceHistoryTab.columns.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium whitespace-nowrap">{formatDate(record.maintenance_date)}</TableCell>
                      <TableCell>{record.maintenance_type || "-"}</TableCell>
                      <TableCell className="min-w-[200px]">
                        <div className="max-w-[240px] truncate">{record.description || "-"}</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatCurrency(record.cost)}</TableCell>
                      {/* <TableCell>{record.mileage ? Number(record.mileage).toLocaleString() : "-"}</TableCell> */}
                      <TableCell>{record.garage_name || "-"}</TableCell>
                      {/* <TableCell>{record.invoice_number || "-"}</TableCell> */}
                      <TableCell className="whitespace-nowrap">{formatDate(record.next_maintenance_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setViewRecord(record)}>
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(record)}>
                            <Edit className="w-4 h-4 text-amber-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(record)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      <MaintenanceRecordModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => mutate()}
        carId={carId}
        record={editRecord}
        t={t}
        isRTL={isRTL}
      />
      <MaintenanceRecordViewDialog
        isOpen={Boolean(viewRecord)}
        onClose={() => setViewRecord(null)}
        record={viewRecord}
        t={t}
        isRTL={isRTL}
      />
      <MaintenanceDeleteDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={deleting}
        t={t}
      />
    </Card>
  );
}

// ─── Combined Maintenance Tab ────────────────────────────────────────────────

export function MaintenanceTab({ carId, isActive, isRTL, t }) {
  const [innerTab, setInnerTab] = useState("oil-records");

  return (
    <TabsContent  value="maintenance" className="space-y-4 flex-1 overflow-y-auto">
      <Tabs  dir={isRTL ? "rtl" : "ltr"} value={innerTab} onValueChange={setInnerTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="oil-records" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-amber-500" />
            {isRTL ? "سجلات الزيت" : "Oil Records"}
          </TabsTrigger>
          <TabsTrigger value="maintenance-records" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            {isRTL ? "سجلات الصيانة" : "Maintenance Records"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="oil-records">
          <OilRecordsPanel carId={carId} isRTL={isRTL} isActive={isActive} />
        </TabsContent>

        <TabsContent value="maintenance-records">
          <MaintenanceRecordsPanel carId={carId} isRTL={isRTL} t={t} isActive={isActive} />
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
}

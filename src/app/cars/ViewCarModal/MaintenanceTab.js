"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Droplets, Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { updateOilChange } from "../../services/api/cars";
import { formatDate } from "./utils";

export function MaintenanceTab({ carData, t, onCarUpdated }) {
  const [saving, setSaving] = useState(false);
  const [oilForm, setOilForm] = useState({
    last_oil_change_km: carData.last_oil_change_km || "",
    oil_change_interval_km: carData.oil_change_interval_km || 5000,
    next_oil_change_km: carData.next_oil_change_km || "",
  });

  const handleOilChange = (field, value) => {
    const numValue = value === "" ? "" : parseInt(value, 10) || "";
    const updated = { ...oilForm, [field]: numValue };

    // Auto-calculate next oil change when last and interval change
    if (field === "last_oil_change_km" || field === "oil_change_interval_km") {
      const last = field === "last_oil_change_km" ? numValue : updated.last_oil_change_km;
      const interval = field === "oil_change_interval_km" ? numValue : updated.oil_change_interval_km;
      if (last !== "" && interval !== "") {
        updated.next_oil_change_km = Number(last) + Number(interval);
      }
    }

    setOilForm(updated);
  };

  const handleSaveOilChange = async () => {
    setSaving(true);
    try {
      const result = await updateOilChange(carData.id, {
        last_oil_change_km: oilForm.last_oil_change_km || null,
        oil_change_interval_km: oilForm.oil_change_interval_km || 5000,
        next_oil_change_km: oilForm.next_oil_change_km || null,
      });
      toast.success(t("cars.maintenanceTab.oilChangeUpdated"));
      if (onCarUpdated) onCarUpdated(result.data);
    } catch (error) {
      console.error("Error updating oil change:", error);
      toast.error(t("cars.maintenanceTab.oilChangeUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  // Calculate remaining km
  const currentMileage = carData.mileage || 0;
  const nextOil = oilForm.next_oil_change_km;
  const remainingKm = nextOil ? nextOil - currentMileage : null;

  return (
    <TabsContent value="maintenance" className="space-y-4 flex-1 overflow-y-auto">
      {/* General Maintenance Dates */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t("cars.maintenanceTab.lastDate")}
              </Label>
              <p className="text-base">
                {formatDate(carData.last_maintenance_date)}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t("cars.maintenanceTab.nextDate")}
              </Label>
              <p className="text-base">
                {formatDate(carData.next_maintenance_date)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Oil Change Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold">{t("cars.maintenanceTab.oilChange")}</h3>
          </div>

          {/* Current Mileage Display */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium text-muted-foreground">
              {t("cars.maintenanceTab.currentMileage")}
            </Label>
            <p className="text-xl font-bold">
              {currentMileage.toLocaleString()} {t("cars.maintenanceTab.km")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("cars.maintenanceTab.lastOilChangeKm")}
              </Label>
              <Input
                type="number"
                min="0"
                value={oilForm.last_oil_change_km}
                onChange={(e) => handleOilChange("last_oil_change_km", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("cars.maintenanceTab.oilChangeIntervalKm")}
              </Label>
              <Input
                type="number"
                min="1000"
                value={oilForm.oil_change_interval_km}
                onChange={(e) => handleOilChange("oil_change_interval_km", e.target.value)}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("cars.maintenanceTab.nextOilChangeKm")}
              </Label>
              <Input
                type="number"
                value={oilForm.next_oil_change_km}
                disabled
                className="bg-muted/50 font-semibold"
              />
            </div>
          </div>

          {/* Remaining KM Indicator */}
          {remainingKm !== null && (
            <div className={`mb-4 p-3 rounded-lg border ${
              remainingKm <= 0
                ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                : remainingKm <= 500
                  ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
                  : "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
            }`}>
              <p className={`text-sm font-medium ${
                remainingKm <= 0
                  ? "text-red-700 dark:text-red-400"
                  : remainingKm <= 500
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-green-700 dark:text-green-400"
              }`}>
                {remainingKm <= 0
                  ? `⚠️ ${t("cars.maintenanceTab.overdue")} ${Math.abs(remainingKm).toLocaleString()} ${t("cars.maintenanceTab.km")}`
                  : `✅ ${t("cars.maintenanceTab.remaining")}: ${remainingKm.toLocaleString()} ${t("cars.maintenanceTab.km")}`
                }
              </p>
            </div>
          )}

          <Button onClick={handleSaveOilChange} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 me-2" />
            )}
            {t("cars.maintenanceTab.updateOilChange")}
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { Car, Tag, Palette, Gauge, DollarSign, CalendarDays, Hash, StickyNote } from "lucide-react";
import { getStatusVariant, getStatusLabel } from "./utils";

function InfoField({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors duration-150">
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </Label>
        <div className="text-sm font-medium text-foreground leading-snug">
          {children}
        </div>
      </div>
    </div>
  );
}



export function BasicInfoTab({ carData, t }) {
  return (
    <TabsContent value="basic" className="flex-1 overflow-y-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-5">

          {/* Identity Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <InfoField icon={Hash} label={t("cars.plateNumber")}>
                {carData.plate_number
                  ? <span className="font-mono tracking-wider text-base">{carData.plate_number}</span>
                  : <span className="text-muted-foreground">—</span>
                }
              </InfoField>

              <InfoField icon={Tag} label={t("cars.status")}>
                {carData.status
                  ? <Badge variant={getStatusVariant(carData.status)} className="text-xs px-2 py-0.5">
                      {getStatusLabel(carData.status, t)}
                    </Badge>
                  : <span className="text-muted-foreground">—</span>
                }
              </InfoField>

              <InfoField icon={Hash} label={t("cars.plateSource")}>
                {carData.plate_source || <span className="text-muted-foreground">—</span>}
              </InfoField>

              <InfoField icon={Hash} label={t("cars.plateCode")}>
                {carData.plate_code || <span className="text-muted-foreground">—</span>}
              </InfoField>

            </div>
          </div>

          {/* Vehicle Details Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <InfoField icon={Car} label={t("cars.brand")}>
                {carData.brand || <span className="text-muted-foreground">—</span>}
              </InfoField>

              <InfoField icon={Car} label={t("cars.model")}>
                {carData.model || <span className="text-muted-foreground">—</span>}
              </InfoField>

              <InfoField icon={CalendarDays} label={t("cars.year")}>
                {carData.year || <span className="text-muted-foreground">—</span>}
              </InfoField>

              <InfoField icon={Palette} label={t("cars.color")}>
                {carData.color
                  ? <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-border/60 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: carData.color.toLowerCase() }}
                      />
                      <span>{carData.color}</span>
                    </div>
                  : <span className="text-muted-foreground">—</span>
                }
              </InfoField>

              <InfoField icon={Gauge} label={t("cars.mileage")}>
                {carData.mileage
                  ? <span>{carData.mileage.toLocaleString()} <span className="text-muted-foreground font-normal text-xs">km</span></span>
                  : <span>0 <span className="text-muted-foreground font-normal text-xs">km</span></span>
                }
              </InfoField>

            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <InfoField icon={DollarSign} label={t("cars.carPrice")}>
                {carData.car_price
                  ? <span className="text-primary font-semibold">
                      {parseFloat(carData.car_price).toLocaleString()}
                    </span>
                  : <span className="text-muted-foreground">—</span>
                }
              </InfoField>

              <InfoField icon={DollarSign} label={t("cars.dailyRentalPrice")}>
                {carData.daily_price
                  ? <span className="text-primary font-semibold">
                      {parseFloat(carData.daily_price).toFixed(2)}
                      <span className="text-muted-foreground font-normal text-xs"> /day</span>
                    </span>
                  : <span className="text-muted-foreground">—</span>
                }
              </InfoField>

            </div>
          </div>

          {/* Notes Section */}
          {carData.notes && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                <StickyNote className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <p className="text-sm text-foreground/80 leading-relaxed">{carData.notes}</p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </TabsContent>
  );
}
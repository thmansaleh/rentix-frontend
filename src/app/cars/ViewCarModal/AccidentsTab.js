import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Eye, Edit, Trash2 } from "lucide-react";
import { formatDateTime } from "./utils";

export function AccidentsTab({
  accidents,
  isRTL,
  onViewAccident,
  onEditAccident,
  onDeleteAccident,
}) {
  return (
    <TabsContent value="accidents" className="space-y-4 flex-1 overflow-y-auto">
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {isRTL ? "سجل الحوادث" : "Accident History"}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {accidents.length}{" "}
                {isRTL ? "حادث مسجل" : "accident(s) recorded"}
              </p>
            </div>
          </div>

          {accidents.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "لا توجد حوادث مسجلة لهذه السيارة"
                  : "No accidents recorded for this car"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {isRTL ? "التاريخ والوقت" : "Date & Time"}
                      </TableHead>
                      <TableHead>
                        {isRTL ? "العميل" : "Customer"}
                      </TableHead>
                      <TableHead>
                        {isRTL ? "رقم العقد" : "Contract"}
                      </TableHead>
                      <TableHead>
                        {isRTL ? "الموقع" : "Location"}
                      </TableHead>
                      <TableHead>
                        {isRTL ? "المسؤولية" : "Liability"}
                      </TableHead>
                      <TableHead>
                        {isRTL ? "رقم التقرير" : "Report #"}
                      </TableHead>
                      <TableHead className="text-right">
                        {isRTL ? "الإجراءات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accidents.map((accident) => (
                      <TableRow key={accident.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatDateTime(accident.accident_datetime)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {accident.customer_name || "-"}
                            </div>
                            {accident.customer_phone && (
                              <div className="text-xs text-muted-foreground">
                                {accident.customer_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {accident.contract_number || "-"}
                        </TableCell>
                        <TableCell>{accident.location || "-"}</TableCell>
                        <TableCell>
                          {accident.liability_type ? (
                            <Badge
                              variant={
                                accident.liability_type === "CUSTOMER"
                                  ? "destructive"
                                  : accident.liability_type === "THIRD_PARTY"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {accident.liability_type === "CUSTOMER"
                                ? isRTL
                                  ? "العميل"
                                  : "Customer"
                                : accident.liability_type === "THIRD_PARTY"
                                ? isRTL
                                  ? "طرف ثالث"
                                  : "Third Party"
                                : isRTL
                                ? "غير معروف"
                                : "Unknown"}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {accident.police_report_number || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewAccident(accident.id)}
                              title={isRTL ? "عرض" : "View"}
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEditAccident(accident.id)}
                              title={isRTL ? "تعديل" : "Edit"}
                            >
                              <Edit className="w-4 h-4 text-amber-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteAccident(accident)}
                              title={isRTL ? "حذف" : "Delete"}
                            >
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
      </Card>
    </TabsContent>
  );
}

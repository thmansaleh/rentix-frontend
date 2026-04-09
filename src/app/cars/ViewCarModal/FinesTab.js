import { useState } from "react";
import useSWR from "swr";
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
import { Receipt, RefreshCw, Loader2, AlertCircle, Eye } from "lucide-react";
import { getVehicleFines } from "@/app/services/api/fines";
import { ViewFineModal } from "@/app/fines/ViewFineModal";

const BENEFICIARY_AR = {
  "Dubai Police": "شرطة دبي",
  "DUBAI POLICE": "شرطة دبي",
  "Sharjah Transportation": "هيئة الطرق والمواصلات - الشارقة",
  "Abu Dhabi Traffic": "شرطة أبوظبي",
  "Ajman Traffic": "شرطة عجمان",
  "RTA (Parking Fines)": "هيئة الطرق والمواصلات (مخالفات الوقوف)",
  "Sharjah Traffic": "شرطة الشارقة",
  "Ras Al Khaymah Traffic": "شرطة رأس الخيمة",
  "Um Al Quewain Traffic": "شرطة أم القيوين",
  "Sharjah Municipality": "بلدية الشارقة",
  "Fujairah Traffic": "شرطة الفجيرة",
};

function getPayableConfig(isPayable, isRTL) {
  if (isPayable === 2)
    return {
      label: isRTL ? "قابل للدفع" : "Payable",
      variant: "secondary",
      className:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
  if (isPayable === 1)
    return {
      label: isRTL ? "غير قابل للدفع" : "Not Payable",
      variant: "destructive",
      className: "",
    };
  return { label: "-", variant: "outline", className: "" };
}

export function FinesTab({ carId, isActive, isRTL }) {
  const { data: fines, error: finesError, isLoading: finesLoading, mutate } = useSWR(
    isActive && carId ? `car-fines-${carId}` : null,
    () => getVehicleFines(carId),
    { revalidateOnFocus: false }
  );

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const tickets = fines?.data?.results?.tickets || [];

  const totalAmount = tickets.reduce((sum, t) => sum + (t.ticketTotalFine || t.ticketFine || 0), 0);

  const getBeneficiary = (name) => {
    if (!name) return "-";
    return isRTL ? BENEFICIARY_AR[name] || name : name;
  };

  return (
    <TabsContent value="fines" className="space-y-4 flex-1 overflow-y-auto">
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-500" />
                {isRTL ? "مخالفات السيارة" : "Car Fines"}
              </Label>
              {fines && (
                <p className="text-sm text-muted-foreground mt-1">
                  {tickets.length} {isRTL ? "مخالفة" : "fine(s)"}
                  {tickets.length > 0 && (
                    <span className="ms-2 font-semibold text-orange-600 dark:text-orange-400">
                      · AED {totalAmount.toLocaleString()}
                    </span>
                  )}
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => mutate()}
              disabled={finesLoading || !carId}
              className="gap-2"
            >
              {finesLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {finesLoading
                ? isRTL
                  ? "جارٍ التحميل..."
                  : "Loading..."
                : isRTL
                ? "تحديث البيانات"
                : "Refresh"}
            </Button>
          </div>

          {!carId && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "لا يوجد معرف مخالفات لهذه السيارة"
                  : "No fines ID configured for this car"}
              </p>
            </div>
          )}

          {finesLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {finesError && !finesLoading && (
            <div className="text-center py-8 border-2 border-dashed border-destructive/30 rounded-lg">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2 opacity-50" />
              <p className="text-sm text-destructive">
                {isRTL ? "فشل في جلب المخالفات. حاول مجدداً." : "Failed to fetch fines. Please try again."}
              </p>
            </div>
          )}

          {fines && tickets.length === 0 && !finesLoading && !finesError && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {isRTL ? "لا توجد مخالفات لهذه السيارة" : "No fines found for this car"}
              </p>
            </div>
          )}

          {tickets.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? "رقم المخالفة" : "Ticket #"}</TableHead>
                      <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
                      <TableHead>{isRTL ? "الجهة" : "Authority"}</TableHead>
                      <TableHead>{isRTL ? "المبلغ" : "Amount"}</TableHead>
                      <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                      <TableHead>{isRTL ? "الموقع" : "Location"}</TableHead>
                      <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket, index) => {
                      const payable = getPayableConfig(ticket.isPayable, isRTL);
                      return (
                        <TableRow key={ticket.ticketNo || index}>
                          <TableCell className="font-mono text-sm font-medium">
                            {ticket.ticketNo || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {ticket.ticketDate || ticket.fineDate || "-"}
                          </TableCell>
                          <TableCell>
                            {getBeneficiary(ticket.beneficiary || ticket.beneficiaryCode || ticket.beneficiaryName)}
                          </TableCell>
                          <TableCell className="font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                            AED {(ticket.ticketTotalFine || ticket.ticketFine || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={payable.className} variant={payable.variant}>
                              {payable.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            {ticket.violationLocation || ticket.location || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(ticket)}
                              title={isRTL ? "عرض التفاصيل" : "View Details"}
                              className="hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ViewFineModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />
    </TabsContent>
  );
}

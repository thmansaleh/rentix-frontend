"use client";

import useSWR from "swr";
import { getClientAgreementById } from "../services/api/clientsAgreements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Phone, FileText, Calendar, Globe, UserCheck, Building, MessageSquare, MapPin } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export function ClientDetailsModal({ clientId, isOpen, onClose }) {
  const { t } = useTranslations();

  // SWR fetcher function
  const fetcher = () => {
    if (!clientId) return null;
    return getClientAgreementById(clientId);
  };

  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR(
    clientId ? [`/clients-agreements/${clientId}`] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTranslatedStatus = (status) => {
    if (!status) return "-";
    const statusMap = {
      "جديد": t("potentialClientsPage.status.new"),
      "تم التواصل": t("potentialClientsPage.status.contacted"),
      "مؤهل": t("potentialClientsPage.status.qualified"),
      "غير مؤهل": t("potentialClientsPage.status.notQualified"),
      "تحويل موكل": t("potentialClientsPage.status.convertToClient"),
      // Keep backward compatibility
      "New": t("potentialClientsPage.status.new"),
      "Contacted": t("potentialClientsPage.status.contacted"),
      "Converted": t("potentialClientsPage.status.qualified"),
      "Rejected": t("potentialClientsPage.status.notQualified"),
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    if (status === "جديد" || status === "New") {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (status === "تم التواصل" || status === "Contacted") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (status === "مؤهل") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (status === "غير مؤهل") {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (status === "تحويل موكل") {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const client = data?.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("potentialClientsPage.modal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("potentialClientsPage.modal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">{t("potentialClientsPage.messages.loading")}</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <p>{t("potentialClientsPage.messages.error")}</p>
            </div>
          ) : !client ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <p>{t("potentialClientsPage.messages.noResults")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("potentialClientsPage.modal.basicInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("potentialClientsPage.table.name")}
                    </label>
                    <p className="text-sm font-semibold">{client.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {t("potentialClientsPage.table.phone")}
                    </label>
                    <p className="text-sm">{client.phone || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("potentialClientsPage.table.status")}
                    </label>
                    <div className="mt-1">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(client.status)}
                      >
                        {getTranslatedStatus(client.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {t("potentialClientsPage.modal.category")}
                    </label>
                    <p className="text-sm capitalize">{client.category || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {t("potentialClientsPage.modal.consultationType")}
                    </label>
                    <p className="text-sm">{client.consultation_type || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {t("potentialClientsPage.modal.branch")}
                    </label>
                    <p className="text-sm">
                      {client.branch_name_ar && client.branch_name_en 
                        ? `${client.branch_name_ar} / ${client.branch_name_en}`
                        : client.branch_name_ar || client.branch_name_en || "-"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t("potentialClientsPage.modal.additionalInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {t("potentialClientsPage.table.source")}
                    </label>
                    <p className="text-sm">{client.source || "-"}</p>
                  </div>
                  {client.note && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {t("potentialClientsPage.modal.notes")}
                      </label>
                      <div className="mt-1 p-3 bg-muted rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{client.note}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tracking Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("potentialClientsPage.modal.trackingInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      {t("potentialClientsPage.table.createdBy")}
                    </label>
                    <p className="text-sm">{client.created_by_name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {t("potentialClientsPage.table.createdAt")}
                    </label>
                    <p className="text-sm">{formatDate(client.created_at)}</p>
                  </div>
                  {client.updated_at && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t("potentialClientsPage.modal.updatedAt")}
                      </label>
                      <p className="text-sm">{formatDate(client.updated_at)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
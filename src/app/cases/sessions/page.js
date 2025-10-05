"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import useSWR from "swr";
import { getAllSessions } from "@/app/services/api/sessions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import EditSessionModal from "./EditSessionModal";
import DeleteSessionDialog from "./DeleteSessionDialog";
import SessionsExportButtons from "./SessionsExportButtons";
import { deleteSession } from "@/app/services/api/sessions";

export default function SessionsPage() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isRtl = language === "ar";
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch sessions data using SWR
  const {
    data: sessionsData,
    error,
    isLoading,
    mutate,
  } = useSWR("sessions", getAllSessions);

  const sessions = sessionsData?.data || [];

  const handleView = (session) => {
    // TODO: Implement view functionality
    console.log("View session:", session);
  };

  const handleEdit = (session) => {
    setSelectedSessionId(session.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (session) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (sessionId) => {
    try {
      setIsDeleting(true);
      await deleteSession(sessionId);
      
      // Refresh the sessions data
      mutate();
      
      // Close the dialog and reset state
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
      
      // TODO: Show success toast/notification
      console.log("Session deleted successfully");
    } catch (error) {
      console.error("Error deleting session:", error);
      // TODO: Show error toast/notification
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSessionId(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">{t("common.errorLoading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {isRtl ? "جلسات القضايا" : "Case Sessions"}
        </h1>
        <p className="text-muted-foreground">
          {isRtl
            ? "إدارة ومراقبة جلسات القضايا المختلفة"
            : "Manage and monitor different case sessions"}
        </p>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isRtl ? "قائمة الجلسات" : "Sessions List"}</span>
            <Badge variant="secondary">
              {sessions.length} {isRtl ? "جلسة" : "sessions"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Export Buttons Section */}
          <div className="mb-4 pb-4 border-b">
            <SessionsExportButtons data={sessions} language={language} />
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t("common.noData")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className='text-center'>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "رقم القضية" : "Case Number"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "رقم الملف" : "File Number"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "الموضوع" : "Topic"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "المحكمة" : "Court"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "العملاء" : "Clients"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "الخصوم" : "Opponents"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "تاريخ الجلسة" : "Session Date"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {isRtl ? "القرار" : "Decision"}
                    </TableHead>
                    <TableHead className="w-[100px]">
                      {isRtl ? "الإجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.case_number}
                      </TableCell>
                      <TableCell>{session.file_number}</TableCell>
                      <TableCell>{session.case_topic}</TableCell>
                      <TableCell>
                        {isRtl ? session.court_ar : session.court_en}
                      </TableCell>
                      {/* Clients Column */}
                      <TableCell>
                        <div className="space-y-2 max-w-xs">
                          {session.clientParties?.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {session.clientParties.map((client, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="w-fit bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                >
                                  {client}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {isRtl ? "لا يوجد" : "None"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* Opponents Column */}
                      <TableCell>
                        <div className="space-y-2 max-w-xs">
                          {session.opponentParties?.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {session.opponentParties.map((opponent, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="w-fit bg-red-50 text-red-700 border-red-200 text-xs"
                                >
                                  {opponent}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {isRtl ? "لا يوجد" : "None"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(session.session_date).toLocaleDateString(
                          isRtl ? "ar-AE" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                      {/* Decision Column */}
                      <TableCell>
                        <div className="max-w-xs">
                          {session.decision ? (
                            <Badge
                              variant="outline"
                              className="w-fit bg-green-50 text-green-700 border-green-200 text-xs"
                            >
                              {session.decision}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {isRtl ? "لم يتم اتخاذ قرار بعد" : "No decision yet"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* <DropdownMenuItem
                              onClick={() => handleView(session)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>{isRtl ? "عرض" : "View"}</span>
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() => handleEdit(session)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{isRtl ? "تعديل" : "Edit"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(session)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{isRtl ? "حذف" : "Delete"}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Session Modal */}
      <EditSessionModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        sessionId={selectedSessionId}
      />

      {/* Delete Session Dialog */}
      <DeleteSessionDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        session={sessionToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
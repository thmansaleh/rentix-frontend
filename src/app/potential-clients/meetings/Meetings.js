"use client";

import { useState } from "react";
import useSWR from "swr";
import meetingsApi from "../../services/api/meetings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, Monitor, Users, Search, Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { EditMeetingModal } from "./EditMeetingModal";
import { DeleteMeetingModal } from "./DeleteMeetingModal";
import { MeetingsFilterSearch } from "./MeetingsFilterSearch";

function Meetings() {
  const { t } = useTranslations();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: "",
    meet_result: "all",
    meeting_type: "all",
    date: ""
  });
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMeetingForDelete, setSelectedMeetingForDelete] = useState(null);
  const limit = 10;

  // SWR fetcher function
  const fetcher = () => {
    const params = {
      page,
      limit,
    };

    // Add filters if they exist
    if (filters.searchTerm) {
      params.search = filters.searchTerm;
    }
    if (filters.meet_result && filters.meet_result !== "all") {
      params.meet_result = filters.meet_result;
    }
    if (filters.meeting_type && filters.meeting_type !== "all") {
      params.meeting_type = filters.meeting_type;
    }
    if (filters.date) {
      params.date = filters.date;
    }

    return meetingsApi.getMeetings(params);
  };

  // Use SWR for data fetching
  const { data, error, isLoading, mutate } = useSWR(
    [`/meetings`, page, filters.searchTerm, filters.meet_result, filters.meeting_type, filters.date],
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Handle search from FilterSearch component
  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEditMeeting = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMeetingId(null);
  };

  const handleEditSuccess = () => {
    // Refresh the meetings data
    mutate();
  };

  const handleDeleteMeeting = (meeting) => {
    setSelectedMeetingForDelete(meeting);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedMeetingForDelete(null);
  };

  const handleDeleteSuccess = () => {
    // Refresh the meetings data
    mutate();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "scheduled": { color: "bg-blue-100 text-blue-800", label: t("meetings.results.scheduled") },
      "completed": { color: "bg-green-100 text-green-800", label: t("meetings.results.completed") },
      "cancelled": { color: "bg-red-100 text-red-800", label: t("meetings.results.cancelled") },
      "rescheduled": { color: "bg-yellow-100 text-yellow-800", label: t("meetings.results.rescheduled") },
      "no_show": { color: "bg-gray-100 text-gray-800", label: t("meetings.results.noShow") }
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getMeetingTypeIcon = (type) => {
    if (type === "online") {
      return <Monitor className="h-4 w-4 inline mr-1" />;
    } else if (type === "onsite") {
      return <Users className="h-4 w-4 inline mr-1" />;
    }
    return null;
  };

  const getMeetingTypeLabel = (type) => {
    if (type === "online") {
      return t("meetings.types.online");
    } else if (type === "onsite") {
      return t("meetings.types.onsite");
    }
    return "-";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            {t("meetings.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters - Now in separate component */}
          <MeetingsFilterSearch onSearch={handleSearch} />

          {/* Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">{t("meetings.messages.loading")}</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                <p>{t("meetings.messages.error")}</p>
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p>{t("meetings.messages.noResults")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("meetings.table.id")}</TableHead>
                    <TableHead>{t("meetings.table.client")}</TableHead>
                    <TableHead>{t("meetings.table.lawyer")}</TableHead>
                    <TableHead>{t("meetings.table.date")}</TableHead>
                    <TableHead>{t("meetings.table.time")}</TableHead>
                    <TableHead>{t("meetings.table.type")}</TableHead>
                    <TableHead>{t("meetings.table.status")}</TableHead>
                    <TableHead>{t("meetings.table.notes")}</TableHead>
                    <TableHead className="text-center">{t("meetings.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">{meeting.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{meeting.client_name || "-"}</div>
                          {meeting.client_phone && (
                            <div className="text-sm text-muted-foreground">{meeting.client_phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {meeting.lawyer_name || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(meeting.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {meeting.start_time && meeting.end_time ? (
                              <span>{formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}</span>
                            ) : meeting.start_time ? (
                              <span>{formatTime(meeting.start_time)}</span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getMeetingTypeIcon(meeting.meeting_type)}
                          {getMeetingTypeLabel(meeting.meeting_type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(meeting.meet_result)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={meeting.note}>
                          {meeting.note || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                        
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMeeting(meeting.id)}
                            title={t("meetings.actions.edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMeeting(meeting)}
                            title={t("meetings.actions.delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {data?.pagination && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {t("meetings.pagination.showing", {
                  count: data.data.length,
                  total: data.pagination.total
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  {t("meetings.pagination.previous")}
                </Button>
                <span className="text-sm">
                  {t("meetings.pagination.pageInfo", {
                    current: data.pagination.page,
                    total: data.pagination.totalPages
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= data.pagination.totalPages}
                >
                  {t("meetings.pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Meeting Modal */}
      <EditMeetingModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        meetingId={selectedMeetingId}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Meeting Modal */}
      <DeleteMeetingModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        meetingId={selectedMeetingForDelete?.id}
        meetingTitle={selectedMeetingForDelete ? `Meeting with ${selectedMeetingForDelete.client_name || 'Client'} on ${formatDate(selectedMeetingForDelete.date)}` : ''}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

export default Meetings;
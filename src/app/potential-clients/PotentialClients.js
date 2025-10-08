"use client";

import { useState } from "react";
import useSWR from "swr";
import { getAllClientsAgreements } from "../services/api/clientsAgreements";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { ClientDetailsModal } from "./ClientDetailsModal";
import { EditClientModal } from "./EditClientModal";
import { AddClientModal } from "./AddClientModal";
import { AddMeetingModal } from "./meetings/AddMeetingModal";
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
import { Eye, Edit, Calendar, Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

function PotentialClients() {
  const { t } = useTranslations();
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    status: undefined,
    type: undefined,
  });
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEditClientId, setSelectedEditClientId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMeetingClientId, setSelectedMeetingClientId] = useState(null);
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false);
  const limit = 10;

  // SWR fetcher function
  const fetcher = () => {
    const params = {
      page,
      limit,
    };

    // Add search parameters if they exist
    if (searchFilters.searchTerm) {
      // Send the same search term to both name and phone for broader search
      params.name = searchFilters.searchTerm;
      params.phone = searchFilters.searchTerm;
    }
    if (searchFilters.status) {
      params.status = searchFilters.status;
    }
    if (searchFilters.type) {
      params.type = searchFilters.type;
    }

    return getAllClientsAgreements(params);
  };

  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR(
    [`/clients-agreements`, page, searchFilters.searchTerm, searchFilters.status],
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleViewDetails = (id) => {
    setSelectedClientId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
  };

  const handleEditClient = (id) => {
    setSelectedEditClientId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditClientId(null);
  };

  const handleEditSuccess = () => {
    // Refresh the data after successful edit
    // SWR will automatically revalidate due to mutate in EditClientModal
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSuccess = () => {
    // Refresh the data after successful add
    // SWR will automatically revalidate due to mutate in AddClientModal
  };

  const handleAddMeeting = (clientId) => {
    setSelectedMeetingClientId(clientId);
    setIsAddMeetingModalOpen(true);
  };

  const handleCloseMeetingModal = () => {
    setIsAddMeetingModalOpen(false);
    setSelectedMeetingClientId(null);
  };

  const handleMeetingSuccess = () => {
    // Refresh the data after successful meeting add if needed
    // You can add SWR revalidation here if necessary
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTranslatedStatus = (status) => {
    if (!status) return "-";
    const statusMap = {
      "new": t("potentialClientsPage.status.new"),
      "": t("potentialClientsPage.status.contacted"),
      "Qualified": t("potentialClientsPage.status.qualified"),
      "Unqualified": t("potentialClientsPage.status.notQualified"),
      "Converted to Client": t("potentialClientsPage.status.convertToClient"),
      // Keep backward compatibility
      "New": t("potentialClientsPage.status.new"),
      "Contacted": t("potentialClientsPage.status.contacted"),
      "Converted": t("potentialClientsPage.status.qualified"),
      "Rejected": t("potentialClientsPage.status.notQualified"),
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("potentialClientsPage.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex justify-between items-center">
            <SearchBar onSearch={handleSearch} onAddNew={handleAddNew} />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">{t("potentialClientsPage.messages.loading")}</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                <p>{t("potentialClientsPage.messages.error")}</p>
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p>{t("potentialClientsPage.messages.noResults")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("potentialClientsPage.table.id")}</TableHead>
                    <TableHead>{t("potentialClientsPage.table.name")}</TableHead>
                    <TableHead>{t("potentialClientsPage.table.phone")}</TableHead>
                    <TableHead>{t("potentialClientsPage.table.status")}</TableHead>
                    <TableHead>{t("potentialClientsPage.table.source")}</TableHead>
                    <TableHead>{t("potentialClientsPage.table.createdBy")}</TableHead>
                    <TableHead>{t("potentialClientsPage.table.createdAt")}</TableHead>
                    <TableHead className="text-center">{t("potentialClientsPage.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phone || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            client.status === "جديد" || client.status === "New"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : client.status === "تم التواصل" || client.status === "Contacted"
                              ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                              : client.status === "مؤهل"
                              ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                              : client.status === "غير مؤهل"
                              ? "bg-red-50 text-red-700 ring-red-600/20"
                              : client.status === "تحويل موكل"
                              ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                              : "bg-gray-50 text-gray-600 ring-gray-500/10"
                          }`}
                        >
                          {getTranslatedStatus(client.status)}
                        </span>
                      </TableCell>
                      <TableCell>{client.source || "-"}</TableCell>
                      <TableCell>{client.created_by_name || "-"}</TableCell>
                      <TableCell>{formatDate(client.created_at)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(client.id)}
                            title={t("potentialClientsPage.messages.viewDetails")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClient(client.id)}
                            title={t("potentialClientsPage.messages.editClient")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAddMeeting(client.id)}
                            title={t("potentialClientsPage.messages.addMeeting")}
                          >
                            <Calendar className="h-4 w-4" />
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
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Results info */}
          {data?.pagination && (
            <div className="text-sm text-muted-foreground text-center">
              {t("potentialClientsPage.pagination.showing", {
                count: data.data.length,
                total: data.pagination.total
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <ClientDetailsModal 
        clientId={selectedClientId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Edit Client Modal */}
      <EditClientModal 
        clientId={selectedEditClientId}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />

      {/* Add Client Modal */}
      <AddClientModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
      />

      {/* Add Meeting Modal */}
      <AddMeetingModal 
        isOpen={isAddMeetingModalOpen}
        onClose={handleCloseMeetingModal}
        clientId={selectedMeetingClientId}
        onSuccess={handleMeetingSuccess}
      />
    </div>
  );
}

export default PotentialClients;

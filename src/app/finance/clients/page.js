"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Eye, Search, User, DollarSign, Phone, Flag, Users, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import ExportButtons from "@/components/ui/export-buttons";
import { getClientsForFinance } from "@/app/services/api/parties";
import ClientFinanceModal from "./components/ClientFinanceModal";

export default function FinanceClientsPage() {
  const t = useTranslations("common");
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const limit = 20;

  const exportColumnConfig = useMemo(() => ({
    name: {
      label: t("name"),
      dataKey: "name",
    },
    balance: {
      label: t("balance"),
      dataKey: "balance",
      formatter: (value) => {
        const numericValue = Number(value ?? 0);
        if (Number.isNaN(numericValue)) {
          return value ?? 0;
        }
        return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numericValue);
      },
    },
    phone: {
      label: t("phone"),
      dataKey: "phone",
    },
    nationality: {
      label: t("nationality"),
      dataKey: "nationality",
    },
  }), [language, t]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, error, isLoading, isValidating } = useSWR(
    `/parties/finance-clients?page=${currentPage}&limit=${limit}&search=${debouncedSearchTerm}`,
    () => getClientsForFinance(currentPage, limit, debouncedSearchTerm),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const isInitialLoading = !data && isLoading;
  const isRefreshing = isValidating && !!data;

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isInitialLoading) {
    return <div className="p-8 text-center">{t("loading")}</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{t("errorLoading")}</div>;
  }

  const clients = data?.data || [];
  const hasClients = clients.length > 0;
  const pagination = data?.pagination || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("financeClients")}</h1>
            <p className="text-sm text-gray-500">
              {t("managingClients")} ({pagination.total || 0})
            </p>
          </div>
        </div>

        {/* Search & Export */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-12 w-full pl-10 pr-10"
                aria-busy={isRefreshing}
              />
              {isRefreshing && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform animate-spin text-blue-500" />
              )}
            </div>
            {hasClients && (
              <ExportButtons
                data={clients}
                columnConfig={exportColumnConfig}
                language={language}
                exportName="finance_clients"
                sheetName={t("financeClients")}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {t("name")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      {t("balance")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {t("phone")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-gray-500" />
                      {t("nationality")}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">{t("noData")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${client.balance > 0 ? 'text-green-600' : client.balance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {client.balance || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{client.phone || "-"}</TableCell>
                      <TableCell className="text-gray-600">{client.nationality || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClient(client)}
                          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t("view")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="hover:bg-blue-50"
              >
                {t("previous")}
              </Button>
              <div className="px-4 py-2 bg-blue-50 rounded-md">
                <span className="font-medium text-blue-700">
                  {t("page")} {currentPage} {t("of")} {pagination.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="hover:bg-blue-50"
              >
                {t("next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClient && (
        <ClientFinanceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          clientBalance={selectedClient.balance}
        />
      )}
    </div>
  );
}

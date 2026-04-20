"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Search, ShieldBan } from 'lucide-react';
import { EditClientModal } from '../clients/EditClientModal';
import { DeleteClientModal } from '../clients/DeleteClientModal';
import { ViewClientModal } from '../clients/ViewClientModal';
import { ClientsTable } from '../clients/components/ClientsTable';
import { getBlockedCustomers } from '../services/api/customers';
import { toast } from 'react-toastify';
import { useTranslations } from '@/hooks/useTranslations';

export default function BlockedClientsPage() {
  const { t } = useTranslations();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [searchQuery]);

  const fetchCustomers = async (search = '') => {
    try {
      setIsLoading(true);
      const response = await getBlockedCustomers(search);
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Error fetching blocked customers:", error);
      toast.error(t('blockedClients.failedToLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const handleClientUpdated = (updatedClient) => {
    // If the client was unblocked (is_blacklisted = false), remove from list
    if (!updatedClient.is_blacklisted) {
      setCustomers(prev => prev.filter(c => c.id !== updatedClient.id));
    } else {
      setCustomers(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    }
  };

  const handleClientDeleted = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <ShieldBan className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('blockedClients.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('blockedClients.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('clients.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t('common.search')}
          </Button>
        </form>
      </Card>

      {/* Table Card */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ClientsTable
            customers={customers}
            searchQuery={searchQuery}
            onView={(id) => { setSelectedCustomerId(id); setIsViewModalOpen(true); }}
            onEdit={(id) => { setSelectedCustomerId(id); setIsEditModalOpen(true); }}
            onDelete={(customer) => { setSelectedCustomer(customer); setIsDeleteModalOpen(true); }}
            emptyMessage={searchQuery ? t('clients.noMatchingClients') : t('blockedClients.noBlockedClients')}
          />
        )}

        {/* Stats Footer */}
        {customers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{t('blockedClients.totalBlocked')}: {customers.length}</span>
              {searchQuery && (
                <span className="text-primary">
                  {t('clients.showingResultsFor')}: &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleClientUpdated}
        customerId={selectedCustomerId}
      />
      <DeleteClientModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleClientDeleted}
        customer={selectedCustomer}
      />
      <ViewClientModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        customerId={selectedCustomerId}
      />
    </div>
  );
}
